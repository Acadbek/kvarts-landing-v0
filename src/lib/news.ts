import type { Locale } from '../paraglide/runtime.js'

export type LocalizedText = Record<Locale, string>

export interface NewsItem {
  slug: string
  /** ISO sana: 2026-08-24 */
  date: string
  image: string
  /** Tashqi manba (kvarts.uz maqolasi) */
  href: string
  category: LocalizedText
  title: LocalizedText
  excerpt: LocalizedText
}

/**
 * Hozircha statik ro'yxat. Kelajakda shu interfeysni buzmasdan
 * API'dan kelgan ma'lumotga almashtiriladi:
 *   const NEWS: NewsItem[] = await fetchNews()
 * Komponent `NEWS` importinigina ishlatadi.
 */
export const NEWS: NewsItem[] = [
  {
    slug: 'vneocherednoe-sobranie-2026-09-14',
    date: '2026-08-24',
    image: '/news/meeting.jpg',
    href: 'https://kvarts.uz/2026/08/24/ao-kvarc-soobshhaet-o-provedenii-vneocherednogo-obshhego-sobraniya-akcionerov-14-sentyabrya-2026-goda/',
    category: { uz: 'E’lonlar', ru: 'Объявления', en: 'Announcements' },
    title: {
      uz: '«Kvarts» AJ 2026 yil 14 sentabrda navbatdan tashqari aksiyadorlar yig‘ilishini o‘tkazadi',
      ru: 'АО «Кварц» сообщает о проведении внеочередного общего собрания акционеров 14 сентября 2026 года',
      en: 'Kvarts JSC announces an extraordinary general shareholders meeting on September 14, 2026',
    },
    excerpt: {
      uz: 'Yig‘ilish 14:00 da Quvasoy sh., Mustaqillik k., 2a manzilidagi majlislar zalida bo‘lib o‘tadi.',
      ru: 'Собрание состоится в 14:00 в зале заседаний АО «Кварц»: Ферганская область, г. Кувасай, ул. Мустакиллик, 2а.',
      en: 'The meeting will be held at 2:00 PM in the Kvarts JSC boardroom: Quvasoy, Mustakillik str., 2a.',
    },
  },
  {
    slug: 'godovoe-sobranie-2026',
    date: '2026-06-04',
    image: '/news/meeting.jpg',
    href: 'https://kvarts.uz/2026/06/04/kvarc-provodit-ocherednoe-godovoe-obshhee-sobranie-akcionerov/',
    category: { uz: 'E’lonlar', ru: 'Объявления', en: 'Announcements' },
    title: {
      uz: '«Kvarts» navbatdagi yillik aksiyadorlar yig‘ilishini o‘tkazmoqda',
      ru: '«Кварц» проводит очередное годовое общее собрание акционеров',
      en: 'Kvarts holds its annual general shareholders meeting',
    },
    excerpt: {
      uz: 'Kuzatuv kengashi hisoboti, korporativ boshqaruv bahosi va 2025 yil yakunlari kun tartibida.',
      ru: 'Отчёт Наблюдательного совета, оценка корпоративного управления и итоги 2025 года.',
      en: 'Supervisory Board report, corporate governance assessment and 2025 results on the agenda.',
    },
  },
  {
    slug: 'prodazha-avto',
    date: '2026-04-22',
    image: '/news/cars.jpg',
    href: 'https://kvarts.uz/2026/04/22/ao-kvarc-vystavilo-na-prodazhu-b-u-avtomobili/',
    category: { uz: 'E’lonlar', ru: 'Объявления', en: 'Announcements' },
    title: {
      uz: '«Kvarts» AJ foydalanilgan avtomobillarni sotuvga qo‘ydi',
      ru: 'АО «Кварц» выставило на продажу б/у автомобили',
      en: 'Kvarts JSC puts used cars up for sale',
    },
    excerpt: {
      uz: 'Damas, Trailblazer, Magnus — texnik ko‘rikdan o‘tgan, 1 yillik bo‘lib-bo‘lib to‘lash bilan.',
      ru: 'Damas, Trailblazer, Magnus — проверены, продажа в рассрочку на 1 год.',
      en: 'Damas, Trailblazer, Magnus — inspected, 1-year installment plan available.',
    },
  },
  {
    slug: 'spektrometr-rigaku',
    date: '2026-03-12',
    image: '/news/spectr.jpg',
    href: 'https://kvarts.uz/2026/03/12/novye-vozmozhnosti-ao-kvarts/',
    category: { uz: 'Korxona yangiliklari', ru: 'Новости предприятия', en: 'Company news' },
    title: {
      uz: '«Kvarts» AJ yangi imkoniyatlari',
      ru: 'Новые возможности АО «Кварц»',
      en: 'New capabilities at Kvarts JSC',
    },
    excerpt: {
      uz: 'Rigaku (Yaponiya) spektrometri — xomashyo tarkibini yuqori aniqlikda tahlil qilish, yangi retseptlar ishlab chiqildi.',
      ru: 'Спектрометр Rigaku (Япония): высокоточный анализ сырья, разработаны новые рецептуры.',
      en: 'Rigaku (Japan) spectrometer: high-precision raw-material analysis, new formulas developed.',
    },
  },
]

export function formatNewsDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split('-').map(Number)
  const months: Record<Locale, string[]> = {
    uz: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'],
    ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  }
  if (locale === 'en') return `${months.en[m - 1]} ${d}, ${y}`
  return `${d} ${months[locale][m - 1]}, ${y}`
}
