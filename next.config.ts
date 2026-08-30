import type { NextConfig } from 'next'
import { defaultLocale } from './lib/i18n'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    // The site has no unprefixed pages; `/` lands on the default language.
    return [{ source: '/', destination: `/${defaultLocale}`, permanent: false }]
  },
}

export default nextConfig
