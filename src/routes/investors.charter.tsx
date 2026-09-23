import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { InvestorPage, useInvestorLocale } from '../components/investor-page'
import { CharterContent } from '../components/charter-content'
import { mapCharter } from '../lib/charter'
import { fetchPublicSettings } from '../lib/api'


export const Route = createFileRoute('/investors/charter')({
  component: CharterPage,
  // SSR'da backend'dan `charter.*` sozlamalari olinadi; xatoda → null,
  // sahifa statik defaultlarni ko'rsatadi (mapCharter ichida).
  // `_` — GET serverFn URL'ini har safar noyob qiladi (browser HTTP cache
  // eski qiymatni qaytarmasligi uchun).
  loader: () => fetchPublicSettings(),
})

function CharterPage() {
  const [locale, changeLocale] = useInvestorLocale()
  const settings = Route.useLoaderData()
  const charter = useMemo(() => mapCharter(settings), [settings])
  return (
    <InvestorPage
      locale={locale}
      changeLocale={changeLocale}
      id="charter"
      eyebrow={m.inv_grp_corp({}, { locale })}
      title={m.inv_charter({}, { locale })}
    >
      {(loc) => <CharterContent charter={charter} locale={loc} />}
    </InvestorPage>
  )
}
