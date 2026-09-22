#!/usr/bin/env python3
"""Diagnostics for English AI-writing patterns.

An editing aid, not an authorship classifier and not a detector-bypass score.
Mirrors the output contract of the humanize-korean / humanize-japanese scripts
so the three languages can be driven the same way.

    metrics.py <path|-> [--compact] [--compare AFTER] [--protect TERM]...

Front matter, fenced code, inline code, link targets and block quotes are
stripped before analysis: they are not prose and must never be edited.
"""
from __future__ import annotations

import argparse
import json
import re
import statistics
import sys
from collections import Counter
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Iterable

VERSION = "0.1.0"
DISCLAIMER = ("Editing diagnostics only; not an authorship classifier "
              "or detector-bypass score.")

# (id, severity, compiled pattern). Ordered by taxonomy section.
PATTERNS: list[tuple[str, str, re.Pattern[str]]] = [
    ("A-1", "S1", r"\b[Ii]n this (?:post|article|guide)\b|\bThis (?:post|article) (?:covers|explores|walks)\b"),
    ("A-2", "S1", r"\b[Hh]ere's the thing\b|\b[Tt]he thing is,|\b[Ll]et's (?:dive in|take a look|explore|get started)\b"),
    ("A-3", "S2", r"\bwhat (?:everyone|most people) gets? wrong\b|\bthe real reason\b|\bnobody (?:talks about|tells you)\b"),
    ("A-4", "S2", r"\b[Ww]hether you(?:'re| are) a\b"),

    ("B-1", "S1", r"\bmight potentially\b|\bcould possibly\b|\bmay perhaps\b|\bcan sometimes potentially\b"),
    ("B-2", "S2", r"\bcan be (?:beneficial|useful|helpful|valuable)\b|\bin some cases\b"),
    ("B-3", "S2", r"\b(?:significantly|substantially|considerably|dramatically) (?:faster|slower|better|worse|more|less|improved?)\b"),

    ("C-1", "S1", r"\b(?:leverag(?:e|es|ed|ing)|utiliz(?:e|es|ed|ing)|delve[sd]?|unpack(?:s|ed|ing)?|streamlin(?:e|es|ed|ing)|elevat(?:e|es|ed|ing)|unlock(?:s|ed|ing)?)\b"
                  r"|\brobust\b|\bseamless(?:ly)?\b|\bpowerful tool\b|\bgame[- ]chang(?:er|ing)\b|\bcutting[- ]edge\b|\btransformative\b"),
    ("C-2", "S2", r"\b(?:simply|just|easily|effortlessly)\b"),
    ("C-3", "S2", r"\bthe \w+(?:tion|ment|ance|ence|ity) of the \w+(?:tion|ment|ance|ence|ity) of\b"),
    ("C-4", "S1", r"(?i)\w+n[’']t\b|\w+[’'](?:m|re|ve|ll|d)\b"
                  r"|\b(?:it|that|there|here|what|who|where|when|why|how|he|she|let)[’']s\b"),
    ("C-5", "S3", r"(?i)\b(?:every|some|any|no)(?:\s+one|one|body|thing)[’']s\b"),

    ("D-1", "S2", r"(?m)^(?:Additionally|Furthermore|Moreover|That said|In addition|On the other hand)\b[,.]"),
    ("D-2", "S2", r"(?m)^(?:First(?:ly)?|Next|Then|Finally|Lastly)\b,"),
    ("D-3", "S2", r"\bThis means that\b|\bThis is because\b"),

    ("E-1", "S2", r"\bnot \w[\w\s'-]{0,30}?, but \w"),
    ("E-3", "S2", r"(?m)^[^\n?]{0,120}\?\s*$"),

    ("F-1", "S1", r"\b[Ii]n conclusion\b|\b[Tt]o sum up\b|\b[Aa]ll in all\b|\b[Aa]t the end of the day\b"),

    ("H-1", "S2", r"(?m)^\*\*[^*]{60,}\*\*\s*$"),
    ("H-3", "S3", r"(?m)^#{1,6} .*[\U0001F300-\U0001FAFF☀-➿]"),

    ("I-1", "S2", r"\bthrough the (?:use|process|implementation|application) of\b"),
    ("I-2", "S2", r"(?m)^(?:As for|Regarding|With regard to|In terms of)\b"),
    ("I-4", "S2", r"\bin the case (?:of|where)\b|\bat the time of\b"),
    ("I-6", "S2", r"(?m)^(?:Also|On the other hand|In addition)\b,"),
]
COMPILED = [(pid, sev, re.compile(rx)) for pid, sev, rx in PATTERNS]

