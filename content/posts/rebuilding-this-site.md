---
title: Rebuilding this site as a résumé and a blog
date: '2026-08-30'
summary: >-
  The old site was a purchased portfolio theme carrying a decade of jQuery-era
  plugins. Here is what replaced it, and why the content now lives in two files.
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

Two places, and that is the whole mental model:

```text
content/profile.ts   → everything the résumé renders
content/posts/*.md   → everything the blog renders
```

`profile.ts` is typed, so adding a role with a missing date fails the build
instead of rendering an empty span. A post is a markdown file with frontmatter:

```yaml
---
title: A post
date: '2026-08-30'
summary: One or two sentences.
tags: [nextjs]
draft: true
---
```

Setting `draft: true` keeps a post visible in `next dev` and out of the build,
the RSS feed and the sitemap.

## The résumé part

The home page *is* the résumé. It reads from the same typed data and prints
cleanly — `Cmd+P` drops the navigation, the footer and the "all repositories"
links, and expands the contact handles so the paper version still carries them.
One source of truth, two audiences.
