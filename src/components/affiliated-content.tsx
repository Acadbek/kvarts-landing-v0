import { useState } from 'react'

import * as m from '../paraglide/messages.js'
import type { Locale } from '../paraglide/runtime.js'
import { formatDate } from '../lib/charter'
import type { AffiliatedList, AffiliatedRow } from '../lib/affiliated'

const COLS = [
  { key: 'name' as const, label: (l: Locale) => m.aff_col_name({}, { locale: l }), narrow: false },
  { key: 'basis' as const, label: (l: Locale) => m.aff_col_basis({}, { locale: l }), narrow: false },
  { key: 'ordinary' as const, label: (l: Locale) => m.aff_col_ordinary({}, { locale: l }), narrow: true },
  { key: 'preferred' as const, label: (l: Locale) => m.aff_col_preferred({}, { locale: l }), narrow: true },
  { key: 'percent' as const, label: (l: Locale) => m.aff_col_percent({}, { locale: l }), narrow: true },
]

function Cell({ row }: { row: AffiliatedRow }) {
  return (
    <>
      <td className="px-2 py-3.5 pr-6 align-top font-medium text-neutral-900 first:pl-0">{row.name}</td>
      <td className="px-2 py-3.5 pr-6 align-top text-[14px] text-neutral-500">{row.basis}</td>
      <td className="px-2 py-3.5 align-top tabular-nums text-neutral-700">{row.ordinary}</td>
      <td className="px-2 py-3.5 align-top tabular-nums text-neutral-700">{row.preferred}</td>
      <td className="px-2 py-3.5 align-top tabular-nums text-neutral-700">{row.percent}</td>
    </>
  )
}

/** «Affillangan shaxslar ro'yxati» — sana tab'lari (underline) + hairline jadval.
 * Desktop: 5 ustunli jadval. Mobil: har shaxs uchun minimal blok. */
export function AffiliatedContent({
  lists,
  locale,
  failed = false,
}: {
  lists: AffiliatedList[]
  locale: Locale
  failed?: boolean
}) {
  const [active, setActive] = useState(0)
  const current = lists[Math.min(active, lists.length - 1)]

  if (failed) {
    return (
      <div className="mt-10 rounded-2xl border border-black/10 bg-neutral-50 p-6 sm:p-8">
        <p className="max-w-xl text-[15px] leading-relaxed text-neutral-600">
          {m.docs_load_error({}, { locale })}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700"
        >
          {m.docs_reload({}, { locale })}
        </button>
      </div>
    )
  }

  if (lists.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-black/10 bg-neutral-50 p-6 sm:p-8">
        <p className="max-w-xl text-[15px] leading-relaxed text-neutral-600">
          {m.inv_page_body({}, { locale })}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-16 sm:mt-20">
      {/* sana tab'lari — editorial underline */}
      <div className="flex flex-wrap gap-x-12 gap-y-1 border-b border-black/[0.06]">
        {lists.map((list, i) => (
          <button
            key={list.date}
            type="button"
            onClick={() => setActive(i)}
            className={
              '-mb-px border-b-2 pb-2.5 text-[15px] tabular-nums transition-colors ' +
              (i === active
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800')
            }
          >
            {formatDate(list.date, locale)}
          </button>
        ))}
      </div>

      {/* desktop jadval */}
      <div className="mt-5 hidden sm:block">
        <table className="w-full text-left text-[15px]">
          <thead>
            <tr className="border-b border-black/[0.06] text-[15px] font-normal text-neutral-400">
              {COLS.map((c) => (
                <th
                  key={c.key}
                  className={
                    (c.narrow ? 'whitespace-nowrap pl-2 ' : 'pr-6 ') +
                    'px-2 py-2.5 font-normal first:pl-0'
                  }
                >
                  {c.label(locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {current.rows.map((row, i) => (
              <tr key={i} className="border-b border-black/[0.06] transition-colors hover:bg-neutral-50">
                <Cell row={row} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobil bloklar */}
      <div className="mt-2 sm:hidden">
        {current.rows.map((row, i) => (
          <div key={i} className="border-b border-black/[0.06] py-4">
            <p className="text-[15px] font-medium text-neutral-900">{row.name}</p>
            <p className="mt-0.5 text-sm text-neutral-500">{row.basis}</p>
            <dl className="mt-2.5 grid grid-cols-3 gap-x-4">
              {( [
                [m.aff_col_ordinary({}, { locale }), row.ordinary],
                [m.aff_col_preferred({}, { locale }), row.preferred],
                [m.aff_col_percent({}, { locale }), row.percent],
              ] as const).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[12px] font-normal text-neutral-400">
                    {label}
                  </dt>
                  <dd className="mt-0.5 text-sm tabular-nums text-neutral-800">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}
