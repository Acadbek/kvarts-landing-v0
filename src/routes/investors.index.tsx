import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

import * as m from '../paraglide/messages.js'
import { INVESTOR_LINKS, LiquidGlassNav, NavAnchor } from '../components/navbar'
import { useInvestorLocale } from '../components/investor-page'

export const Route = createFileRoute('/investors/')({
  component: InvestorsPage,
})

function InvestorsPage() {
  const [locale, changeLocale] = useInvestorLocale()

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-ios min-h-screen font-sans text-neutral-900">
      <a
        href="#investors"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-sm font-semibold text-white"
      >
        {locale === 'ru' ? 'Перейти к содержимому' : locale === 'en' ? 'Skip to content' : 'Kontentga o‘tish'}
      </a>

      <LiquidGlassNav locale={locale} changeLocale={changeLocale} tone="light" />

      <main id="investors" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl">
          {m.nav_investors({}, { locale })}
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-neutral-600">
          {m.inv_overview_d({}, { locale })}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {INVESTOR_LINKS.map((l) => {
            const Icon = l.icon
            return (
              <NavAnchor
                key={l.href}
                href={l.href}
                className="glass group flex items-start gap-4 rounded-[24px] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgb(0_0_0/0.14)] sm:p-6"
              >
                <Icon size={36} stopColor1="#62A7FA" stopColor2="#00408A" className="h-9 w-9 shrink-0 drop-shadow-sm" />
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold tracking-tight text-neutral-900">
                    {l.title({}, { locale })}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-neutral-500">
                    {l.desc({}, { locale })}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </span>
              </NavAnchor>
            )
          })}
        </div>
      </main>
    </div>
  )
}
