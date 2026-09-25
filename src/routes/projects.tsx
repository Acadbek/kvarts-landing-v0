import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { useInvestorLocale } from '../components/investor-page'
import { LiquidGlassNav } from '../components/navbar'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
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
        href="#projects"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-sm font-semibold text-white"
      >
        {locale === 'ru' ? 'Перейти к содержимому' : locale === 'en' ? 'Skip to content' : 'Kontentga o‘tish'}
      </a>

      <LiquidGlassNav locale={locale} changeLocale={changeLocale} tone="light" />

      <main id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl">
          {m.nav_projects({}, { locale })}
        </h1>

        <div className="glass mt-10 rounded-[28px] p-6 sm:p-8">
          <p className="max-w-xl text-[15px] leading-relaxed text-neutral-600">
            {m.inv_page_body({}, { locale })}
          </p>
        </div>
      </main>
    </div>
  )
}
