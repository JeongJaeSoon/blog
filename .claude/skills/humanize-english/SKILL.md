---
name: humanize-english
description: Edit English prose that reads like AI wrote it, preserving meaning, numbers, identifiers, quotations, modality and register. Detects preview openings, throat-clearing, inflated diction, hedging, connective scaffolding, rhetorical templates, recap closings, uniform rhythm, and Korean/Japanese translationese. Use for "make this sound less like AI", "AI 톤 줄여줘", "영어 글 다듬어줘", "humanize", "humanize English", or an English style review. Not for proofreading, translation, adding facts, or detector evasion.
---

# Humanize English

Improve the writing. Do not disguise authorship.

Same contract as `humanize-korean` and `humanize-japanese`, so all three
languages in this repo are driven the same way.

## 0. Top-priority contract

1. Preserve facts, claims, numbers, dates, units, identifiers, file paths,
   config keys, versions, quotations, code and URLs.
2. Preserve the strength of negation, possibility, obligation, condition,
   causation and sequence. Stated uncertainty stays uncertain.
3. Preserve the register and the person. Flat declarative sentences and first
   person are this blog's voice, not tells.
4. Add no experience, feeling, source, example or opinion that is not already
   in the draft.
5. Change nothing that has no taxonomy ID behind it.
6. Above 150 words and 5 sentences, warn past a 30% change rate and stop at
   50%, reverting to the safe version. Below that, judge by edit count and
   meaning preservation instead.

## 1. Reference files

- Always read `references/quick-rules.md`.
- Read `references/ai-tell-taxonomy.md` for Strict, diagnose-only, or whenever
  asked to justify a finding.
- Run `scripts/metrics.py` when you want measurements or a before/after
  comparison. It reads `assets/baseline.json` for thresholds.

Paths resolve relative to this `SKILL.md`.

## 2. Modes

**Fast** (default) — diagnose, rewrite and self-check in one pass. Right for
anything under ~2,000 words.

**Strict** — `--strict`, or over ~2,000 words, or when precision matters:

1. Detect: produce span-level findings, no rewriting.
2. Rewrite: touch only the spans that have findings.
3. Fidelity audit: check identifiers, numbers, dates, units, quotations, code,
   claim polarity, modality, causation and sequence against the original.
4. Naturalness review: check for remaining S1/S2, over-editing and register
   drift.
5. Re-run only the mismatches, at most twice.

Do not blend the phases. The detector does not rewrite; the rewriter does not
touch un-flagged text; the audit does not score style.

**Diagnose only** — `--diagnose-only`: return ID, span, severity, reason and a
suggested fix. Change nothing.

## 3. Context

State a one-line assumption for each before editing: reader, medium, genre,
register. On this blog it is one engineer reading, a technical post, measured
declarative register, first person. An explicit instruction beats the guess.

## 4. Fast procedure

1. Read the draft. Under 5 sentences, mark the rhythm metrics unreliable.
2. Read the quick rules.
3. Fix the do-not-touch spans first. Pass identifiers and product names to
   `metrics.py --protect`; automatic extraction will miss them.
4. Collect findings S1 before S2. One word match is not an S1.
5. Edit in order: set phrases → structure → connectives → syntax and diction →
   translationese → rhythm → formatting.
6. Run the six-item self check in the quick rules.
7. Compare before and after if the edit was substantial.

```sh
python3 .claude/skills/humanize-english/scripts/metrics.py \
  content/posts/<slug>/en.md --protect MenloCJK --protect fsSelection --compact
```

```sh
python3 .claude/skills/humanize-english/scripts/metrics.py \
  before.md --compare content/posts/<slug>/en.md --protect MenloCJK --compact
```

`explicit_protected_lost` and `protected_lost` must both come back empty. If
a number or identifier changed, the edit is wrong — revert it, do not reword
it. `explicit_protected_added` and `protected_added` are the other direction:
a term the pass introduced. That is not automatically wrong — a pronoun
resolved back to the name it stands for is an improvement — but it is never
something to do silently, so read each one.

## 5. Translationese

English on this blog is rendered from Korean, so section I of the taxonomy is
the most likely real problem, ahead of generic slop. Look for `through` chains,
topic-comment order kept from the Korean, every sentence opening with "I",
`in the case of` from `경우`, passives standing in for Korean impersonal
constructions, and a literal connective at the head of every paragraph.

## 6. Output

When rewriting:

1. One line: `Done. change X% / grade Y / self-check N/6 / register preserved`.
2. The edited text.
3. Real findings only, 0–6 of them, as `ID: before → after`. Write `no findings`
   when there are none. A 0% change is a success.
4. Anything kept on purpose, with the reason.
5. Anything uncertain, marked as such rather than resolved.

When diagnosing: a table of `ID / severity / span / reason / suggested fix`.

## 7. Grade

- **A** — no S1 left, self-check 6/6, register preserved.
- **B** — no S1 left, self-check 5/6, a context call still open.
- **C** — S1 remains, or over 30% on a long text, or register uncertain.
- **D** — meaning, numbers, quotations or register at risk. Discard the result
  and return the original.

## 8. Not for

Evading AI detectors, disguising authorship, or hiding sources. If that is the
only stated goal, say the skill does not guarantee it and offer an ordinary
edit with the sources named instead.