# C-4 is the one pattern where a single match already decides: the register in
# write-post/references/voice.md admits no contractions. C-5 cannot decide,
# because the same `'s` is a possessive.
NOTES = {
    "C-4": "A violation unless it sits inside a verbatim quotation, which this cannot see.",
    "C-5": "Possessive or contraction — read each match in context.",
}

HEDGES = re.compile(
    r"\b(?:might|maybe|perhaps|possibly|potentially|arguably|somewhat|"
    r"relatively|fairly|rather|seems? to|appears? to|tends? to|"
    r"more or less|to some extent)\b", re.I)
CONNECTIVE_INITIAL = re.compile(
    r"^(?:Additionally|Furthermore|Moreover|However|Therefore|Thus|Hence|"
    r"Consequently|That said|In addition|On the other hand|Also|First(?:ly)?|"
    r"Second(?:ly)?|Next|Then|Finally|Lastly|In conclusion)\b", re.I)
PASSIVE = re.compile(
    r"\b(?:is|are|was|were|be|been|being|gets?|got)\s+(?:\w+ly\s+)?\w+(?:ed|en)\b", re.I)
NOMINALIZATION = re.compile(r"\b\w{4,}(?:tion|ment|ance|ence|ity|ness)\b", re.I)

FRONT_MATTER = re.compile(r"\A---\n(.*?)\n---\n", re.S)
FENCE_LINE = re.compile(r"\A([ \t]*)(`{3,}|~{3,})(.*)\Z")
BACKTICK_RUN = re.compile(r"`+")
BLANK_LINE = re.compile(r"\n[ \t]*\n")
LIST_MARKER = re.compile(r"\A {0,3}(?:[-*+]|\d{1,9}[.)])(?:[ \t]|\Z)")
LIST_PREFIX = re.compile(r"\A {0,3}(?:[-*+]|\d{1,9}[.)])[ \t]+")
LINK_TARGET = re.compile(r"\]\([^)]*\)")
BLOCKQUOTE_MARK = re.compile(r"\A {0,3}>")
BLOCK_START = re.compile(r"\A {0,3}(?:#{1,6}[ \t]|[-*+][ \t]|\d{1,9}[.)][ \t]"
                         r"|>|(?:`{3,}|~{3,})|(?:\*[ \t]*){3,}$|(?:-[ \t]*){3,}$"
                         r"|(?:_[ \t]*){3,}$)")
HEADING_MARK = re.compile(r"(?m)^#{1,6}\s*")
TABLE_RULE = re.compile(
    r"\A {0,3}\|?[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)*\|?[ \t]*\Z")
URL = re.compile(r"https?://\S+")


@dataclass
class Finding:
    id: str
    severity: str
    scope: str
    count: int
    reason: str
    note: str = ""
    matches: list[dict[str, Any]] | None = None


FM_FIELD = re.compile(r"(?ms)^(?:title|summary):[ \t]*(.*?)(?=^\S+:|\Z)")
BLOCK_SCALAR = re.compile(r"\A[>|][-+0-9]*[ \t]*(?:#[^\n]*)?\n?")
QUOTED_SCALAR = re.compile(
    r"\A'((?:[^']|'')*)'"
    r'|\A"((?:[^"\\]|\\.)*)"')
COMMENT_TAIL = re.compile(r"(?:(?<=\s)|\A)#.*\Z")


