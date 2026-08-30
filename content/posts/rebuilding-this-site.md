---
title: Rebuilding this site as a résumé and a blog
date: '2026-08-30'
summary: >-
  The old site was a purchased portfolio theme carrying a decade of jQuery-era
  plugins. Here is what replaced it, and why the content now lives in two files.
lang: en
tags:
  - meta
  - nextjs
---

This site used to run on a bought portfolio theme. It looked fine, but every
page dragged along Bootstrap, Font Awesome, Isotope, Magnific Popup,
smooth-scrollbar, anime.js and a slider library — and the content loader was the
same forty lines of `fs.readdirSync` copy-pasted eight times, once per taxonomy.

Nothing in it was mine. The demo author was still called Artur Carter.

## What it runs on now

- **Next.js 16** with the App Router, statically rendered
- **React 19** and **TypeScript**
- **Tailwind CSS v4**, configured in CSS rather than a JS config file
- **unified / remark / rehype** with **Shiki** for syntax highlighting

No UI framework, no component library, no theme. The dependency list is short
enough to read in one screen, which is the point.

## Where the content lives

Three places, and that is the whole mental model:

```text
content/profile.ts      → facts: dates, URLs, repos, stacks
content/i18n/{en,ko,ja} → every translatable string
content/posts/*.md      → the blog
```

The split between the first two is the part worth explaining. A fact is stored
**once** — the date I joined freee, a repository's name, the languages a
project is written in. Only prose gets translated. Storing "2023-11" three
times is how three copies quietly drift apart.

Both halves are typed, so adding a role with a missing date, or a locale
missing a key, fails the build instead of rendering an empty span. A post is a
markdown file with frontmatter:

```yaml
---
title: A post
date: '2026-08-30'
summary: One or two sentences.
tags: [nextjs]
lang: en
draft: true
---
```

`lang` decides which language's blog the post appears under.

Setting `draft: true` keeps a post visible in `next dev` and out of the build,
the RSS feed and the sitemap.

## The résumé part

The home page *is* the résumé. It reads from the same typed data and prints
cleanly — `Cmd+P` drops the navigation, the footer and the "all repositories"
links, and expands the contact handles so the paper version still carries them.
One source of truth, two audiences — in three languages.

## What translation taught me about my own data model

I thought company names were facts. They are not: `freee K.K.`, `freee株式会社`
and `freee 주식회사` are the same company, and the Japanese page was rendering
one of them directly above another.

The location line made the same point louder. I had built it as
`{location} — from {origin}`, which quietly encodes English word order. Korean
puts the marker last (`대구 출신`), and so does Japanese (`韓国・大邱出身`).
Two translators, working independently, both bent their wording around it
rather than change code. When two people hit the same wall from opposite
sides, the wall is the bug.
