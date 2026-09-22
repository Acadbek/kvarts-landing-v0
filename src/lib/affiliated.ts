/** Backend `affiliated.json` (Setting) da saqlanadigan ro'yxat tuzilmasi. */

export interface AffiliatedRow {
  name: string
  basis: string
  ordinary: string
  preferred: string
  percent: string
}

export interface AffiliatedList {
  date: string
  rows: AffiliatedRow[]
}

/** `public/settings` javobidan affiliated ro'yxatlarini ajratib oladi.
 * JSON buzilgan/yo'q bo'lsa — bo'sh massiv (placeholder ko'rsatiladi). */
export function mapAffiliated(settings: Record<string, string> | null | undefined): AffiliatedList[] {
  const raw = settings?.['affiliated.json']
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    const lists = parsed.filter(
      (l): l is AffiliatedList =>
        !!l && typeof l === 'object' && typeof (l as AffiliatedList).date === 'string' &&
        Array.isArray((l as AffiliatedList).rows) &&
        (l as AffiliatedList).rows.every((r) => typeof r?.name === 'string' && typeof r?.basis === 'string'),
    )
    // yangidan eskiga
    return [...lists].sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}
