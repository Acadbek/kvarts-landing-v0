import { File as FileGlass } from 'nucleo-glass-icons/react'

import * as m from '../paraglide/messages.js'
import type { Locale } from '../paraglide/runtime.js'
import { backendAssetUrl } from '../lib/api'
import { formatDate } from '../lib/charter'
import type { DocRow } from '../lib/documents'

function DocRowLine({ doc, locale }: { doc: DocRow; locale: Locale }) {
  return (
    <a
      href={backendAssetUrl(doc.href)}
      target="_blank"
      rel="noreferrer"
      className="-mx-2 flex items-center gap-3 rounded-2xl border-b border-black/[0.06] px-2 py-3.5 last:border-b-0 hover:bg-white/60"
    >
      <FileGlass
        size={20}
        stopColor1="#62A7FA"
        stopColor2="#00408A"
        className="h-5 w-5 shrink-0"
      />
      <span className="min-w-0 flex-1 truncate text-[15px] text-neutral-900">{doc.title}</span>
      <span className="shrink-0 text-sm tabular-nums text-neutral-500">
        {formatDate(doc.date, locale)}
      </span>
    </a>
  )
}

/** Investor hujjat sahifalari (Muhim faktlar, Hisobotlar...) uchun
 * universal table: icon → title → sana.
 * `failed` — API'dan ma'lumot umuman kelmagan (placeholder bilan adashtirmaslik uchun). */
export function DocumentTable({
  docs,
  locale,
  failed = false,
}: {
  docs: DocRow[]
  locale: Locale
  failed?: boolean
}) {
  if (failed) {
    return (
      <div className="glass mt-10 rounded-[28px] p-6 sm:p-8">
        <p className="max-w-xl text-[15px] leading-relaxed text-neutral-600">
          {m.docs_load_error({}, { locale })}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="ios-blue mt-5 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98]"
        >
          {m.docs_reload({}, { locale })}
        </button>
      </div>
    )
  }

  if (docs.length === 0) {
    return (
      <div className="glass mt-10 rounded-[28px] p-6 sm:p-8">
        <p className="max-w-xl text-[15px] leading-relaxed text-neutral-600">
          {m.inv_page_body({}, { locale })}
        </p>
      </div>
    )
  }

  return (
    <div className="glass mt-10 rounded-[28px] p-2 sm:p-4">
      {docs.map((doc) => (
        <DocRowLine key={doc.id} doc={doc} locale={locale} />
      ))}
    </div>
  )
}
