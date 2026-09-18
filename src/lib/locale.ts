import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { setLocale, type Locale } from '../paraglide/runtime.js'

export const LANGS: { code: Locale; label: string; short: string }[] = [
  { code: 'uz', label: 'O‘zbekcha', short: 'UZ' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'en', label: 'English', short: 'EN' },
]

export type LangCode = Locale

function parseLocale(value: string | undefined | null): Locale {
  return value === 'ru' || value === 'en' || value === 'uz' ? value : 'uz'
}

/**
 * SSR + client uchun boshlang'ich til. Har doim server'da ishlaydi va
 * request cookie'sidan o'qiydi (har request izolyatsiyalangan — global
 * o'zgaruvchi yo'q). Natija serializatsiya qilinib client'ga uzatiladi,
 * shuning uchun birinchi render har ikki tomonda bir xil → gidratsiya mos.
 */
export const getInitialLocale = createServerFn({ method: 'GET' }).handler(async () => {
  return parseLocale(getCookie('PARAGLIDE_LOCALE'))
})

/**
 * Sahifani reload qilmasdan tilni almashtirish (cookie + localStorage yoziladi).
 * Runtime sinxronlash best-effort: u xato bersa ham UI holati yangilanadi
 * (komponent state alohida boshqariladi).
 */
export function switchLocale(locale: Locale) {
  try {
    setLocale(locale, { reload: false })
  } catch {
    /* e'tiborsiz — UI baribir yangilanadi */
  }
  if (typeof document !== 'undefined') document.documentElement.lang = locale
}
