/** Investor hujjatlarining backend Document javobidagi xom tipi. */
export interface RawFactDoc {
  id: string
  title: string
  description?: string | null
  fileUrl: string
  fileSize?: number | null
  mimeType?: string | null
  category: string
  publishedAt?: string | null
  createdAt: string
}

/** category → hujjatlar ro'yxati (bitta til uchun). */
export type InvestorDocs = Record<string, RawFactDoc[]>

export interface DocRow {
  id: string
  title: string
  href: string
  /** ISO sana (YYYY-MM-DD): publishedAt bo'lmasa createdAt. */
  date: string
}

export function mapDocs(rows: RawFactDoc[]): DocRow[] {
  return rows.map((d) => ({
    id: d.id,
    title: d.title,
    href: d.fileUrl,
    date: (d.publishedAt ?? d.createdAt).slice(0, 10),
  }))
}
