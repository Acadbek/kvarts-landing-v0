import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { InvestorPage, useInvestorLocale } from '../components/investor-page'
import { AffiliatedContent } from '../components/affiliated-content'
import { mapAffiliated } from '../lib/affiliated'
import { fetchPublicSettings } from '../lib/api'


export const Route = createFileRoute('/investors/affiliated')({
  component: AffiliatedPage,
  // SSR'da barcha sozlamalar olinadi (affiliated.json + charter.company_*);
  // xatoda → null → bo'sh holat (placeholder + docs havolasi).
  loader: () => fetchPublicSettings(),
})

function AffiliatedPage() {
  const [locale, changeLocale] = useInvestorLocale()
  const settings = Route.useLoaderData()
  const lists = useMemo(() => mapAffiliated(settings), [settings])
  return (
    <InvestorPage
      locale={locale}
      changeLocale={changeLocale}
      id="affiliated"
      eyebrow={m.inv_grp_disc({}, { locale })}
      title={m.inv_affiliated({}, { locale })}
    >
      {(loc) => (
        <AffiliatedContent
          lists={lists}
          locale={loc}
          failed={!settings}
        />
      )}
    </InvestorPage>
  )
}
