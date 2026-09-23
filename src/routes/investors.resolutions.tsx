import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { InvestorPage, useInvestorLocale } from '../components/investor-page'
import { DocumentTable } from '../components/document-table'
import { mapDocs } from '../lib/documents'
import { fetchInvestorDocs } from '../lib/api'


export const Route = createFileRoute('/investors/resolutions')({
  component: ResolutionsPage,
  loader: () => fetchInvestorDocs(),
})

function ResolutionsPage() {
  const [locale, changeLocale] = useInvestorLocale()
  const data = Route.useLoaderData()
  const docs = useMemo(
    () => ({
      uz: mapDocs(data?.uz?.resolutions ?? []),
      ru: mapDocs(data?.ru?.resolutions ?? []),
      en: mapDocs(data?.en?.resolutions ?? []),
    }),
    [data],
  )
  return (
    <InvestorPage
      locale={locale}
      changeLocale={changeLocale}
      id="resolutions"
      eyebrow={m.inv_grp_disc({}, { locale })}
      title={m.inv_resolutions({}, { locale })}
    >
      {(loc) => <DocumentTable docs={docs[loc]} locale={loc} failed={!data} />}
    </InvestorPage>
  )
}
