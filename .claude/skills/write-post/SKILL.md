---
name: write-post
description: Write, render into the other languages, or revise an article in this blog. Covers the content/posts/<slug>/{en,ko,ja}.md contract and the house voice, and strips the AI-essay tone. Use for any new post, any edit under content/posts/, and for "블로그 글 써줘", "포스트 추가", "글이 AI 같아", "記事を書いて", "write a post", "make this sound less like AI".
---

# Writing a post

## The contract

`lib/posts.ts` throws at build time when any of this is wrong, so get it right first.

One directory per article, three files, no exceptions:

```text
content/posts/<slug>/en.md
content/posts/<slug>/ko.md
content/posts/<slug>/ja.md
```

- `<slug>` — lowercase kebab, names the subject and not the format, carries no date.
- `title`, `summary` — per language, written in that language.
- `date` (`'YYYY-MM-DD'`, quoted) and `draft` — identical in all three, or the build fails.
- `lang` — must equal the filename.
- `tags` — lowercase kebab, shared across the three files. Reuse existing tags before inventing one: `rg '^  - ' content/posts/*/en.md | sort -u`.
- `draft: true` hides the post from `bun run build` while leaving it visible in `next dev`.

Verify with `bun run build` and paste the result. A post is not done until that passes.

## Before writing a word

Do not start from an outline. These posts are worth reading because they carry
what only the author knows: the number actually measured, the hypothesis that
turned out wrong, the one setting that was the cause. An outline cannot produce
any of that, and a draft built on one reads like every other AI post.

Collect first, from the author, the repo, shell history, tickets or the terminal:

- the symptom in the words it actually appeared in
- what was tried that did not work, and why it failed
- real numbers, file paths, config keys, versions, pasted error text
- what is still unresolved

If there is no failed attempt and no concrete number, the post is not ready.
Say so rather than padding it out.

Never invent an experience, a measurement or a source. A number nobody measured
is worse than no post.

## Structure

- Open on the concrete situation. "この記事では〜を紹介します" / "In this post
  I'll walk through…" / "이 글에서는 ~를 소개합니다" are banned openings.
- Headings state what the section concludes, not what it is about — "Where the
  content lives", not "Content".
- Code blocks and tables hold pasted, real content. A table that restates the
  prose beside it is noise; delete it.
- Let sections differ in length. Three evenly sized sections means an outline
  got published.
- Stop when the content stops. A `まとめ` / `정리` / `Conclusion` section is
  allowed only when it adds something absent above: what is unsolved, what to do
  next, what you would do differently.

## One language first

Write one language properly — whichever one the thinking happened in — then
render the other two from it. Never draft three in parallel; they drift.

Rendering is not sentence-by-sentence translation. Facts, structure, stance and
code stay identical; the sentences are native. A Korean sentence that preserves
English clause order is a tell, and so is a Japanese one that keeps the Korean
subject stated.

## Removing the AI tone

Do this as a separate pass, after the draft is finished. Editing for tone while
drafting produces neither.

Two of the three languages have a real taxonomy behind them. Use it — do not
hand-roll style rules for ko or ja in this repo.

| | Owner | Enabled by |
|---|---|---|
| ko | `humanize-korean` skill — 10 categories, 70 patterns | `.claude/settings.json` (plugin `im-not-ai`, pinned `v2.3.2`) |
| ja | `humanize-japanese` skill — taxonomy + `metrics.py` | `.claude/settings.json` (plugin `im-not-ai-ja`) |
| en | `references/voice.md` + `scripts/tells.sh` | this repo — no equivalent skill exists |

Both plugins are enabled for **this repo only**. Nothing is installed into
`~/.claude`; do not run either repo's `install.sh`.

How to drive them:

- Default (Fast) is right for a post of this length. Reach for `--strict` only
  past ~8,000 characters.
- Pass the identifiers as protected terms so they cannot be "improved":
  `MenloCJK`, `Orca`, `iTerm2`, `Chromium`, `fsSelection`, file paths, every
  number. The Japanese skill takes them via `metrics.py --protect`.
- `--diagnose-only` when you want the findings without a rewrite.
- Politeness is not an AI tell. `です・ます` and `-습니다` stay; both skills say
  so explicitly and both are this blog's register.
- Report findings by their taxonomy ID, and say why you kept anything you kept.

For ja you can check the result yourself:

```sh
python3 ~/.claude/plugins/marketplaces/im-not-ai-ja/skills/humanize-japanese/scripts/metrics.py \
  content/posts/<slug>/ja.md --compact
```

A `G-1` (low sentence-length CV) finding is document-scope and advisory — the
taxonomy says not to rewrite on the number alone. Technical prose full of
identifiers clusters around the median legitimately.

For **en**, apply `references/voice.md`, then run `scripts/tells.sh` and resolve
every hit or justify it.

## Checklist

1. All three files exist; `lang` matches each filename; `date` and `draft` agree.
2. At least one thing that did not work is in the post.
3. At least one real number, path or pasted output is in the post.
4. Nothing asserted that was not observed.
5. ko went through `humanize-korean`, ja through `humanize-japanese`, en
   through `references/voice.md` + `scripts/tells.sh`. Findings reported by
   taxonomy ID, with a reason for anything kept.
6. `bun run build` passes, with the output shown.
