import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { InvestorPage, useInvestorLocale } from '../components/investor-page'
import { DocumentTable } from '../components/document-table'
import { mapDocs } from '../lib/documents'
import { fetchInvestorDocs } from '../lib/api'


export const Route = createFileRoute('/investors/facts')({
  component: FactsPage,
  // SSR'da barcha investor hujjatlari 3 tilda olinadi (category bo'yicha
  // guruhlangan); xatoda → null → bo'sh holat (placeholder + docs havolasi).
  loader: () => fetchInvestorDocs(),
})

function FactsPage() {
  const [locale, changeLocale] = useInvestorLocale()
  const data = Route.useLoaderData()
  const docs = useMemo(
    () => ({
      uz: mapDocs(data?.uz?.facts ?? []),
      ru: mapDocs(data?.ru?.facts ?? []),
      en: mapDocs(data?.en?.facts ?? []),
    }),
    [data],
  )
  return (
    <InvestorPage
      locale={locale}
      changeLocale={changeLocale}
      id="facts"
      eyebrow={m.inv_grp_disc({}, { locale })}
      title={m.inv_facts({}, { locale })}
    >
      {(loc) => <DocumentTable docs={docs[loc]} locale={loc} failed={!data} />}
    </InvestorPage>
  )
}
