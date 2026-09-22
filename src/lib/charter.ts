import type { Locale } from '../paraglide/runtime.js'

/** Backend'dagi `charter.*` Setting kalitlariga mos tip (kvarts-uz-backend
 * src/modules/settings/charter.defaults.ts — yagona manba). */
export interface CharterLocalized {
  uz: string
  ru: string
  en: string
}

export interface Charter {
  company: CharterLocalized
  fundAmount: string
  sharesTotal: string
  sharesOrdinary: string
  sharesPreferred: string
  sharesNominal: string
  meetingForm: CharterLocalized
  meetingDate: string
  protocolDate: string
  meetingPlace: CharterLocalized
  quorum: string
  dividendStart: string
  dividendEnd: string
}

/** Backend almashinuv formati (flat key-value). */
export type CharterRows = Record<string, string>

/** API juday kechikkan/hatos bo'lsa ishlatiladigan statik zaxira. */
export const CHARTER_DEFAULTS: Charter = {
  company: {
    uz: '«Kvarts» aksiyadorlik jamiyati',
    ru: 'Акционерное общество «Кварц»',
    en: 'Kvarts Joint-Stock Company',
  },
  fundAmount: '606296400',
  sharesTotal: '505247',
  sharesOrdinary: '504413',
  sharesPreferred: '834',
  sharesNominal: '1200',
  meetingForm: { uz: 'Yillik', ru: 'Годовое', en: 'Annual' },
  meetingDate: '2015-04-03',
  protocolDate: '2015-04-13',
  meetingPlace: {
    uz: 'Quvasoy sh., Mustaqillik ko‘chasi 138, jamiyat klubi',
    ru: 'г. Кувасай, ул. Мустакиллик 138, клуб общества',
    en: '138 Mustakillik Str., Quvasoy, company club',
  },
  quorum: '87.58',
  dividendStart: '2015-04-03',
  dividendEnd: '2015-06-02',
}

const DEFAULT_ROWS: CharterRows = {
  'charter.company_uz': CHARTER_DEFAULTS.company.uz,
  'charter.company_ru': CHARTER_DEFAULTS.company.ru,
  'charter.company_en': CHARTER_DEFAULTS.company.en,
  'charter.fund_amount': CHARTER_DEFAULTS.fundAmount,
  'charter.shares_total': CHARTER_DEFAULTS.sharesTotal,
  'charter.shares_ordinary': CHARTER_DEFAULTS.sharesOrdinary,
  'charter.shares_preferred': CHARTER_DEFAULTS.sharesPreferred,
  'charter.shares_nominal': CHARTER_DEFAULTS.sharesNominal,
  'charter.meeting_form_uz': CHARTER_DEFAULTS.meetingForm.uz,
  'charter.meeting_form_ru': CHARTER_DEFAULTS.meetingForm.ru,
  'charter.meeting_form_en': CHARTER_DEFAULTS.meetingForm.en,
  'charter.meeting_date': CHARTER_DEFAULTS.meetingDate,
  'charter.protocol_date': CHARTER_DEFAULTS.protocolDate,
  'charter.meeting_place_uz': CHARTER_DEFAULTS.meetingPlace.uz,
  'charter.meeting_place_ru': CHARTER_DEFAULTS.meetingPlace.ru,
  'charter.meeting_place_en': CHARTER_DEFAULTS.meetingPlace.en,
  'charter.quorum': CHARTER_DEFAULTS.quorum,
  'charter.dividend_start': CHARTER_DEFAULTS.dividendStart,
  'charter.dividend_end': CHARTER_DEFAULTS.dividendEnd,
}

export function mapCharter(settings: CharterRows | null | undefined): Charter {
  const get = (key: string) => settings?.[key]?.trim() || DEFAULT_ROWS[key]
  return {
    company: { uz: get('charter.company_uz'), ru: get('charter.company_ru'), en: get('charter.company_en') },
    fundAmount: get('charter.fund_amount'),
    sharesTotal: get('charter.shares_total'),
    sharesOrdinary: get('charter.shares_ordinary'),
    sharesPreferred: get('charter.shares_preferred'),
    sharesNominal: get('charter.shares_nominal'),
    meetingForm: { uz: get('charter.meeting_form_uz'), ru: get('charter.meeting_form_ru'), en: get('charter.meeting_form_en') },
    meetingDate: get('charter.meeting_date'),
    protocolDate: get('charter.protocol_date'),
    meetingPlace: { uz: get('charter.meeting_place_uz'), ru: get('charter.meeting_place_ru'), en: get('charter.meeting_place_en') },
    quorum: get('charter.quorum'),
    dividendStart: get('charter.dividend_start'),
    dividendEnd: get('charter.dividend_end'),
  }
}

/** "606296400" → "606 296 400". Raqam bo'lmasa, matn ko'rinishida qaytadi. */
export function formatNumber(raw: string): string {
  if (!/^\d+$/.test(raw)) return raw
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/** "2015-04-03" → uz/ru: "03.04.2015", en: "April 3, 2015". */
export function formatDate(iso: string, locale: Locale): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return iso
  const [, y, m, d] = match
  if (locale === 'en') {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${months[Number(m) - 1]} ${Number(d)}, ${y}`
  }
  return `${d}.${m}.${y}`
}

/** Kvoorum: son bo'lsa vergul bilan + %, bo'lmasa matn ko'rinishida. */
export function formatQuorum(raw: string, locale: Locale): string {
  if (/^\d+([.,]\d+)?$/.test(raw)) {
    const shown = locale === 'en' ? raw.replace(',', '.') : raw.replace('.', ',')
    return `${shown} %`
  }
  return raw
}
