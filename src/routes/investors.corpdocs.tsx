import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { InvestorPage, useInvestorLocale } from '../components/investor-page'
import { DocumentTable } from '../components/document-table'
import { mapDocs } from '../lib/documents'
import { fetchInvestorDocs } from '../lib/api'


export const Route = createFileRoute('/investors/corpdocs')({
  component: CorpDocsPage,
  loader: () => fetchInvestorDocs(),
})

function CorpDocsPage() {
  const [locale, changeLocale] = useInvestorLocale()
  const data = Route.useLoaderData()
  const docs = useMemo(
    () => ({
      uz: mapDocs(data?.uz?.corpdocs ?? []),
      ru: mapDocs(data?.ru?.corpdocs ?? []),
      en: mapDocs(data?.en?.corpdocs ?? []),
    }),
    [data],
  )
  return (
    <InvestorPage
      locale={locale}
      changeLocale={changeLocale}
      id="corpdocs"
      eyebrow={m.inv_grp_corp({}, { locale })}
      title={m.inv_corpdocs({}, { locale })}
    >
      {(loc) => <DocumentTable docs={docs[loc]} locale={loc} failed={!data} />}
    </InvestorPage>
  )
}
