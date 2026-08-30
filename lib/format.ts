import type { Locale } from './i18n'
import { localeTags } from './i18n'

const MONTHS: Record<Locale, (year: string, month: number) => string> = {
  en: (year, month) =>
    `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month]} ${year}`,
  ko: (year, month) => `${year}.${String(month + 1).padStart(2, '0')}`,
  ja: (year, month) => `${year}年${month + 1}月`,
}

/** `2023-11` → `Nov 2023` / `2023.11` / `2023年11月`. */
export function month(value: string, locale: Locale): string {
  const [year, m] = value.split('-')
  const index = Number(m) - 1
  return Number.isInteger(index) && index >= 0 && index < 12
    ? MONTHS[locale](year, index)
    : year
}

/** `Nov 2023 — Present`, with `present` supplied by the dictionary. */
export function period(
  start: string,
  end: string | undefined,
  locale: Locale,
  present: string,
): string {
  return `${month(start, locale)} — ${end ? month(end, locale) : present}`
}

export function formatDate(date: string, locale: Locale): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString(localeTags[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Formats a publication date at whatever precision it carries: `2023-02-13`
 * renders as a full date, `2025-12` as just the month and year.
 */
export function publicationDate(value: string, locale: Locale): string {
  const parts = value.split('-')
  return parts.length >= 3 ? formatDate(value, locale) : month(value, locale)
}
