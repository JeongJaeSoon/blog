'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, localeNames, isLocale, type Locale } from '@/lib/i18n'

const compactLocaleNames: Record<Locale, string> = {
  en: 'EN',
  ko: 'KO',
  ja: 'JA',
}

/**
 * Swaps the leading locale segment of the current path, so switching language
 * keeps you on the same page instead of dropping you at the home page.
 */
export function LanguageSwitcher({
  current,
  label,
}: {
  current: Locale
  label: string
}) {
  const pathname = usePathname() ?? `/${current}`

  function hrefFor(target: Locale) {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length > 0 && isLocale(segments[0])) {
      segments[0] = target
      return `/${segments.join('/')}`
    }
    return `/${target}`
  }

  return (
    <nav
      aria-label={label}
      className="inline-flex shrink-0 items-center rounded-full border border-line bg-surface p-0.5 font-mono text-[0.6875rem] leading-none"
    >
      {locales.map((locale) => {
        const active = locale === current
        return (
          <Link
            key={locale}
            href={hrefFor(locale)}
            hrefLang={locale}
            aria-label={localeNames[locale]}
            aria-current={active ? 'true' : undefined}
            className={`rounded-full px-2 py-1.5 transition-colors ${
              active
                ? 'bg-ink text-bg'
                : 'text-faint hover:bg-line hover:text-ink'
            }`}
          >
            {compactLocaleNames[locale]}
          </Link>
        )
      })}
    </nav>
  )
}
