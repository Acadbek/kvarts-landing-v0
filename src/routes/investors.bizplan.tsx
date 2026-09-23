import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { InvestorPage, useInvestorLocale } from '../components/investor-page'
import { DocumentTable } from '../components/document-table'
import { mapDocs } from '../lib/documents'
import { fetchInvestorDocs } from '../lib/api'

const DOCS_HREF = 'https://docs.kvarts.uz/'

export const Route = createFileRoute('/investors/bizplan')({
  component: BizPlanPage,
  loader: () => fetchInvestorDocs(),
})

function BizPlanPage() {
  const [locale] = useInvestorLocale()
  const data = Route.useLoaderData()
  const docs = useMemo(
    () => ({
      uz: mapDocs(data?.uz?.bizplan ?? []),
      ru: mapDocs(data?.ru?.bizplan ?? []),
      en: mapDocs(data?.en?.bizplan ?? []),
    }),
    [data],
  )
  return (
    <InvestorPage
      id="bizplan"
      eyebrow={m.inv_grp_fin({}, { locale })}
      title={m.inv_bizplan({}, { locale })}
      desc={m.inv_bizplan_d({}, { locale })}
      docsHref={DOCS_HREF}
    >
      {(loc) => <DocumentTable docs={docs[loc]} locale={loc} docsHref={DOCS_HREF} failed={!data} />}
    </InvestorPage>
  )
}
