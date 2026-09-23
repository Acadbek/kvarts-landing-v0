import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { InvestorPage, useInvestorLocale } from '../components/investor-page'
import { DocumentTable } from '../components/document-table'
import { mapDocs } from '../lib/documents'
import { fetchInvestorDocs } from '../lib/api'

const DOCS_HREF = 'https://docs.kvarts.uz/index.php?subcat=2'

export const Route = createFileRoute('/investors/reports')({
  component: ReportsPage,
  loader: () => fetchInvestorDocs(),
})

function ReportsPage() {
  const [locale] = useInvestorLocale()
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
      id="reports"
      eyebrow={m.inv_grp_fin({}, { locale })}
      title={m.inv_reports({}, { locale })}
      desc={m.inv_reports_d({}, { locale })}
      docsHref={DOCS_HREF}
    >
      {(loc) => <DocumentTable docs={docs[loc]} locale={loc} docsHref={DOCS_HREF} failed={!data} />}
    </InvestorPage>
  )
}
