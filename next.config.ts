import type { NextConfig } from 'next'
import { defaultLocale, locales } from './lib/i18n'

const legacyLocalizedSlugs = [
  'efficient-codex-model-delegation',
  'obsidian-nas-remote-mcp',
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // The site has no unprefixed pages; `/` lands on the default language.
      { source: '/', destination: `/${defaultLocale}`, permanent: false },
      // Preserve the localized filenames used before posts were grouped.
      ...legacyLocalizedSlugs.flatMap((slug) =>
        locales.flatMap((targetLang) =>
          locales.map((sourceLang) => ({
            source: `/${targetLang}/blog/${slug}-${sourceLang}`,
            destination: `/${targetLang}/blog/${slug}`,
            permanent: true,
          })),
        ),
      ),
    ]
  },
}

export default nextConfig
