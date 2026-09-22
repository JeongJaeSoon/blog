# House voice

What no humanizer can know, because it is about this blog rather than about a
language. Applies to all three renditions equally.

Language-level AI tells are not here. Each language has a skill with a
taxonomy, and `write-post` says which:

- ko → `humanize-korean`
- ja → `humanize-japanese`
- en → `humanize-english`

Do not re-derive their rules here. A flat ban list is worse than a taxonomy
that weighs repetition, co-occurrence and register.

The voice itself is already on disk. Before editing, read one existing post in
the language you are working in: `content/posts/rebuilding-this-site/en.md` and
`content/posts/obsidian-nas-remote-mcp/ko.md` are the reference renditions.

## What the voice is

First person, past tense, specific. The author did a thing, some of it failed,
here are the parts worth keeping. Claims land flat and unhedged because they
were observed, not reasoned about.

> Nothing in it was mine. The demo author was still called Artur Carter.

> 막상 해보니 설치 순서보다 Portainer의 제약, CLI 옵션, MCP SDK 버전 차이를
> 알아내는 데 시간이 더 들었습니다.

Both name something real. Neither announces what the paragraph is going to do.

## Non-negotiable

- **Keep the dead ends.** The failed attempt and the wrong hypothesis are the
  most useful part of the post. They are also the first thing a tone pass
  smooths away — check they survived it.
- **Protect what was measured.** Identifiers, file paths, config keys,
  versions, every number, and any pasted output are not prose. An edit that
  "improves" `fsSelection` or rounds 1,185.8 has broken the post. Pass them as
  protected terms on every humanizer run.
- **Keep stated uncertainty uncertain.** If the draft says something was not
  verified, it stays not verified in all three languages.
- **One register per language, matching the existing posts.** Korean is
  `-습니다`체 throughout. Japanese is 丁寧体. English is measured and
  declarative, which here means **no contractions anywhere in the prose** —
  `did not`, not `didn't`; `it is`, not `it's`; `cannot`, not `can't`. This
  is a property of the finished post, not a restriction on the tone pass: a
  contraction is as wrong when it comes from the first draft as when a
  humanizer adds one. Possessives (`Menlo's`) are not contractions.

  ```sh
  rg -in "\w+n[’']t\b|\w+[’'](m|re|ve|ll|d)\b|\b(it|that|there|here|what|who|where|how|he|she|let)[’']s\b" content/posts/*/en.md
  ```

  Three alternatives, because `'s` is the only ambiguous one. `n't` and
  `'m/'re/'ve/'ll/'d` are never possessive, so they match on any word; `'s`
  matches only after the pronouns and wh-words that cannot take a possessive.
  Both apostrophes are covered, and `-i` catches a capitalised `It's`.

## Structure, all three languages

- Open on the concrete situation, never on what the article will cover.
- Headings say what the section concludes, not what it is about.
- Code blocks and tables hold pasted, real content. A table that restates the
  prose beside it is noise; delete it.
- Sections differ in length. Three evenly sized sections means an outline got
  published.
- Stop when the content stops. A closing section is allowed only when it adds
  something absent above: what is unsolved, what to do next, what you would do
  differently.

## Structural tells

- Every section the same length.
- Every section ending with a sentence that restates the section.
- A closing summary that lists each heading back as a bullet.
- Bold applied to whole sentences rather than to a term.
- A table whose cells are adjectives.
- No dead ends anywhere. Real work has them; a post without any was not written
  from real work.
