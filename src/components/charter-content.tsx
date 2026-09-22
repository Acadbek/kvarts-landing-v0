import { ArrowUpRight } from 'lucide-react'

import * as m from '../paraglide/messages.js'
import type { Locale } from '../paraglide/runtime.js'
import { formatDate, formatNumber, formatQuorum, type Charter } from '../lib/charter'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-black/5 py-3.5 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="text-[15px] text-neutral-500">{label}</dt>
      <dd className="text-[15px] font-medium text-neutral-900 sm:text-right">{value}</dd>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 rounded-2xl border border-black/10 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-8">
      <h2 className="text-xl font-semibold tracking-[-0.01em] text-neutral-900">{title}</h2>
      {children}
    </section>
  )
}

export function CharterContent({ charter, locale, docsHref }: { charter: Charter; locale: Locale; docsHref: string }) {
  return (
    <div>
      <Section title={m.inv_charter({}, { locale })}>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-neutral-600">
          {charter.company[locale]}
        </p>
        <p className="mt-6 text-sm font-medium text-neutral-500">{m.chr_fund_label({}, { locale })}</p>
        <p className="mt-1 text-3xl font-semibold tracking-[-0.02em] text-neutral-900 sm:text-4xl">
          {formatNumber(charter.fundAmount)}{' '}
          <span className="text-lg font-medium text-neutral-500">{m.chr_sum({}, { locale })}</span>
        </p>
        <dl className="mt-6">
          <Row label={m.chr_shares_total({}, { locale })} value={formatNumber(charter.sharesTotal)} />
          <Row label={m.chr_shares_ordinary({}, { locale })} value={formatNumber(charter.sharesOrdinary)} />
          <Row label={m.chr_shares_preferred({}, { locale })} value={formatNumber(charter.sharesPreferred)} />
          <Row label={m.chr_nominal({}, { locale })} value={`${formatNumber(charter.sharesNominal)} ${m.chr_sum({}, { locale})}`} />
        </dl>
      </Section>

      <Section title={m.chr_meeting({}, { locale })}>
        <dl className="mt-2">
          <Row label={m.chr_meeting_form({}, { locale })} value={charter.meetingForm[locale]} />
          <Row label={m.chr_meeting_date({}, { locale })} value={formatDate(charter.meetingDate, locale)} />
          <Row label={m.chr_protocol_date({}, { locale })} value={formatDate(charter.protocolDate, locale)} />
          <Row label={m.chr_meeting_place({}, { locale })} value={charter.meetingPlace[locale]} />
          <Row label={m.chr_quorum({}, { locale })} value={formatQuorum(charter.quorum, locale)} />
          <Row label={m.chr_div_start({}, { locale })} value={formatDate(charter.dividendStart, locale)} />
          <Row label={m.chr_div_end({}, { locale })} value={formatDate(charter.dividendEnd, locale)} />
        </dl>
      </Section>

      <a
        href={docsHref}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700"
      >
        {m.inv_page_docs({}, { locale })}
        <ArrowUpRight size={15} />
      </a>
    </div>
  )
}