def front_matter_prose(text: str) -> str:
    """The `title` and `summary` values, which readers see on the index."""
    fm = FRONT_MATTER.match(text)
    if not fm:
        return ""
    values = []
    for m in FM_FIELD.finditer(fm.group(1)):
        raw = m.group(1)
        block = BLOCK_SCALAR.match(raw)
        value = re.sub(r"\s+", " ", raw[block.end():] if block else raw).strip()
        if block:
            values.append(value)
            continue
        quoted = QUOTED_SCALAR.match(value)
        if quoted and quoted.group(1) is not None:
            value = quoted.group(1).replace("''", "'")
        elif quoted:
            value = quoted.group(2).replace('\\"', '"')
        else:
            # An unquoted scalar ends at a comment, which never renders.
            value = COMMENT_TAIL.sub("", value).strip()
        values.append(value)
    return "\n\n".join(v for v in values if v)


def normalize_newlines(text: str) -> str:
    """`$`-anchored patterns below assume LF; stdin may hand us CRLF."""
    return text.replace("\r\n", "\n").replace("\r", "\n")


def fence_marker(line: str) -> tuple[int, str, int, str] | None:
    """Indentation, character, length and info string of a fence line."""
    m = FENCE_LINE.match(line)
    if not m:
        return None
    indent, mark, info = m.group(1), m.group(2), m.group(3)
    if mark[0] == "`" and "`" in info:
        return None
    return len(indent.expandtabs()), mark[0], len(mark), info


def escaped(text: str, position: int) -> bool:
    """An odd run of backslashes before `position` escapes what follows."""
    backslashes = 0
    while position - backslashes > 0 and text[position - backslashes - 1] == "\\":
        backslashes += 1
    return backslashes % 2 == 1


def strip_code_spans(text: str) -> str:
    """Blank out code spans, keeping the newlines so the layout survives.

    A backtick run opens a span and the next run of exactly the same length
    closes it, across line breaks but not across a blank line, because a span
    is inline. A run with no equal-length partner in the same block is
    literal text, and a backslash escapes an opening run but never a closing
    one. None of that survives a backtracking regex, which is happy
    to close a run of three with a run of two and carry off the prose in
    between.
    """
    runs = [m.span() for m in BACKTICK_RUN.finditer(text)]
    # A span lives inside one block, so a heading or a fence ends the
    # search just as a blank line does.
    breaks = [m.start() for m in BLANK_LINE.finditer(text)]
    at = 0
    for line in text.split("\n"):
        if BLOCK_START.match(line):
            breaks.append(at)
        at += len(line) + 1
    breaks.sort()
    out = list(text)
    i = 0
    while i < len(runs):
        start, end = runs[i]
        # A backslash escapes a backtick in prose but not inside a span, so
        # only an opener can be escaped away.
        if escaped(text, start):
            i += 1
            continue
        width = end - start
        limit = next((b for b in breaks if b > start), len(text))
        closer = next((j for j in range(i + 1, len(runs))
                       if runs[j][1] <= limit and runs[j][1] - runs[j][0] == width),
                      None)
        if closer is None:
            i += 1
            continue
        for k in range(start, runs[closer][1]):
            if out[k] != "\n":
                out[k] = " "
        i = closer + 1
    return "".join(out)


def strip_fences(text: str) -> str:
    """Blank out fenced blocks.

    A closing fence repeats the opener's character at least as many times,
    carries no info string, and sits no more than three spaces past the
    container margin — zero at the top level, the item's content column
    inside a list. A marker indented further is content, which is why one
    regex cannot do this.

    The container stack is not tracked, only whether a list is open, which is
    what decides whether a marker indented past three spaces is a fence or
    content. Nesting deeper than that needs a parser. An opener with no closer
    is left alone rather than swallowing the rest of the document: a gate that
    scans too much only costs a reading, while one that scans nothing reports
    zero and passes.
    """
    lines = text.split("\n")
    out = list(lines)
    opener: tuple[int, int] | None = None  # line, container margin
    char = ""
    length = 0
    in_list = False
    list_margin = 0
    for i, line in enumerate(lines):
        if opener is not None:
            fence = fence_marker(line)
            if fence and fence[1] == char and fence[2] >= length \
                    and not fence[3].strip() and fence[0] <= opener[1] + 3:
                for j in range(opener[0], i + 1):
                    out[j] = " "
                opener = None
            continue
        # A fence may start on the list-marker line, where its indentation is
        # measured from the item's content column.
        prefix = LIST_PREFIX.match(line)
        offset = len(prefix.group(0).expandtabs()) if prefix else 0
        if line.strip():
            if LIST_MARKER.match(line):
                in_list = True
                list_margin = offset or len(
                    LIST_MARKER.match(line).group(0).expandtabs())
            elif not line[:1].isspace():
                in_list, list_margin = False, 0
        fence = fence_marker(line[prefix.end():] if prefix else line)
        if not fence:
            continue
        indent, char, length, _info = fence
        indent += offset
        if indent > 3 and not in_list:
            continue
        # The closer is measured from the container margin — zero at the top
        # level, the item's content column inside a list — and not from
        # wherever the fence happened to open inside that item.
        opener = (i, list_margin if in_list else 0)
    return "\n".join(out)


