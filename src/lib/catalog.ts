import { BookOpen, Flame, Layers, Package, Printer, Wine } from 'lucide-react'

import * as m from '../paraglide/messages.js'

const CATALOG_BASE = 'https://kvarts.uz/wp-content/uploads/2022/01'
export const CATALOGS = [
  { icon: Package, title: m.cat_jar_t, desc: m.cat_jar_d, file: `${CATALOG_BASE}/%D0%9D%D0%B0-%D0%B1%D0%B0%D0%BD%D0%BA%D1%83.pdf` },
  { icon: Wine, title: m.cat_bottle_t, desc: m.cat_bottle_d, file: `${CATALOG_BASE}/%D0%9D%D0%B0-%D0%B1%D1%83%D1%82%D1%8B%D0%BB%D0%BA%D1%83.pdf` },
  { icon: Layers, title: m.cat_sheet_t, desc: m.cat_sheet_d, file: `${CATALOG_BASE}/%D0%9D%D0%B0-%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2%D0%BE%D0%B5-%D1%81%D1%82%D0%B5%D0%BA%D0%BB%D0%BE.pdf` },
  { icon: Flame, title: m.cat_refr_t, desc: m.cat_refr_d, file: `${CATALOG_BASE}/%D0%9D%D0%B0-%D0%BE%D0%B3%D0%BD%D0%B5%D1%83%D0%BF%D0%BE%D1%80%D1%8B.pdf` },
  { icon: Printer, title: m.cat_print_t, desc: m.cat_print_d, file: `${CATALOG_BASE}/%D0%9D%D0%B0-%D1%84%D0%BE%D1%82%D0%BE%D0%BF%D0%B5%D1%87%D0%B0%D1%82%D1%8C.pdf` },
  { icon: BookOpen, title: m.cat_all_t, desc: m.cat_all_d, file: `${CATALOG_BASE}/%D0%9E%D0%B1%D1%89%D0%B8%D0%B9-%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3.pdf` },
] as const
