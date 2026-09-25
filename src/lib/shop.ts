import type { Locale } from '../paraglide/runtime.js'

/** Backend Category (public/categories) javobi. */
export interface ShopCategory {
  id: string
  slug: string
  name: string
  description?: string | null
  image?: string | null
  productsCount: number
}

/** Backend Product (public/products) javobi. */
export interface ShopProduct {
  id: string
  slug: string
  name: string
  shortDesc?: string | null
  description?: string | null
  price?: string | number | null
  mainImage?: string | null
  images?: string[]
  specs?: Record<string, string> | null
}

export type ShopCategories = Record<Locale, ShopCategory[]>

export interface CategoryPage {
  category: ShopCategory
  products: ShopProduct[]
}

export type CategoryPages = Record<Locale, CategoryPage | null>

export function asSpecs(raw: unknown): Record<string, string> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === 'string' || typeof v === 'number') out[k] = String(v)
  }
  return Object.keys(out).length > 0 ? out : null
}

/** Specs kalitlari ruscha saqlanadi (katalog asli) — UI'da tarjima qilinadi. */
const SPEC_LABELS: Record<string, { uz: string; ru: string; en: string }> = {
  'Вместимость полная': { uz: 'To‘liq sig‘imi', ru: 'Вместимость', en: 'Capacity' },
  'Высота': { uz: 'Balandligi', ru: 'Высота', en: 'Height' },
  'Диаметр': { uz: 'Diametri', ru: 'Диаметр', en: 'Diameter' },
  'Масса (рекомендуемая)': { uz: 'Massa (tavsiya)', ru: 'Масса (рек.)', en: 'Weight (rec.)' },
  'Тип венчика': { uz: 'Venchik turi', ru: 'Тип венчика', en: 'Finish type' },
  'Погрузка в ж/д вагон': { uz: 'Vagonga yuklash', ru: 'Погрузка в вагон', en: 'Railcar load' },
  'Погрузка в фуру': { uz: 'Furaga yuklash', ru: 'Погрузка в фуру', en: 'Truck load' },
  'Цветовая гамма': { uz: 'Ranglar', ru: 'Цвета', en: 'Colors' },
  'Максимальный размер': { uz: 'Maks. o‘lcham', ru: 'Макс. размер', en: 'Max size' },
  'Толщина': { uz: 'Qalinligi', ru: 'Толщина', en: 'Thickness' },
  'Коэффициент направленного пропускания света': { uz: 'Yorug‘lik o‘tkazuvchanligi', ru: 'Светопропускание', en: 'Light transmittance' },
  'Марки': { uz: 'Markalari', ru: 'Марки', en: 'Grades' },
  'Бренд': { uz: 'Brend', ru: 'Бренд', en: 'Brand' },
  'Область применения': { uz: 'Qo‘llanilish sohasi', ru: 'Применение', en: 'Application' },
  'Назначение': { uz: 'Mo‘ljallangan joy', ru: 'Назначение', en: 'Use' },
  'Поверхность': { uz: 'Yuza', ru: 'Поверхность', en: 'Surface' },
  'Покрытие': { uz: 'Qoplama', ru: 'Покрытие', en: 'Finish' },
  'Размеры коробки': { uz: 'Quti o‘lchami', ru: 'Размер коробки', en: 'Box size' },
  'Размер продукта': { uz: 'Mahsulot o‘lchami', ru: 'Размер продукта', en: 'Product size' },
  'Размеры чипа': { uz: 'Chip o‘lchami', ru: 'Размер чипа', en: 'Chip size' },
  'Толщина чипа': { uz: 'Chip qalinligi', ru: 'Толщина чипа', en: 'Chip thickness' },
  'Основа': { uz: 'Asos', ru: 'Основа', en: 'Base' },
  'Страна-изготовитель': { uz: 'Ishlab chiqaruvchi', ru: 'Производитель', en: 'Origin' },
  'L длина': { uz: 'Uzunligi (L)', ru: 'Длина (L)', en: 'Length (L)' },
  'H ширина': { uz: 'Kengligi (H)', ru: 'Ширина (H)', en: 'Width (H)' },
  'В толщина': { uz: 'Qalinligi (B)', ru: 'Толщина (B)', en: 'Thickness (B)' },
  'В1 конус толщина': { uz: 'Konus qalinligi (B1)', ru: 'Конус (B1)', en: 'Taper (B1)' },
  'Ср.масса кг.': { uz: 'O‘rtacha massa, kg', ru: 'Ср. масса, кг', en: 'Avg weight, kg' },
}

export function specLabel(key: string, locale: Locale): string {
  return SPEC_LABELS[key]?.[locale] ?? key
}

/** Narx: "1200.00"/1200 → "1 200". Null/bo'sh bo'lsa null (ko'rsatilmaydi). */
export function formatPrice(raw: string | number | null | undefined): string | null {
  if (raw === null || raw === undefined || raw === '') return null
  const n = typeof raw === 'number' ? raw : Number(String(raw).replace(',', '.'))
  if (!Number.isFinite(n) || n <= 0) return null
  const [int, dec] = n.toFixed(2).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return dec === '00' ? grouped : `${grouped},${dec}`
}