def table_lines(text: str) -> tuple[set[int], list[str]]:
    """Which lines belong to a table, and the rows worth reading.

    A pipe does not make a table — prose is full of them — so the rule row
    underneath the header is what identifies one. Outer pipes are optional,
    which is why matching the row shape alone does not work.
    """
    lines = text.split("\n")
    owned: set[int] = set()
    rows: list[str] = []
    i = 0
    while i + 1 < len(lines):
        if "|" not in lines[i] or not TABLE_RULE.match(lines[i + 1]) \
                or "|" not in lines[i + 1]:
            i += 1
            continue
        owned.update((i, i + 1))
        rows.append(lines[i])
        j = i + 2
        while j < len(lines) and lines[j].strip() and "|" in lines[j]:
            owned.add(j)
            rows.append(lines[j])
            j += 1
        i = j
    return owned, rows


def strip_blockquotes(text: str) -> str:
    """Blank out block quotes, lazy continuations included.

    A quoted paragraph may drop the `>` on its later lines, so a line-marked
    match leaves the rest of the quotation sitting in the prose. Only a
    paragraph runs on that way: after a quoted heading, fence or list item the
    quote is closed and the next unmarked line is ordinary prose. It also ends
    at a blank line or at a line that starts a block of its own.
    """
    out = []
    quoting = False
    lazy = False
    for line in text.split("\n"):
        marked = BLOCKQUOTE_MARK.match(line)
        if marked:
            quoting = True
            quoted = line[marked.end():]
            quoted = quoted[1:] if quoted[:1] == " " else quoted
            lazy = bool(quoted.strip()) and not BLOCK_START.match(quoted)
        elif quoting and (not lazy or not line.strip()
                          or BLOCK_START.match(line)):
            quoting = False
        elif not quoting:
            out.append(line)
            continue
        out.append(" " if quoting else line)
    return "\n".join(out)


def strip_nonprose(text: str) -> str:
    """Remove everything that is not editable prose."""
    text = strip_fences(FRONT_MATTER.sub("", text, count=1))
    # Rows go before the span scan: each row is its own inline block, and
    # `table_prose` reads their cells.
    owned, _rows = table_lines(text)
    text = strip_code_spans("\n".join(
        " " if n in owned else line
        for n, line in enumerate(text.split("\n"))))
    text = strip_blockquotes(text)
    for pattern, repl in ((LINK_TARGET, "]"), (URL, " ")):
        text = pattern.sub(repl, text)
    return HEADING_MARK.sub("", text)


def table_prose(text: str) -> str:
    """Cell text from Markdown tables, which `strip_nonprose` drops whole."""
    body = strip_fences(FRONT_MATTER.sub("", text, count=1))
    cells: list[str] = []
    for row in table_lines(body)[1]:
        # A span cannot cross a cell, so split first — on the pipes that
        # divide cells, not on an escaped one, which belongs to the cell.
        # An even backslash run escapes itself and leaves the pipe a delimiter.
        row = "".join("\x00" if ch == "|" and escaped(row, i) else ch
                      for i, ch in enumerate(row))
        cells.extend(strip_code_spans(c).strip()
                     for c in row.strip().strip("|").split("|"))
    joined = "\n\n".join(c for c in cells if c)
    for pattern, repl in ((LINK_TARGET, "]"), (URL, " ")):
        joined = pattern.sub(repl, joined)
    return joined.replace("\x00", "|")


def mask_protected(text: str, protected: Iterable[str]) -> str:
    for term in sorted(protected, key=len, reverse=True):
        if term:
            text = text.replace(term, " ")
    return text


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z\"'(])", text)
    return [p.strip() for p in parts if p.strip()]


