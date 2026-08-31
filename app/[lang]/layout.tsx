import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { site } from '@/lib/site'
import { locales, localeTags, isLocale, type Locale } from '@/lib/i18n'
import { getDictionary } from '@/content/i18n'
import { identity } from '@/content/profile'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import '../globals.css'

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

type Props = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDictionary(lang)

  return {
    metadataBase: new URL(site.url),
    title: { default: t.site.title, template: `%s · ${identity.name}` },
    description: t.site.description,
    authors: [{ name: identity.name, url: site.url }],
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(locales.map((l) => [localeTags[l], `/${l}`])),
      types: { 'application/rss+xml': `/${lang}/rss.xml` },
    },
    openGraph: {
      type: 'website',
      siteName: identity.name,
      title: t.site.title,
      description: t.site.description,
      url: `${site.url}/${lang}`,
      locale: localeTags[lang].replace('-', '_'),
    },
    twitter: { card: 'summary', creator: '@dev_soon0_0' },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)

  return (
    <html lang={localeTags[lang]} className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-5 sm:px-8">
          <SiteHeader lang={lang} t={t} />
          <main className="flex-1 py-8 sm:py-12">{children}</main>
          <SiteFooter lang={lang} />
        </div>
      </body>
    </html>
  )
}

function SiteHeader({
  lang,
  t,
}: {
  lang: Locale
  t: ReturnType<typeof getDictionary>
}) {
  const nav = [
    { label: t.nav.about, href: `/${lang}` },
    { label: t.nav.blog, href: `/${lang}/blog` },
  ]

  return (
    <header className="no-print border-b border-line py-4 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:py-5">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/${lang}`}
          className="whitespace-nowrap font-mono text-sm tracking-tight hover:text-accent"
        >
          {identity.name.toLowerCase().replace(' ', '-')}
        </Link>
        <div className="sm:hidden">
          <LanguageSwitcher current={lang} label={t.ui.language} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-5 sm:mt-0 sm:justify-end">
        <nav className="flex items-center gap-6 text-sm text-muted">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden sm:block">
          <LanguageSwitcher current={lang} label={t.ui.language} />
        </div>
      </div>
    </header>
  )
}

function SiteFooter({ lang }: { lang: Locale }) {
  return (
    <footer className="no-print flex flex-col items-start justify-between gap-4 border-t border-line py-7 text-xs text-faint sm:flex-row sm:items-center">
      <span>
        © {new Date().getFullYear()} {identity.name}
      </span>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {identity.links
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
        <a href={`/${lang}/rss.xml`} className="hover:text-ink">
          RSS
        </a>
      </div>
    </footer>
  )
}
