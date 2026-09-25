import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Package as PackageIcon } from 'lucide-react'

import * as m from '../paraglide/messages.js'
import type { Locale } from '../paraglide/runtime.js'
import { backendAssetUrl } from '../lib/api'
import { asSpecs, formatPrice, specLabel, type ShopCategory, type ShopProduct } from '../lib/shop'

/** Kategoriya/mahsulot rasmi — rasm bo'lmasa glass placeholder. */
export function ShopImage({
  src,
  alt,
  className = 'aspect-[16/10]',
}: {
  src?: string | null
  alt: string
  className?: string
}) {
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={`${className} grid place-items-center bg-[linear-gradient(135deg,rgb(10_132_255/0.14),rgb(94_92_230/0.1))]`}
      >
        <PackageIcon size={44} className="text-primary/40" strokeWidth={1.5} />
      </div>
    )
  }
  return <img src={backendAssetUrl(src)} alt={alt} loading="lazy" className={`${className} w-full object-cover`} />
}

/** Salstek uslubidagi katta almashinuvchi karta: rasm + nom + tavsif. */
export function CategoryCard({
  category,
  locale,
  flip,
}: {
  category: ShopCategory
  locale: Locale
  flip: boolean
}) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug: category.slug }}
      className="glass group grid overflow-hidden rounded-[28px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgb(0_0_0/0.14)] md:grid-cols-2"
    >
      <div className={`overflow-hidden ${flip ? 'md:order-2' : ''}`}>
        <ShopImage
          src={category.image}
          alt={category.name}
          className="aspect-[16/10] h-full transition duration-500 group-hover:scale-[1.03] md:aspect-auto md:min-h-[280px]"
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          {m.prod_eyebrow({}, { locale })}
        </p>
        <h2 className="mt-2 text-balance text-2xl font-semibold leading-tight tracking-[-0.02em] text-neutral-900 sm:text-3xl">
          {category.name}
        </h2>
        {category.description && (
          <p className="mt-3 line-clamp-3 max-w-lg text-[15px] leading-relaxed text-neutral-600">
            {category.description}
          </p>
        )}
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
          {m.prod_open({}, { locale })}
          <ArrowUpRight size={15} className="text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function ProductCard({ product, locale }: { product: ShopProduct; locale: Locale }) {
  const specs = asSpecs(product.specs)
  const price = formatPrice(product.price)
  return (
    <article className="glass group flex flex-col overflow-hidden rounded-[24px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgb(0_0_0/0.14)]">
      <div className="overflow-hidden">
        <ShopImage
          src={product.mainImage}
          alt={product.name}
          className="aspect-[4/3] transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold tracking-tight text-neutral-900">{product.name}</h3>
        {product.shortDesc && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-neutral-500">{product.shortDesc}</p>
        )}
        {specs && (
          <dl className="mt-4 flex flex-wrap gap-1.5">
            {Object.entries(specs)
              .slice(0, 4)
              .map(([k, v]) => (
                <div
                  key={k}
                  className="inline-flex items-baseline gap-1 rounded-full bg-black/[0.04] px-2.5 py-1 text-xs tabular-nums text-neutral-600"
                >
                  <dt className="font-medium text-neutral-400">{specLabel(k, locale)}:</dt>
                  <dd className="font-semibold text-neutral-800">{v}</dd>
                </div>
              ))}
          </dl>
        )}
        {price && (
          <p className="mt-4 text-xl font-semibold tabular-nums tracking-tight text-neutral-900">
            {price} <span className="text-sm font-medium text-neutral-400">{m.prod_sum({}, { locale })}</span>
          </p>
        )}
      </div>
    </article>
  )
}
