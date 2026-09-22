#!/usr/bin/env python3
"""Regression tests for the prose extraction behind C-4 and C-5.

    python3 .claude/skills/humanize-english/tests/test_metrics.py

Every fixture under `fixtures/` is one Markdown or YAML construct that the
stripper once got wrong, and each expectation below is the exact list of
matches the gate must report for it. The point is not the count: a gate that
misses a contraction reports zero and passes, so the assertion names the
strings, and a fixture that stops finding one fails loudly.

Contractions inside code — fenced, spanned, quoted or pasted — must never
appear in these lists. Those are the false positives that would have an author
edit a pasted terminal line.

Where the stripper has to guess it guesses towards reading, so a construct it
cannot parse is scanned rather than skipped. Two such readings are asserted
below exactly as they stand, not as they ought to be: they cost the author a
look, never a silent pass, and stating them this way means a crash fails the
suite and a real fix shows up as a failure to come and read.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "scripts"))
sys.dont_write_bytecode = True

import metrics  # noqa: E402

FIXTURES = HERE / "fixtures"

# fixture -> (C-4 matches, C-5 matches). Order follows the text.
EXPECTED: dict[str, tuple[list[str], list[str]]] = {
    "straight-apostrophes": (
        ["We're", "you've", "He'll", "It's", "didn't", "I'm"], ["Everyone's"],
    ),
    "empty-edge-cells": (["can't", "isn't"], []),
    "nbsp-edged-row": (["can't"], []),
    "table-on-a-list-marker": (["can't"], []),
    "curly-apostrophes": (
        ["didn’t", "I’m", "they’ve"], ["Everyone’s"],
    ),
    "all-caps": (["DON'T", "WE'RE", "I'M", "YOU'VE", "HE'LL", "DiDn'T"], []),
    "front-matter-fields": (["We're", "doesn't"], []),
    "wh-words-and-possessives": (["When's", "Why's"], ["Everyone's"]),
    "quoted-scalar-and-indented-fence": (["it's", "It's", "Why's"], ["Everyone's"]),
    "indefinite-pronouns-and-list-fences": (
        [], ["Everything's", "anything's", "no one's"],
    ),
    "table-cells": (["doesn't"], ["everything's"]),
    "false-fence-closer": (["doesn't"], ["everyone's"]),
    "unclosed-marker-and-info-string": (["isn't", "we're", "wasn't"], []),
    "mismatched-backtick-runs": (["isn't", "wasn't", "aren't"], []),
    "wide-runs-and-multiline-span": (["isn't", "aren't"], []),
    "escaped-backticks-and-stray-markers": (["doesn't", "wasn't"], []),
    "fence-on-marker-line": (["can't", "can't"], []),
    # GFM reads these rows as a paragraph, because the header divides into
    # three cells and the rule into two, and the span there hides `can't`.
    # The gate reads them as a table anyway and reports it. See
    # `test_a_cell_count_mismatch_is_not_a_table`.
    "escaped-pipe-and-deep-closer": (["can't", "wasn't"], []),
    "table-without-outer-pipes": (["isn't", "doesn't"], []),
    "yaml-comment-and-lazy-quote": (["isn't", "isn't"], []),
    "span-across-blocks": (["can't", "can't"], []),
    "setext-and-quoted-code": (["can't", "wasn't"], []),
}

POSTS = HERE.parents[3] / "content" / "posts"


def reported(text: str, pattern_id: str) -> tuple[int, list[str]]:
    """The gate's total for one pattern, and the spans it shows for it.

    `analyze` shows at most eight matches, so the list alone cannot tell a
    ninth contraction from a lost one. The count comes back beside it.
    """
    for finding in metrics.analyze(text, [])["findings"]:
        if finding["id"] == pattern_id:
            return finding["count"], [m["text"] for m in finding["matches"]]
    return 0, []


class Fixtures(unittest.TestCase):
    """Each fixture is a construct the stripper once read wrong."""

    def test_every_fixture_is_covered(self):
        on_disk = {p.stem for p in FIXTURES.glob("*.md")}
        self.assertEqual(on_disk, set(EXPECTED),
                         "a fixture without an expectation proves nothing")

    def test_reported_matches(self):
        for name, (c4, c5) in EXPECTED.items():
            with self.subTest(fixture=name):
                text = (FIXTURES / f"{name}.md").read_text(encoding="utf-8")
                self.assertEqual(reported(text, "C-4"), (len(c4), c4[:8]))
                self.assertEqual(reported(text, "C-5"), (len(c5), c5[:8]))

    def test_crlf_input_reads_the_same(self):
        """`-` takes stdin verbatim, and a CRLF file must not change a count."""
        for name in EXPECTED:
            with self.subTest(fixture=name):
                text = (FIXTURES / f"{name}.md").read_text(encoding="utf-8")
                self.assertEqual(reported(text.replace("\n", "\r\n"), "C-4"),
                                 reported(text, "C-4"))


# Neither pattern is an automatic defect. C-4 allows a contraction inside a
# verbatim quotation, and C-5 catches possessives as readily as contractions,
# so both need a reading. A match that survived that reading is recorded here
# by slug, and the post ships with it; anything else is a regression.
#
# ponytail: an entry records the text and the count, not where it sits, so
# swapping an approved quoted match for an unquoted one elsewhere in the same
# post would still pass. Record the surrounding line once this stops being
# empty.
ALLOWED: dict[str, tuple[list[str], list[str]]] = {}


class Posts(unittest.TestCase):
    """The rule this gate exists for, as the posts actually stand."""

    def test_english_renditions_report_only_what_was_read_and_kept(self):
        found = sorted(POSTS.glob("*/en.md"))
        self.assertTrue(found, f"no posts under {POSTS}")
        for path in found:
            slug = path.parent.name
            c4, c5 = ALLOWED.get(slug, ([], []))
            with self.subTest(post=slug):
                text = path.read_text(encoding="utf-8")
                self.assertEqual(reported(text, "C-4"), (len(c4), c4[:8]))
                self.assertEqual(reported(text, "C-5"), (len(c5), c5[:8]))


class Extraction(unittest.TestCase):
    """The stripper's own rules, stated directly rather than through a count."""

    def test_fence_closes_only_at_the_container_margin(self):
        text = "   ```text\n   can't\n      ```\n   still code\n   ```\nprose\n"
        self.assertNotIn("can't", metrics.strip_nonprose(text))
        self.assertIn("prose", metrics.strip_nonprose(text))

    def test_unclosed_fence_leaves_the_rest_alone(self):
        text = "    ```\n\nThis paragraph isn't code.\n"
        self.assertIn("isn't", metrics.strip_nonprose(text))

    def test_code_span_needs_an_equal_run(self):
        self.assertIn("isn't", metrics.strip_code_spans("```isn't`` stays"))
        self.assertNotIn("isn't", metrics.strip_code_spans("``isn't`` goes"))

    def test_code_span_stops_at_a_block_boundary(self):
        # No blank line between them, so only the block rule can stop the span.
        text = "# a `\nIt can't pass.\n# b `\n"
        self.assertIn("can't", metrics.strip_code_spans(text))

    def test_block_quote_continues_only_after_a_paragraph(self):
        para = "> quoted\ncan't continue\n"
        self.assertNotIn("can't", metrics.strip_blockquotes(para))
        heading = "> # quoted heading\ncan't continue\n"
        self.assertIn("can't", metrics.strip_blockquotes(heading))

    def test_front_matter_keeps_only_the_rendered_value(self):
        text = ("---\nlang: en\ntitle: A title # it's a note\n"
                "summary: 'It''s ready'\n---\n\nBody.\n")
        self.assertEqual(metrics.front_matter_prose(text),
                         "A title\n\nIt's ready")

    def test_table_cells_are_prose_and_code_spans_are_not(self):
        text = "| a | `can't` |\n|---|---|\n| b | it doesn't |\n"
        cells = metrics.table_prose(text)
        self.assertIn("doesn't", cells)
        self.assertNotIn("can't", cells)

    def test_a_cell_count_mismatch_still_reads_as_a_table(self):
        """A known over-reading, stated as it stands rather than as it should be.

        Verified against this repo's own remark-gfm: a header of three cells
        over a rule of two is one paragraph, where a span hides what it holds.
        Comparing the two rows' cell counts does close it, and a branch that
        did so had four valid table shapes rejected in review — a list marker,
        an empty edge cell, a non-breaking space, a wide marker's margin —
        each one turning a real contraction into a silent pass. The count is
        the only rule here that errs towards reading less, which is why it is
        not in the file: a malformed table costs a reading, a valid one this
        refuses to see costs the contraction.

        Fixing it makes this fail. Assert the cells are gone at that point.
        """
        text = "| a | b | c |\n|---|---|\n| `can't` | d | e |\n"
        self.assertEqual(metrics.table_prose(text).split("\n\n"),
                         ["a", "b", "c", "d", "e"])

    def test_top_level_indented_code_still_reads_as_prose(self):
        """A known limit, stated the same way and for the same reason.

        Reading a four-space block right means tracking paragraph and list
        context, which nothing here does. `write-post/references/voice.md` says
        to fence pasted output rather than indent it, so the cost is a reading,
        not a wrong edit. Fixing it makes this fail; flip it to `assertNotIn`.
        """
        text = "Before.\n\n    it's pasted output\n\nAfter.\n"
        self.assertIn("it's", metrics.strip_nonprose(text))


class Protection(unittest.TestCase):
    """What `--compare` must refuse to let an edit lose."""

    def test_sentence_final_period_is_not_part_of_a_number(self):
        moved = metrics.compare("Measured 2026.", "It was 2026 when measured.", [])
        self.assertEqual(moved["protected_lost"], {})
        self.assertEqual(moved["protected_added"], {})

    def test_a_renamed_identifier_is_lost_and_added(self):
        renamed = metrics.compare("MenloCJK ships.", "MenloCJKX ships.",
                                  ["MenloCJK", "MenloCJKX"])
        self.assertEqual(renamed["explicit_protected_lost"], {"MenloCJK": 1})
        self.assertEqual(renamed["explicit_protected_added"], {"MenloCJKX": 1})


if __name__ == "__main__":
    unittest.main(verbosity=2)
