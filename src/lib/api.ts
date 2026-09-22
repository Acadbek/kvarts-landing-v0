/**
 * kvarts-uz-backend'ga qo'shilish (server function orqali).
 * Nega serverFn: loader client navigatsiyada ham shu yerdan o'tadi va
 * so'rov har doim backend'ga SERVER tomonidan ketadi — brauzer CORS'iga
 * qaramaydi (prod'da ham CORS ochish shart emas).
 * Backend javoblari { data: ... } konvertida (TransformInterceptor).
 */

import { createServerFn } from '@tanstack/react-start'

import type { Locale } from '../paraglide/runtime.js'
import type { InvestorDocs, RawFactDoc } from './documents'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1').replace(
  /\/+$/,
  '',
)

const API_ORIGIN = new URL(API_URL).origin

/** Backend'dan kelgan fayl yo'llarini to'liq URL'ga aylantiradi
 * (`/uploads/...` yoki mutlaq https URL). */
export function backendAssetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`
}

async function fetchPublicSettingsOnce(): Promise<Record<string, string> | null> {
  try {
    const res = await fetch(`${API_URL}/public/settings`, {
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
      headers: { accept: 'application/json' },
    })
    if (!res.ok) return null
    const body = (await res.json()) as unknown
    const data =
      body && typeof body === 'object' && 'data' in body
        ? (body as { data: unknown }).data
        : body
    if (!data || typeof data !== 'object') return null
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string',
      ),
    )
  } catch {
    return null
  }
}

/** GET /public/settings — barcha kalitlar (charter.* kirish bilan).
 * Xato bo'lsa null qaytadi: sahifa statik defaultlarga qaytadi. */
export const fetchPublicSettings = createServerFn({ method: 'GET' }).handler(
  fetchPublicSettingsOnce,
)

async function fetchDocsLang(lang: Locale): Promise<RawFactDoc[]> {
  const res = await fetch(`${API_URL}/public/documents?limit=100&lang=${lang}`, {
    signal: AbortSignal.timeout(5000),
    cache: 'no-store',
    headers: { accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`documents?lang=${lang}: HTTP ${res.status}`)
  const body = (await res.json()) as unknown
  const data =
    body && typeof body === 'object' && 'data' in body
      ? (body as { data: unknown }).data
      : body
  const items =
    data && typeof data === 'object' && 'items' in data
      ? (data as { items: unknown }).items
      : null
  if (!Array.isArray(items)) return []
  return items as RawFactDoc[]
}

/** Investor sahifalari (facts/reports/...) uchun barcha hujjatlar —
 * category bo'yicha guruhlangan, uch tilda parallel.
 * Bir tili chalmasa bo'sh ro'yxat, hammasi chalmasa null (placeholder). */
async function fetchInvestorDocsOnce(): Promise<Record<Locale, InvestorDocs> | null> {
  const results = await Promise.all(
    (['uz', 'ru', 'en'] as const).map((lang) =>
      fetchDocsLang(lang)
        .then((rows) =>
          rows.reduce<InvestorDocs>((acc, d) => {
            const key = d.category || 'general'
            ;(acc[key] ??= []).push(d)
            return acc
          }, {}),
        )
        .catch(() => null),
    ),
  )
  if (results.every((r) => r === null)) return null
  return { uz: results[0] ?? {}, ru: results[1] ?? {}, en: results[2] ?? {} }
}

export const fetchInvestorDocs = createServerFn({ method: 'GET' }).handler(
  fetchInvestorDocsOnce,
)
