import { useEffect } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import * as m from '../paraglide/messages.js'
import { useInvestorLocale } from '../components/investor-page'
import { LiquidGlassNav } from '../components/navbar'
import { ProductCard, ShopImage } from '../components/shop'
import { fetchCategoryPage } from '../lib/api'

export const Route = createFileRoute('/products/$slug')({
  component: CategoryPage,
  loader: ({ params }) => fetchCategoryPage({ data: { slug: params.slug } }),
})

function CategoryPage() {
  const [locale, changeLocale] = useInvestorLocale()
  const data = Route.useLoaderData()
  const page = data?.[locale] ?? null

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-ios min-h-screen font-sans text-neutral-900">
      <LiquidGlassNav locale={locale} changeLocale={changeLocale} />

      <main className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={15} />
          {m.prod_back({}, { locale })}
        </Link>

        {!page ? (
          <div className="glass mt-8 rounded-[28px] p-6 sm:p-8">
            <p className="max-w-xl text-[15px] leading-relaxed text-neutral-600">
              {m.prod_empty({}, { locale })}
            </p>
          </div>
        ) : (
          <>
            <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl">
              {page.category.name}
            </h1>
            {page.category.description && (
              <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-neutral-600">
                {page.category.description}
              </p>
            )}
            {page.category.image && (
              <div className="glass mt-8 overflow-hidden rounded-[28px]">
                <ShopImage src={page.category.image} alt={page.category.name} className="aspect-[21/9]" />
              </div>
            )}
            {page.products.length === 0 ? (
                <div className="glass mt-8 rounded-[28px] p-6 sm:p-8">
                  <p className="max-w-xl text-[15px] leading-relaxed text-neutral-600">
                    {m.prod_no_products({}, { locale })}
                  </p>
                </div>
              ) : (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {page.products.map((p) => (
                    <ProductCard key={p.id} product={p} locale={locale} />
                  ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
