import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { useInvestorLocale } from '../components/investor-page'
import { LiquidGlassNav } from '../components/navbar'
import { CategoryCard } from '../components/shop'
import { fetchCategories } from '../lib/api'

export const Route = createFileRoute('/products/')({
  component: ProductsPage,
  // SSR'da barcha kategoriyalar 3 tilda olinadi.
  loader: () => fetchCategories(),
})

function ProductsPage() {
  const [locale, changeLocale] = useInvestorLocale()
  const data = Route.useLoaderData()
  const cats = data?.[locale] ?? []

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-ios min-h-screen font-sans text-neutral-900">
      <a
        href="#products"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {locale === 'ru' ? 'Перейти к содержимому' : locale === 'en' ? 'Skip to content' : 'Kontentga o‘tish'}
      </a>

      <LiquidGlassNav locale={locale} changeLocale={changeLocale} />

      <main id="products" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <p className="text-sm font-semibold text-neutral-500">{m.prod_eyebrow({}, { locale })}</p>
        <h1 className="mt-3 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl">
          {m.prod_title({}, { locale })}
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-neutral-600">
          {m.prod_desc({}, { locale })}
        </p>

        {cats.length === 0 ? (
          <div className="glass mt-10 rounded-[28px] p-6 sm:p-8">
            <p className="max-w-xl text-[15px] leading-relaxed text-neutral-600">
              {m.prod_empty({}, { locale })}
            </p>
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-4 sm:gap-5">
            {cats.map((c, i) => (
              <CategoryCard key={c.id} category={c} locale={locale} flip={i % 2 === 1} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
