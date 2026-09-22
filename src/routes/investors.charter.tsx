import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { InvestorPage, useInvestorLocale } from '../components/investor-page'
import { CharterContent } from '../components/charter-content'
import { mapCharter } from '../lib/charter'
import { fetchPublicSettings } from '../lib/api'

const DOCS_HREF = 'https://docs.kvarts.uz/index.php?subcat=6'

export const Route = createFileRoute('/investors/charter')({
  component: CharterPage,
  // SSR'da backend'dan `charter.*` sozlamalari olinadi; xatoda → null,
  // sahifa statik defaultlarni ko'rsatadi (mapCharter ichida).
  // `_` — GET serverFn URL'ini har safar noyob qiladi (browser HTTP cache
  // eski qiymatni qaytarmasligi uchun).
  loader: () => fetchPublicSettings(),
})

function CharterPage() {
  const [locale] = useInvestorLocale()
  const settings = Route.useLoaderData()
  const charter = useMemo(() => mapCharter(settings), [settings])
  return (
    <InvestorPage
      id="charter"
      eyebrow={m.inv_grp_corp({}, { locale })}
      title={m.inv_charter({}, { locale })}
      desc={m.inv_charter_d({}, { locale })}
      docsHref={DOCS_HREF}
    >
      {(loc) => <CharterContent charter={charter} locale={loc} docsHref={DOCS_HREF} />}
    </InvestorPage>
  )
}
