# jeongjaesoon.dev

Personal site — a résumé on the home page and a blog under `/blog`, from one
codebase.

Next.js 16 (App Router, fully static) · React 19 · TypeScript · Tailwind CSS v4 ·
remark/rehype with Shiki. No UI framework and no theme.

## Develop

```bash
bun install
bun dev        # http://localhost:3000 — drafts are visible here
bun run build
bun run lint
bun run typecheck
```

## Structure

| What | Where |
| --- | --- |
| Résumé — profile, experience, projects, skills, education | `content/profile.ts` |
| Blog posts | `content/posts/<slug>/{en,ko,ja}.md` |
| Site title, description, URL, nav | `lib/site.ts` |
| Design tokens, base and print styles | `app/globals.css` |

Each blog article has one directory named after its shared URL slug. The
directory contains `en.md`, `ko.md` and `ja.md`; a missing rendition fails the
build so the language switcher cannot lead to a 404.

Everything else is layout. `content/profile.ts` is typed, so an entry missing a
required field fails `bun run build` rather than rendering a blank.

Light and dark palettes are the same set of CSS variables with different
values, so every utility keeps working in both. Dark follows the system
preference.

### Using it as a résumé

The home page prints. `Cmd+P` drops the nav, footer, and "all repositories"
link, and reveals the contact handles so the PDF still carries them.

### Adding a post

Create `content/posts/my-post/`, then `en.md`, `ko.md` and `ja.md` inside it.
Each one carries the same frontmatter except `title`, `summary` and `lang`:

```yaml
---
title: My post
date: '2026-09-01'
summary: One or two sentences, used on the index and in the RSS feed.
lang: en
tags:
  - platform
  - mcp
draft: false
---
```

`lang` must match the filename, and `date` and `draft` must agree across the
three or the build fails. `draft: true` keeps a post out of production while
leaving it visible in `bun dev` and on Vercel preview deployments, which is
where a draft gets reviewed; it never reaches the RSS feed or the sitemap.
Reading time is computed; do not set it.

`.claude/skills/write-post/` carries the rest — the contract `lib/posts.ts`
enforces, the house voice, the opening rules, and which humanizer runs on
which language.

Tag pages (`/blog/tag/<tag>`), `/rss.xml`, `/sitemap.xml` and `/robots.txt` are
generated from the posts — nothing to register by hand.

### A note on the writing skills

`write-post` and `humanize-english` under `.claude/skills/` are written for
this repo. Before the opening rules went into `write-post`, these were looked
at and none of them was used:

- [NomaDamas/k-skill](https://github.com/NomaDamas/k-skill) — its
  `korean-humanizer` states in its own README that the taxonomy, severity
  levels and change-rate guards are a repackaging of
  [epoko77-ai/im-not-ai](https://github.com/epoko77-ai/im-not-ai), which this
  repo already pins directly at `v2.3.2`.
- [modu-ai/cc-plugins](https://github.com/modu-ai/cc-plugins) —
  `astory-blog-writers` synthesises author personas, which a blog that refuses
  to write anything unmeasured has no use for.
- [eyedroot/marketplace](https://github.com/eyedroot/marketplace) —
  `korean-style` flags sentence length and clause density, which the three
  humanizers already measure at document scope.

The opening rules come from this repo's own drafts instead: each bullet is
something a finished post got wrong after every humanizer had passed it.

## Deploy

Deployed on Vercel; the origin used for canonical URLs, RSS and the sitemap is
resolved in `lib/site.ts` from `VERCEL_PROJECT_PRODUCTION_URL`, so no
configuration is needed. Once a custom domain is attached, either let Vercel report it or pin it
with `NEXT_PUBLIC_SITE_URL`.

## To fill in

- WakaTime charts: the dashboard is private, so the section stays hidden until
  you paste share-embed SVG URLs into `codingStats`.
