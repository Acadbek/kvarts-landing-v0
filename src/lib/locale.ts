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
 * Sahifani reload qilmasdan tilni almashtirish. Paraglide runtime'dan
 * tashqari, cookie + localStorage ga to'g'ridan-to'g'ri ham yoziladi —
 * runtime xato bersa ham (try/catch yutib yuboradi) til saqlanib qoladi.
 */
export function switchLocale(locale: Locale) {
  try {
    setLocale(locale, { reload: false })
  } catch {
    /* e'tiborsiz — pastda qo'lda saqlanadi */
  }
  try {
    localStorage.setItem('PARAGLIDE_LOCALE', locale)
  } catch {
    /* private mode va h.k. — e'tiborsiz */
  }
  try {
    document.cookie = `PARAGLIDE_LOCALE=${locale}; path=/; max-age=34560000`
  } catch {
    /* e'tiborsiz */
  }
  if (typeof document !== 'undefined') document.documentElement.lang = locale
}

/**
 * Client'da joriy til: avval brauzer xotirasi (localStorage → cookie),
 * topilmasa SSR loader bergan qiymat. SPA navigatsiyada yangi sahifa
 * root loader'dagi eskirgan qiymatdan emas, foydalanuvchi tanlagan
 * tildan boshlashi uchun kerak.
 */
export function getClientLocale(fallback: Locale): Locale {
  try {
    const stored = localStorage.getItem('PARAGLIDE_LOCALE')
    if (stored === 'ru' || stored === 'en' || stored === 'uz') return stored
    const match = document.cookie.match(/(?:^|;\s*)PARAGLIDE_LOCALE=(ru|en|uz)(?:;|$)/)
    if (match) return match[1] as Locale
  } catch {
    /* SSR yoki bloklangan storage — fallback */
  }
  return fallback
}
