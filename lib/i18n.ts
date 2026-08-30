export const locales = ['en', 'ko', 'ja'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

/** Shown in the language switcher — always in the language itself. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
}

/** BCP 47 tags for `<html lang>` and Open Graph. */
export const localeTags: Record<Locale, string> = {
  en: 'en',
  ko: 'ko-KR',
  ja: 'ja-JP',
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
