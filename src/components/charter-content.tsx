import { ArrowUpRight } from 'lucide-react'

import * as m from '../paraglide/messages.js'
import type { Locale } from '../paraglide/runtime.js'
import { formatDate, formatNumber, formatQuorum, type Charter } from '../lib/charter'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-0 py-1 sm:px-6 sm:first:pl-0 sm:last:pr-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">{label}</dt>
      <dd className="mt-1.5 text-xl font-medium tabular-nums tracking-[-0.01em] text-neutral-900">
        {value}
      </dd>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-black/[0.06] py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
      <dt className="text-[15px] text-neutral-500">{label}</dt>
      <dd className="text-[15px] font-medium text-neutral-900 sm:text-right">{value}</dd>
    </div>
  )
}

/** «Nizom jamg'armasi» — editorial ko'rinish: katta summa raqami,
 * aksiyalar statistikasi polosasi va yig'ilish jadvali. */
export function CharterContent({
  charter,
  locale,
  docsHref,
}: {
  charter: Charter
  locale: Locale
  docsHref: string
}) {
  const sum = m.chr_sum({}, { locale })
  return (
    <div className="mt-10">
      {/* kompaniya */}
      <p className="max-w-xl text-[15px] leading-relaxed text-neutral-600">
        {charter.company[locale]}
      </p>

      {/* bosh raqam */}
      <div className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          {m.chr_fund_label({}, { locale })}
        </p>
        <p className="mt-2.5 text-[2.5rem] font-medium leading-none tracking-[-0.02em] tabular-nums text-neutral-900 md:text-5xl xl:text-[3.25rem]">
          {formatNumber(charter.fundAmount)}{' '}
          <span className="text-lg font-medium tracking-normal text-neutral-400 md:text-xl">
            {sum}
          </span>
        </p>
      </div>

      {/* aksiyalar polosasi */}
      <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-7 border-y border-black/[0.06] py-6 sm:grid-cols-4 sm:divide-x sm:divide-black/[0.06]">
        <Stat label={m.chr_shares_total({}, { locale })} value={formatNumber(charter.sharesTotal)} />
        <Stat label={m.chr_shares_ordinary({}, { locale })} value={formatNumber(charter.sharesOrdinary)} />
        <Stat label={m.chr_shares_preferred({}, { locale })} value={formatNumber(charter.sharesPreferred)} />
        <Stat label={m.chr_nominal({}, { locale })} value={`${formatNumber(charter.sharesNominal)} ${sum}`} />
      </dl>

      {/* yig'ilish */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-[-0.01em] text-neutral-900">
          {m.chr_meeting({}, { locale })}
        </h2>
        <dl className="mt-4 border-t border-black/[0.06]">
          <Row label={m.chr_meeting_form({}, { locale })} value={charter.meetingForm[locale]} />
          <Row label={m.chr_meeting_date({}, { locale })} value={formatDate(charter.meetingDate, locale)} />
          <Row label={m.chr_protocol_date({}, { locale })} value={formatDate(charter.protocolDate, locale)} />
          <Row label={m.chr_meeting_place({}, { locale })} value={charter.meetingPlace[locale]} />
          <Row label={m.chr_quorum({}, { locale })} value={formatQuorum(charter.quorum, locale)} />
          <Row label={m.chr_div_start({}, { locale })} value={formatDate(charter.dividendStart, locale)} />
          <Row label={m.chr_div_end({}, { locale })} value={formatDate(charter.dividendEnd, locale)} />
        </dl>
      </section>

      <a
        href={docsHref}
        target="_blank"
        rel="noreferrer"
        className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline"
      >
        {m.inv_page_docs({}, { locale })}
        <ArrowUpRight size={15} />
      </a>
    </div>
  )
}
