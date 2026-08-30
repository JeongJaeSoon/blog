import type { Locale } from '@/lib/i18n'
import type { Dictionary } from './types'
import { en } from './en'
import { ko } from './ko'
import { ja } from './ja'

const dictionaries: Record<Locale, Dictionary> = { en, ko, ja }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export type { Dictionary } from './types'
