'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, localeNames, isLocale, type Locale } from '@/lib/i18n'

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
    <nav aria-label={label} className="flex items-center gap-2 font-mono text-xs">
      {locales.map((locale) => {
        const active = locale === current
        return (
          <Link
            key={locale}
            href={hrefFor(locale)}
            hrefLang={locale}
            aria-current={active ? 'true' : undefined}
            className={active ? 'text-ink' : 'text-faint hover:text-ink'}
          >
            {localeNames[locale]}
          </Link>
        )
      })}
    </nav>
  )
}
