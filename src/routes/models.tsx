import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import type { Locale } from '../paraglide/runtime.js'
import { getClientLocale, switchLocale } from '../lib/locale'
import { CATALOGS } from '../lib/catalog'
import { LiquidGlassNav } from '../components/navbar'
import { ModelCard } from '../components/model-card'

export const Route = createFileRoute('/models')({ component: ModelsPage })

function ModelsPage() {
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

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      <a
        href="#models"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {locale === 'ru' ? 'Перейти к содержимому' : locale === 'en' ? 'Skip to content' : 'Kontentga o‘tish'}
      </a>

      <LiquidGlassNav locale={locale} changeLocale={changeLocale} />

      <main id="models" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <p className="text-sm font-semibold text-neutral-500">
          {locale === 'ru' ? 'Продукция' : locale === 'en' ? 'Products' : 'Mahsulotlar'}
        </p>
        <h1 className="mt-3 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl">
          {locale === 'ru' ? '3D-модели' : locale === 'en' ? '3D models' : '3D modellar'}
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-neutral-600">
          {locale === 'ru'
            ? 'Рассматривайте банку и стекло со всех сторон.'
            : locale === 'en'
              ? 'Inspect the jar and the glass from every angle.'
              : 'Banka va oynani har tomondan ko‘ring.'}
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <ModelCard
            locale={locale}
            src="/models/banka.glb"
            title={locale === 'ru' ? 'Стеклобанка — 3D' : locale === 'en' ? 'Glass jar — 3D' : 'Shisha banka — 3D'}
            hint={locale === 'ru' ? 'Вращайте модель' : locale === 'en' ? 'Drag to rotate' : 'Aylantirib ko‘ring'}
            catalogHref={CATALOGS[0].file}
          />
          <ModelCard
            locale={locale}
            src="/models/oyna.glb"
            title={locale === 'ru' ? 'Листовое стекло — 3D' : locale === 'en' ? 'Sheet glass — 3D' : 'Listovoy oyna — 3D'}
            hint={locale === 'ru' ? 'Вращайте модель' : locale === 'en' ? 'Drag to rotate' : 'Aylantirib ko‘ring'}
            catalogHref={CATALOGS[2].file}
            shadow={false}
          />
        </div>
      </main>
    </div>
  )
}