def split_paragraphs(text: str) -> list[str]:
    return [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]


def words(text: str) -> list[str]:
    return re.findall(r"[A-Za-z][A-Za-z'-]*", text)


def cv(values: list[int]) -> float:
    if len(values) < 2:
        return 0.0
    mean = statistics.fmean(values)
    return 0.0 if mean == 0 else round(statistics.stdev(values) / mean, 4)


def ratio(n: float, d: float) -> float:
    return 0.0 if not d else round(n / d, 4)


def load_thresholds(path: str | Path | None) -> dict[str, Any]:
    target = Path(path) if path else Path(__file__).resolve().parent.parent / "assets/baseline.json"
    return json.loads(target.read_text(encoding="utf-8"))


def analyze(text: str, protected: Iterable[str] = (), baseline: str | None = None) -> dict[str, Any]:
    th = load_thresholds(baseline)
    text = normalize_newlines(text)
    prose = mask_protected(strip_nonprose(text), protected)

    sentences = split_sentences(prose)
    paragraphs = split_paragraphs(prose)
    wordlist = words(prose)
    n_words = len(wordlist)

    s_lens = [len(words(s)) for s in sentences]
    p_lens = [len(words(p)) for p in paragraphs]
    openings = Counter(" ".join(words(s)[:2]).lower() for s in sentences if words(s))
    top_opening, top_opening_n = openings.most_common(1)[0] if openings else ("", 0)

    rhythm = {
        "sentence_length_mean": round(statistics.fmean(s_lens), 3) if s_lens else 0.0,
        "sentence_length_cv": cv(s_lens),
        "paragraph_length_cv": cv(p_lens),
        "top_opening": top_opening,
        "top_opening_share": ratio(top_opening_n, len(sentences)),
        "connective_initial_ratio": ratio(
            sum(1 for s in sentences if CONNECTIVE_INITIAL.match(s)), len(sentences)),
    }
    diction = {
        "hedge_per_100_words": ratio(len(HEDGES.findall(prose)) * 100, n_words),
        "em_dash_per_1000_words": ratio((prose.count("—") + prose.count(" -- ")) * 1000, n_words),
        "passive_ratio": ratio(len(PASSIVE.findall(prose)), len(sentences)),
        "nominalization_per_100_words": ratio(len(NOMINALIZATION.findall(prose)) * 100, n_words),
    }

    counts: dict[str, int] = {}
    findings: list[Finding] = []
    elsewhere = (front_matter_prose(text), table_prose(text))
    scanned = "\n\n".join(
        [prose, *(mask_protected(part, protected) for part in elsewhere if part)])
    for pid, sev, rx in COMPILED:
        hits = list(rx.finditer(scanned))
        counts[pid] = len(hits)
        if hits:
            findings.append(Finding(
                pid, sev, "span", len(hits),
                f"{pid}: {len(hits)} match(es)",
                NOTES.get(pid, "A single match is not evidence; check context first."),
                [{"text": h.group(0)[:60], "start": h.start()} for h in hits[:8]]))

    warnings: list[str] = []
    reliable = len(sentences) >= th["min_sentences"] and n_words >= th["min_words"]
    if not reliable:
        warnings.append("Below the reliability floor; treat every metric as advisory.")
    else:
        def flag(pid, sev, key, value, limit, below, reason):
            over = value < limit if below else value > limit
            if over:
                findings.append(Finding(pid, sev, "document", 1, reason,
                                        "Never rewrite on the metric alone.", []))
        flag("G-1", "S2", "sentence_length_cv", rhythm["sentence_length_cv"],
             th["sentence_length_cv_warning"], True,
             f"sentence-length CV {rhythm['sentence_length_cv']} below "
             f"{th['sentence_length_cv_warning']}")
        flag("G-2", "S2", "paragraph_length_cv", rhythm["paragraph_length_cv"],
             th["paragraph_length_cv_warning"], True,
             f"paragraph-length CV {rhythm['paragraph_length_cv']} below "
             f"{th['paragraph_length_cv_warning']}")
        flag("G-3", "S2", "top_opening_share", rhythm["top_opening_share"],
             th["top_opening_share_warning"], False,
             f"opening {top_opening!r} used in {rhythm['top_opening_share']:.0%} of sentences")
        flag("D-1", "S2", "connective_initial_ratio", rhythm["connective_initial_ratio"],
             th["connective_initial_ratio_warning"], False,
             f"connective-initial sentences {rhythm['connective_initial_ratio']:.0%}")
        flag("B-1", "S2", "hedge", diction["hedge_per_100_words"],
             th["hedge_per_100_words_warning"], False,
             f"hedges {diction['hedge_per_100_words']}/100 words")
        flag("H-2", "S3", "em_dash", diction["em_dash_per_1000_words"],
             th["em_dash_per_1000_words_warning"], False,
             f"em dashes {diction['em_dash_per_1000_words']}/1000 words")
        flag("I-5", "S2", "passive", diction["passive_ratio"],
             th["passive_ratio_warning"], False,
             f"passive constructions in {diction['passive_ratio']:.0%} of sentences")
        flag("C-3", "S2", "nominalization", diction["nominalization_per_100_words"],
             th["nominalization_per_100_words_warning"], False,
             f"nominalizations {diction['nominalization_per_100_words']}/100 words")

    return {
        "version": VERSION,
        "disclaimer": DISCLAIMER,
        "warnings": warnings,
        "counts": {"words": n_words, "sentences": len(sentences),
                   "paragraphs": len(paragraphs)},
        "rhythm": rhythm,
        "diction": diction,
        "pattern_counts": counts,
        "findings": [asdict(f) for f in findings],
    }


