export const site = {
  name: 'JaeSoon Jeong',
  title: 'JaeSoon Jeong — AI Platform Engineer',
  description:
    'AI Platform Engineer in Tokyo. Notes on LLM platforms, agent tooling, and the operational side of shipping AI.',
  /** Used for canonical URLs, RSS, and sitemap. Set NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jeongjaesoon.dev',
  locale: 'en',
  nav: [
    { label: 'About', href: '/' },
    { label: 'Blog', href: '/blog' },
  ],
} as const
