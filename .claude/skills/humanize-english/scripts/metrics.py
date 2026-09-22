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
    ("C-4", "S1", r"(?i)\w+n[’']t\b|\w+[’'](?:m|re|ve|ll|d)\b"),
    ("C-5", "S3", r"(?i)\b(?:it|that|there|here|what|who|where|how|he|she|let|when|why|everyone|everybody|someone|somebody|anyone|anybody|nobody|nothing|something)[’']s\b"),

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
    "C-4": "Every match is a violation; this register takes no contractions.",
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

FRONT_MATTER = re.compile(r"\A---\n.*?\n---\n", re.S)
FENCED = re.compile(r"(?ms)^(```+|~~~+).*?^\1[`~]*[ \t]*$")
INDENTED_CODE = re.compile(r"(?m)^(?: {4}|\t).*$")
INLINE_CODE = re.compile(r"`[^`\n]*`")
LINK_TARGET = re.compile(r"\]\([^)]*\)")
BLOCKQUOTE = re.compile(r"(?m)^>.*$")
HEADING_MARK = re.compile(r"(?m)^#{1,6}\s*")
TABLE_ROW = re.compile(r"(?m)^\|.*\|\s*$")
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


def front_matter_prose(text: str) -> str:
    """The `title` and `summary` values, which readers see on the index."""
    fm = FRONT_MATTER.match(text)
    if not fm:
        return ""
    values = []
    for m in FM_FIELD.finditer(fm.group(0)):
        value = re.sub(r"\A>-?[ \t]*\n?", "", m.group(1))
        values.append(re.sub(r"\s+", " ", value).strip())
    return "\n\n".join(v for v in values if v)


def strip_nonprose(text: str) -> str:
    """Remove everything that is not editable prose."""
    for pattern, repl in ((FRONT_MATTER, ""), (FENCED, " "),
                          (INDENTED_CODE, " "), (TABLE_ROW, " "),
                          (INLINE_CODE, " "), (LINK_TARGET, "]"), (URL, " "),
                          (BLOCKQUOTE, " ")):
        text = pattern.sub(repl, text)
    return HEADING_MARK.sub("", text)


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
    scanned = prose + "\n\n" + mask_protected(front_matter_prose(text), protected)
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


PROTECTED_TOKEN = re.compile(r"\d[\d,.]*|`[^`\n]+`|\b[A-Za-z]+[A-Z][A-Za-z]*\b|[\w./~-]+\.(?:py|sh|json|ttf|md)\b")


def protected_tokens(text: str) -> Counter[str]:
    return Counter(PROTECTED_TOKEN.findall(text))


def count_token(text: str, term: str) -> int:
    return len(re.findall(rf"(?<![\w-]){re.escape(term)}(?![\w-])", text))


def compare(before: str, after: str, protected: Iterable[str]) -> dict[str, Any]:
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