# A number ends in a digit: `2026.` at the end of a sentence is the same
# measurement as `2026`, and counting the full stop made it a different one.
PROTECTED_TOKEN = re.compile(r"\d(?:[\d,.]*\d)?|`[^`\n]+`|\b[A-Za-z]+[A-Z][A-Za-z]*\b|[\w./~-]+\.(?:py|sh|json|ttf|md)\b")


def protected_tokens(text: str) -> Counter[str]:
    return Counter(PROTECTED_TOKEN.findall(text))


def count_token(text: str, term: str) -> int:
    return len(re.findall(rf"(?<![\w-]){re.escape(term)}(?![\w-])", text))


def compare(before: str, after: str, protected: Iterable[str]) -> dict[str, Any]:
    before, after = normalize_newlines(before), normalize_newlines(after)
    lost = protected_tokens(before) - protected_tokens(after)
    added = protected_tokens(after) - protected_tokens(before)
    bw, aw = words(strip_nonprose(before)), words(strip_nonprose(after))
    import difflib
    same = sum(b.size for b in difflib.SequenceMatcher(a=bw, b=aw).get_matching_blocks())
    return {
        "change_rate": ratio(max(len(bw), len(aw)) - same, max(len(bw), len(aw), 1)),
        "protected_lost": dict(lost),
        "protected_added": dict(added),
        # Whole-token count: "MenloCJK" -> "MenloCJKX" must register as a loss.
        "explicit_protected_lost": {
            t: n for t in protected
            if (n := count_token(before, t) - count_token(after, t)) > 0},
        "explicit_protected_added": {
            t: n for t in protected
            if (n := count_token(after, t) - count_token(before, t)) > 0},
    }


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("path", help="UTF-8 Markdown path, or - for stdin")
    p.add_argument("--compare", metavar="AFTER", help="Compare against the edited file")
    p.add_argument("--protect", action="append", default=[], metavar="TERM",
                   help="Exact protected term; repeat for identifiers and product names")
    p.add_argument("--baseline", help="Override assets/baseline.json")
    p.add_argument("--compact", action="store_true", help="Print compact JSON")
    a = p.parse_args(argv)

    text = sys.stdin.read() if a.path == "-" else Path(a.path).read_text(encoding="utf-8")
    out: dict[str, Any] = {"analysis": analyze(text, a.protect, a.baseline)}
    if a.compare:
        after = Path(a.compare).read_text(encoding="utf-8")
        out["comparison"] = compare(text, after, a.protect)
        out["analysis_after"] = analyze(after, a.protect, a.baseline)
    print(json.dumps(out, ensure_ascii=False,
                     indent=None if a.compact else 2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
