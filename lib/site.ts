/**
 * Resolve the origin used for canonical URLs and Open Graph.
 *
 * Order:
 *   1. NEXT_PUBLIC_SITE_URL — set this once a custom domain is in place.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — the project's production domain, which
 *      Vercel injects at build time (the custom domain if one is attached,
 *      otherwise the `.vercel.app` one). Note that this is the *production*
 *      domain even in a preview build, which is what canonical URLs want.
 *   3. localhost, for `next dev` and local builds.
 */
function resolveUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`

  return 'http://localhost:3000'
}

export const site = {
  name: 'JaeSoon Jeong',
  title: 'JaeSoon Jeong — AI Platform Engineer',
  description:
    'AI Platform Engineer in Tokyo. Notes on LLM platforms, agent tooling, and the operational side of shipping AI.',
  url: resolveUrl(),
  locale: 'en',
  nav: [{ label: 'About', href: '/' }],
} as const
