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
    "apostrophes-both-shapes": (
        ["We're", "you've", "He'll", "It's", "didn't", "I'm",
         "didn’t", "I’m", "they’ve"],
        ["Everyone's"],
    ),
    "all-caps": (["DON'T", "WE'RE", "I'M", "YOU'VE", "HE'LL", "DiDn'T"], []),
    "front-matter-fields": (["it's", "We're", "doesn't"], []),
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
    "escaped-pipe-and-deep-closer": (["can't", "wasn't"], []),
    "table-without-outer-pipes": (["isn't", "doesn't"], []),
    "yaml-comment-and-lazy-quote": (["isn't", "isn't"], []),
    "span-across-blocks": (["can't", "can't"], []),
    "setext-and-quoted-code": (["can't", "wasn't"], []),
}

POSTS = HERE.parents[3] / "content" / "posts"


def matches(text: str, pattern_id: str, protect: list[str] | None = None) -> list[str]:
    """What the gate reports for one pattern, in the order it reports it."""
    found = metrics.analyze(text, protect or [])["findings"]
    for finding in found:
        if finding["id"] == pattern_id:
            return [m["text"] for m in finding["matches"]]
    return []


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
                # `matches` caps its list at eight; compare what it can show.
                self.assertEqual(matches(text, "C-4"), c4[:8])
                self.assertEqual(matches(text, "C-5"), c5[:8])

    def test_crlf_input_reads_the_same(self):
        """`-` takes stdin verbatim, and a CRLF file must not change a count."""
        for name in EXPECTED:
            with self.subTest(fixture=name):
                text = (FIXTURES / f"{name}.md").read_text(encoding="utf-8")
                self.assertEqual(matches(text.replace("\n", "\r\n"), "C-4"),
                                 matches(text, "C-4"))


class Posts(unittest.TestCase):
    """The rule this gate exists for: no contractions in the published prose."""

    def test_no_contractions_in_english_renditions(self):
        found = sorted(POSTS.glob("*/en.md"))
        self.assertTrue(found, f"no posts under {POSTS}")
        for path in found:
            with self.subTest(post=path.parent.name):
                text = path.read_text(encoding="utf-8")
                self.assertEqual(matches(text, "C-4"), [])
                self.assertEqual(matches(text, "C-5"), [])


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
