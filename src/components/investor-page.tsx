import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import type { Locale } from '../paraglide/runtime.js'
import { getClientLocale, switchLocale } from '../lib/locale'
import { LiquidGlassNav } from './navbar'

/** Investor sahifalarida til holati (models.tsx dagi bilan bir xil naqsh). */
export function useInvestorLocale(): [Locale, (code: Locale) => void] {
  let initialLocale: Locale = 'uz'
  try {
    initialLocale = getRouteApi('__root__').useLoaderData().locale
  } catch {
    /* router konteksti yo'q — default */
  }
  const [locale, setLocaleState] = useState<Locale>(() =>
    typeof window === 'undefined' ? initialLocale : getClientLocale(initialLocale),
  )
  const changeLocale = (code: Locale) => {
    switchLocale(code)
    setLocaleState(code)
  }
  return [locale, changeLocale]
}

/**
 * Investor sahifalari uchun umumiy shablon: sarlavha + tavsif +
 * "tayyorlanmoqda" qutisi va docs.kvarts.uz ga havola.
 * Matn tayyor bo'lgach, `children` orqali to'ldiriladi.
 */
export function InvestorPage({
  id,
  eyebrow,
  title,
  desc,
  locale,
  changeLocale,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  desc?: string
  /** Yagona til holati — route'dan keladi (til almashtirish instant bo'lishi uchun). */
  locale: Locale
  changeLocale: (code: Locale) => void
  children?: React.ReactNode | ((locale: Locale) => React.ReactNode)
}) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      <a
        href={`#${id}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {locale === 'ru' ? 'Перейти к содержимому' : locale === 'en' ? 'Skip to content' : 'Kontentga o‘tish'}
      </a>

      <LiquidGlassNav locale={locale} changeLocale={changeLocale} />

      <main id={id} className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <p className="text-sm font-semibold text-neutral-500">{eyebrow}</p>
        <h1 className="mt-3 whitespace-nowrap text-[clamp(1.25rem,5.5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-neutral-900">
          {title}
        </h1>
        {desc && (
          <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-neutral-600">
            {desc}
          </p>
        )}

        {typeof children === 'function' ? (
          children(locale)
        ) : (
          children ?? (
            <div className="mt-10 rounded-2xl border border-black/10 bg-neutral-50 p-6 sm:p-8">
              <p className="max-w-xl text-[15px] leading-relaxed text-neutral-600">
                {m.inv_page_body({}, { locale })}
              </p>
            </div>
          )
        )}
      </main>
    </div>
  )
}
