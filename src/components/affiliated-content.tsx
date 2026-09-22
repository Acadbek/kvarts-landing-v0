import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

import * as m from '../paraglide/messages.js'
import type { Locale } from '../paraglide/runtime.js'
import { formatDate } from '../lib/charter'
import type { AffiliatedList } from '../lib/affiliated'

const COLS = [
  { key: 'name' as const, label: (l: Locale) => m.aff_col_name({}, { locale: l }), wide: true },
  { key: 'basis' as const, label: (l: Locale) => m.aff_col_basis({}, { locale: l }), wide: true },
  { key: 'ordinary' as const, label: (l: Locale) => m.aff_col_ordinary({}, { locale: l }), wide: false },
  { key: 'preferred' as const, label: (l: Locale) => m.aff_col_preferred({}, { locale: l }), wide: false },
  { key: 'percent' as const, label: (l: Locale) => m.aff_col_percent({}, { locale: l }), wide: false },
]

/** «Affillangan shaxslar ro'yxati» — sana tab'lari + jadval.
 * Desktop: 5 ustunli jadval. Mobil: har shaxs uchun mini-karta. */
export function AffiliatedContent({
  lists,
  company,
  locale,
  docsHref,
}: {
  lists: AffiliatedList[]
  company: string
  locale: Locale
  docsHref: string
}) {
  const [active, setActive] = useState(0)
  const current = lists[Math.min(active, lists.length - 1)]

  if (lists.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-black/10 bg-neutral-50 p-6 sm:p-8">
        <p className="max-w-xl text-[15px] leading-relaxed text-neutral-600">
          {m.inv_page_body({}, { locale })}
        </p>
        <a
          href={docsHref}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700"
        >
          {m.inv_page_docs({}, { locale })}
          <ArrowUpRight size={15} />
        </a>
      </div>
    )
  }

  return (
    <div className="mt-10">
      {/* sana tab'lari */}
      <div className="-mx-2 flex flex-wrap gap-1">
        {lists.map((list, i) => (
          <button
            key={list.date}
            type="button"
            onClick={() => setActive(i)}
            className={
              'rounded-full px-3.5 py-1.5 text-sm tabular-nums transition ' +
              (i === active
                ? 'bg-neutral-900 font-medium text-white'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800')
            }
          >
            {formatDate(list.date, locale)}
          </button>
        ))}
      </div>

      {/* sarlavha: kompaniya + sana */}
      <p className="mt-6 text-sm font-medium text-neutral-500">
        {company}
        {' · '}
        {m.aff_as_of({ date: formatDate(current.date, locale) }, { locale })}
      </p>

      {/* desktop jadval */}
      <div className="mt-3 hidden sm:block">
        <table className="w-full text-left text-[15px]">
          <thead>
            <tr className="border-b border-black/15 text-[13px] font-medium text-neutral-500">
              {COLS.map((c) => (
                <th key={c.key} className={(c.wide ? '' : 'whitespace-nowrap ') + 'px-2 py-2.5 font-medium'}>
                  {c.label(locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {current.rows.map((row, i) => (
              <tr key={i} className="border-b border-black/[0.06] hover:bg-neutral-50">
                <td className="px-2 py-3 align-top font-medium text-neutral-900">{row.name}</td>
                <td className="px-2 py-3 align-top text-neutral-600">{row.basis}</td>
                <td className="px-2 py-3 align-top tabular-nums text-neutral-700">{row.ordinary}</td>
                <td className="px-2 py-3 align-top tabular-nums text-neutral-700">{row.preferred}</td>
                <td className="px-2 py-3 align-top tabular-nums text-neutral-700">{row.percent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobil kartalar */}
      <div className="mt-3 sm:hidden">
        {current.rows.map((row, i) => (
          <div key={i} className="border-b border-black/[0.06] py-3.5">
            <p className="text-[15px] font-medium text-neutral-900">{row.name}</p>
            <p className="mt-0.5 text-sm text-neutral-500">{row.basis}</p>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-[13px] tabular-nums">
              <div>
                <dt className="text-neutral-400">{m.aff_col_ordinary({}, { locale })}</dt>
                <dd className="text-neutral-800">{row.ordinary}</dd>
              </div>
              <div>
                <dt className="text-neutral-400">{m.aff_col_preferred({}, { locale })}</dt>
                <dd className="text-neutral-800">{row.preferred}</dd>
              </div>
              <div>
                <dt className="text-neutral-400">{m.aff_col_percent({}, { locale })}</dt>
                <dd className="text-neutral-800">{row.percent}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}
