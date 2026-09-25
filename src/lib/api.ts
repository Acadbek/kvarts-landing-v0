/**
 * kvarts-uz-backend'ga qo'shilish (server function orqali).
 * Nega serverFn: loader client navigatsiyada ham shu yerdan o'tadi va
 * so'rov har doim backend'ga SERVER tomonidan ketadi — brauzer CORS'iga
 * qaramaydi (prod'da ham CORS ochish shart emas).
 * Backend javoblari { data: ... } konvertida (TransformInterceptor).
 */

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import type { Locale } from '../paraglide/runtime.js'
import type { InvestorDocs, RawFactDoc } from './documents'
import type { CategoryPages, ShopCategories } from './shop'

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

/** GET + JSON parse. Muvaffaqiyatsiz bo'lsa 1 marta qayta uriniladi
 * (server uyg'onish/tezlik muammolari uchun). */
async function fetchJsonOnce(url: string, attempt: number): Promise<unknown> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(5000),
    cache: 'no-store',
    headers: { accept: 'application/json' },
  })
  if (!res.ok) {
    if (attempt < 1) {
      await new Promise((r) => setTimeout(r, 500))
      return fetchJsonOnce(url, attempt + 1)
    }
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}

async function fetchPublicSettingsOnce(): Promise<Record<string, string> | null> {
  try {
    const body = (await fetchJsonOnce(`${API_URL}/public/settings`, 0)) as unknown
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
  const body = (await fetchJsonOnce(
    `${API_URL}/public/documents?limit=100&lang=${lang}`,
    0,
  )) as unknown
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

async function fetchShopListOnce(path: string): Promise<unknown[]> {
  const lists = await Promise.all(
    (['uz', 'ru', 'en'] as const).map(async (lang) => {
      const body = (await fetchJsonOnce(
        `${API_URL}${path}?limit=100&lang=${lang}`,
        0,
      )) as unknown
      const data =
        body && typeof body === 'object' && 'data' in body
          ? (body as { data: unknown }).data
          : body
      const items =
        data && typeof data === 'object' && 'items' in data
          ? (data as { items: unknown }).items
          : null
      if (!Array.isArray(items)) throw new Error(`no items: ${path}?lang=${lang}`)
      return items
    }),
  )
  return lists as unknown[]
}

/** Mahsulot kategoriyalari (public/categories) — uch til parallel. */
async function fetchCategoriesOnce(): Promise<ShopCategories | null> {
  try {
    const [uz, ru, en] = (await fetchShopListOnce('/public/categories')) as [
      ShopCategories['uz'],
      ShopCategories['ru'],
      ShopCategories['en'],
    ]
    return { uz, ru, en }
  } catch {
    return null
  }
}

export const fetchCategories = createServerFn({ method: 'GET' }).handler(
  fetchCategoriesOnce,
)

async function fetchCategoryDetail(
  slug: string,
  lang: Locale,
): Promise<{ category: unknown; products: unknown[] } | null> {
  const [catBody, prodBody] = await Promise.all([
    fetchJsonOnce(
      `${API_URL}/public/categories/${encodeURIComponent(slug)}?lang=${lang}`,
      0,
    ),
    fetchJsonOnce(
      `${API_URL}/public/products?limit=100&lang=${lang}&categorySlug=${encodeURIComponent(slug)}`,
      0,
    ),
  ])
  const unwrap = (body: unknown) =>
    body && typeof body === 'object' && 'data' in body
      ? (body as { data: unknown }).data
      : body
  const category = unwrap(catBody)
  const prodData = unwrap(prodBody)
  const products =
    prodData && typeof prodData === 'object' && 'items' in prodData
      ? (prodData as { items: unknown }).items
      : null
  if (!category || typeof category !== 'object' || !Array.isArray(products)) return null
  return { category, products }
}

/** Kategoriya sahifasi: category + shu kategoriya mahsulotlari (uch til). */
async function fetchCategoryPageOnce(slug: string): Promise<CategoryPages | null> {
  const results = await Promise.all(
    (['uz', 'ru', 'en'] as const).map((lang) =>
      fetchCategoryDetail(slug, lang).catch(() => null),
    ),
  )
  if (results.every((r) => r === null)) return null
  return {
    uz: results[0] as CategoryPages['uz'],
    ru: results[1] as CategoryPages['ru'],
    en: results[2] as CategoryPages['en'],
  }
}

export const fetchCategoryPage = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string().min(1).max(120) }))
  .handler(async ({ data }) => fetchCategoryPageOnce(data.slug))

export interface AboutContent {
  title: string
  body: string
}

/** «Biz haqimizda» sahifasi (public/pages/about) — uch til parallel. */
async function fetchAboutOnce(): Promise<Record<Locale, AboutContent | null> | null> {
  const results = await Promise.all(
    (['uz', 'ru', 'en'] as const).map(async (lang) => {
      try {
        const body = (await fetchJsonOnce(`${API_URL}/public/pages/about?lang=${lang}`, 0)) as unknown
        const data =
          body && typeof body === 'object' && 'data' in body
            ? (body as { data: unknown }).data
            : body
        if (!data || typeof data !== 'object' || !('title' in data)) return null
        const d = data as { title: unknown; body: unknown }
        if (typeof d.title !== 'string') return null
        return { title: d.title, body: typeof d.body === 'string' ? d.body : '' } as AboutContent
      } catch {
        return null
      }
    }),
  )
  if (results.every((r) => r === null)) return null
  return { uz: results[0], ru: results[1], en: results[2] }
}

export const fetchAbout = createServerFn({ method: 'GET' }).handler(fetchAboutOnce)

const LeadInput = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(32),
  email: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
})

/** Kontakt forma → POST /public/leads (admin panelda ko'rinadi). */
export const submitLead = createServerFn({ method: 'POST' })
  .validator(LeadInput)
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/public/leads`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ ...data, source: 'contact' }),
    })
    if (!res.ok) throw new Error(`leads: HTTP ${res.status}`)
    return { ok: true as const }
  })
