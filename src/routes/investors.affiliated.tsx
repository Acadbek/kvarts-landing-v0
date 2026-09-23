import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import * as m from '../paraglide/messages.js'
import { InvestorPage, useInvestorLocale } from '../components/investor-page'
import { AffiliatedContent } from '../components/affiliated-content'
import { mapAffiliated } from '../lib/affiliated'
import { fetchPublicSettings } from '../lib/api'

const DOCS_HREF = 'https://docs.kvarts.uz/index.php?subcat=1'

export const Route = createFileRoute('/investors/affiliated')({
  component: AffiliatedPage,
  // SSR'da barcha sozlamalar olinadi (affiliated.json + charter.company_*);
  // xatoda → null → bo'sh holat (placeholder + docs havolasi).
  loader: () => fetchPublicSettings(),
})

function AffiliatedPage() {
  const [locale] = useInvestorLocale()
  const settings = Route.useLoaderData()
  const lists = useMemo(() => mapAffiliated(settings), [settings])
  return (
    <InvestorPage
      id="affiliated"
      eyebrow={m.inv_grp_disc({}, { locale })}
      title={m.inv_affiliated({}, { locale })}
      docsHref={DOCS_HREF}
    >
      {(loc) => (
        <AffiliatedContent
          lists={lists}
          locale={loc}
          docsHref={DOCS_HREF}
          failed={!settings}
        />
      )}
    </InvestorPage>
  )
}
