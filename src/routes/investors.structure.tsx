import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { InvestorPage, useInvestorLocale } from '../components/investor-page'
import { DocumentTable } from '../components/document-table'
import { mapDocs } from '../lib/documents'
import { fetchInvestorDocs } from '../lib/api'

const DOCS_HREF = 'https://docs.kvarts.uz/files/%D0%A1%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B0%2030.06.2025%D0%B3.pdf'

export const Route = createFileRoute('/investors/structure')({
  component: StructurePage,
  loader: () => fetchInvestorDocs(),
})

function StructurePage() {
  const [locale] = useInvestorLocale()
  const data = Route.useLoaderData()
  const docs = useMemo(
    () => ({
      uz: mapDocs(data?.uz?.structure ?? []),
      ru: mapDocs(data?.ru?.structure ?? []),
      en: mapDocs(data?.en?.structure ?? []),
    }),
    [data],
  )
  return (
    <InvestorPage
      id="structure"
      eyebrow={m.inv_grp_corp({}, { locale })}
      title={m.inv_structure({}, { locale })}
      desc={m.inv_structure_d({}, { locale })}
      docsHref={DOCS_HREF}
    >
      {(loc) => <DocumentTable docs={docs[loc]} locale={loc} docsHref={DOCS_HREF} failed={!data} />}
    </InvestorPage>
  )
}
