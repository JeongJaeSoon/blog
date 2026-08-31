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
| Blog posts | `content/posts/*.md` |
| Site title, description, URL, nav | `lib/site.ts` |
| Design tokens, base and print styles | `app/globals.css` |

Everything else is layout. `content/profile.ts` is typed, so an entry missing a
required field fails `bun run build` rather than rendering a blank.

Light and dark palettes are the same set of CSS variables with different
values, so every utility keeps working in both. Dark follows the system
preference.

### Using it as a résumé

The home page prints. `Cmd+P` drops the nav, footer, and "all repositories"
link, and reveals the contact handles so the PDF still carries them.

### Adding a post

Create `content/posts/my-post.md`:

```yaml
---
title: My post
date: '2026-09-01'
summary: One or two sentences, used on the index and in the RSS feed.
tags: [platform, mcp]
draft: false
---
```

`draft: true` keeps a post visible in `bun dev` and out of the build, the RSS
feed and the sitemap. Reading time is computed; do not set it.

Tag pages (`/blog/tag/<tag>`), `/rss.xml`, `/sitemap.xml` and `/robots.txt` are
generated from the posts — nothing to register by hand.

## Deploy

Deployed on Vercel; the origin used for canonical URLs, RSS and the sitemap is
resolved in `lib/site.ts` from `VERCEL_PROJECT_PRODUCTION_URL`, so no
configuration is needed. Once a custom domain is attached, either let Vercel report it or pin it
with `NEXT_PUBLIC_SITE_URL`.

## To fill in

- WakaTime charts: the dashboard is private, so the section stays hidden until
  you paste share-embed SVG URLs into `codingStats`.
