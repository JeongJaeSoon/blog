import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import { site } from '@/lib/site'
import { profile } from '@/content/profile'
import './globals.css'

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans-stack',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-stack',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  authors: [{ name: profile.name, url: site.url }],
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
    locale: 'en_US',
  },
  twitter: { card: 'summary', creator: '@dev_soon0_0' },
  alternates: { types: { 'application/rss+xml': `${site.url}/rss.xml` } },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.locale} className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-6">
          <SiteHeader />
          <main className="flex-1 py-10">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}

function SiteHeader() {
  return (
    <header className="no-print flex items-center justify-between gap-6 border-b border-line py-5">
      <Link
        href="/"
        className="font-mono text-sm tracking-tight hover:text-accent"
      >
        {profile.name.toLowerCase().replace(' ', '-')}
      </Link>
      <nav className="flex items-center gap-5 text-sm text-muted">
        {site.nav.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-ink">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="no-print flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 text-xs text-faint">
      <span>© {new Date().getFullYear()} {profile.name}</span>
      <div className="flex gap-4">
        {profile.links
          .filter((link) => link.label !== 'Email')
          .map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="me noreferrer"
              className="hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        <a href="/rss.xml" className="hover:text-ink">
          RSS
        </a>
      </div>
    </footer>
  )
}
