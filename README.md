# jeongjaesoon.dev

Personal site. Next.js 16 (App Router, fully static) · React 19 · TypeScript ·
Tailwind CSS v4. No UI framework and no theme.

## Develop

```bash
bun install
bun dev        # http://localhost:3000
bun run build
bun run lint
bun run typecheck
```

## Structure

| What | Where |
| --- | --- |
| Identity — name, headline, links | `content/profile.ts` |
| Site title, description, URL, nav | `lib/site.ts` |
| Design tokens, base and print styles | `app/globals.css` |

Light and dark palettes are the same set of CSS variables with different
values, so every utility keeps working in both. Dark follows the system
preference.

## Deploy

Deployed on Vercel; the origin used for canonical URLs is resolved in
`lib/site.ts` from `VERCEL_PROJECT_PRODUCTION_URL`, so no configuration is
needed. Once a custom domain is attached, either let Vercel report it or pin it
with `NEXT_PUBLIC_SITE_URL`.
