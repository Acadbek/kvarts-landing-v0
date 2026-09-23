import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { InvestorPage, useInvestorLocale } from '../components/investor-page'
import { DocumentTable } from '../components/document-table'
import { mapDocs } from '../lib/documents'
import { fetchInvestorDocs } from '../lib/api'


export const Route = createFileRoute('/investors/reports')({
  component: ReportsPage,
  loader: () => fetchInvestorDocs(),
})

function ReportsPage() {
  const [locale, changeLocale] = useInvestorLocale()
  const data = Route.useLoaderData()
  const docs = useMemo(
    () => ({
      uz: mapDocs(data?.uz?.reports ?? []),
      ru: mapDocs(data?.ru?.reports ?? []),
      en: mapDocs(data?.en?.reports ?? []),
    }),
    [data],
  )
  return (
    <InvestorPage
      locale={locale}
      changeLocale={changeLocale}
      id="reports"
      eyebrow={m.inv_grp_fin({}, { locale })}
      title={m.inv_reports({}, { locale })}
    >
      {(loc) => <DocumentTable docs={docs[loc]} locale={loc} failed={!data} />}
    </InvestorPage>
  )
}
