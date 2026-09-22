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
- `draft: true` keeps the post out of production. It stays visible in
  `next dev` and on Vercel preview deployments (`VERCEL_ENV=preview`), which
  is where a draft gets reviewed. Publishing means flipping `draft` to
  `false` in all three files at once.

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

## The opening

Drafts fail here, and no humanizer catches it — every tell below survived a
clean pass in all three languages. Read the opening of
`content/posts/obsidian-nas-remote-mcp/ko.md` before writing one: situation,
what was built, what actually took the time, and no author in sight.

- **No self-introduction.** A fact about the author earns its place inside a
  sentence already doing work — "일본에서 개발자로 일하다 보면 …" — never as its
  own declaration. A paragraph of background is a profile page.
- **Reach the evidence within three or four sentences.** Whatever the reader
  has to see — the pasted line, the error text, the measurement — comes early.
  Everything before it is setup, and setup is what bloats.
- **After a block, go to the cause, not to a description.** "That is Latin,
  kana and Hangul inside three lines" tells the reader what they just read.
  The next sentence says why it is a problem.
- **Vary sentence length.** Three short declaratives in a row read like a
  syllogism. One of them usually belongs inside the sentence before it.
- **Repository and install links are not opening material.** They go where
  installation is discussed, or at the end. A link handed out before the story
  starts has nothing to hold on to.
- **The `summary` says it differently.** It is read on the index and in the
  feed with nothing beside it, so it carries the same facts in its own words.
  A phrase in both `summary` and the first paragraph means one of them changes.

Banned outright: "この記事では〜を紹介します", "In this post I'll walk through…",
"이 글에서는 ~를 소개합니다".

A shape that works: the situation, the thing about it that bothered you, then
the example. The reader knows what to look for before they see it.

## Structure

- The opening has its own rules, above.
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

One skill per language, same contract in all three — severity levels, taxonomy
IDs, protected terms, Fast/Strict/diagnose-only modes, a metrics script:

| | Skill | Where it comes from |
|---|---|---|
| ko | `humanize-korean` | plugin `im-not-ai`, pinned `v2.3.2` |
| ja | `humanize-japanese` | plugin `im-not-ai-ja` |
| en | `humanize-english` | `.claude/skills/humanize-english/` in this repo |

The two plugins are enabled in `.claude/settings.json` **for this repo only**.
Nothing is installed into `~/.claude`; do not run either upstream repo's
`install.sh`. `humanize-english` is local because no English skill worth a
dependency exists — its reasoning is in its taxonomy, section I.

Drive all three the same way:

- Fast is the default and is right for a post of this length. `--strict` only
  for a long one.
- Pass the identifiers as protected terms every time: `MenloCJK`, `Orca`,
  `iTerm2`, `Chromium`, `fsSelection`, file paths, config keys, and every
  number. ko and ja take them as protected terms; `humanize-english` takes
  `--protect`.
- `--diagnose-only` when you want findings without a rewrite.
- Politeness is not an AI tell. `-습니다` and `です・ます` stay. Neither is flat
  declarative English — that is this blog's register.
- Report findings by taxonomy ID and give a reason for anything kept.
- A document-scope rhythm finding (`G-1`, `G-2`) is advisory. Technical prose
  full of identifiers clusters around the median legitimately, and all three
  taxonomies say not to rewrite on the number alone.

Verify each language with its own script:

```sh
python3 .claude/skills/humanize-english/scripts/metrics.py \
  content/posts/<slug>/en.md --protect MenloCJK --compact

python3 ~/.claude/plugins/marketplaces/im-not-ai-ja/skills/humanize-japanese/scripts/metrics.py \
  content/posts/<slug>/ja.md --compact
```

`references/voice.md` holds what no humanizer can know: the house voice and the
structural rules, for all three languages. Read it alongside, not instead.

## Checklist

1. All three files exist; `lang` matches each filename; `date` and `draft` agree.
2. At least one thing that did not work is in the post.
3. At least one real number, path or pasted output is in the post.
4. Nothing asserted that was not observed.
5. The opening survives its own checklist — no self-introduction, evidence
   early, no restatement after a block, `summary` worded differently.
6. Each language went through its skill — ko `humanize-korean`, ja
   `humanize-japanese`, en `humanize-english` — with the identifiers passed as
   protected terms. Findings reported by taxonomy ID, with a reason for
   anything kept, and no protected token lost.
7. The en rendition has no contractions — `humanize-english` reports `C-4: 0`,
   and every `C-5` match was read in context. C-5 does not catch a `'s` after
   a name, so this one is on you as well as the script.
8. `bun run build` passes, with the output shown.
