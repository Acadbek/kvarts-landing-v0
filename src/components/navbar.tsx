import { useEffect, useRef, useState } from 'react'
import { BarChart3, Briefcase, Check, ChevronDown, ChevronRight, Factory, FileText, FolderOpen, Landmark, Megaphone, Menu, Network, Newspaper, Package, Phone, Tag, Users, Vote, X } from 'lucide-react'

import * as m from '../paraglide/messages.js'
import type { Locale } from '../paraglide/runtime.js'
import { LANGS } from '../lib/locale'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from './ui/navigation-menu'

export const LINKS = [
  { text: m.nav_products, href: '#mahsulotlar' },
  { text: m.nav_factory, href: '#zavod' },
  { text: m.nav_prices, href: '#narxlar' },
  { text: m.nav_news, href: '#yangiliklar' },
] as const

const DOCS = 'https://docs.kvarts.uz/index.php'

const INVESTOR_LINKS = [
  { icon: Landmark, title: m.inv_charter, desc: m.inv_charter_d, href: `${DOCS}?subcat=6` },
  { icon: Megaphone, title: m.inv_facts, desc: m.inv_facts_d, href: `${DOCS}?subcat=11` },
  { icon: BarChart3, title: m.inv_reports, desc: m.inv_reports_d, href: `${DOCS}?subcat=2` },
  { icon: Briefcase, title: m.inv_bizplan, desc: m.inv_bizplan_d, href: 'https://docs.kvarts.uz/' },
  { icon: Users, title: m.inv_affiliated, desc: m.inv_affiliated_d, href: `${DOCS}?subcat=1` },
  { icon: Network, title: m.inv_structure, desc: m.inv_structure_d, href: 'https://docs.kvarts.uz/files/%D0%A1%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B0%2030.06.2025%D0%B3.pdf' },
  { icon: FolderOpen, title: m.inv_corpdocs, desc: m.inv_corpdocs_d, href: `${DOCS}?subcat=7` },
  { icon: Vote, title: m.inv_resolutions, desc: m.inv_resolutions_d, href: `${DOCS}?subcat=1` },
] as const

/** Boshqa sahifada (#models) turganda anchor'lar bosh sahifaga olib boradi. */
function home(href: string): string {
  return href.startsWith('#') ? `/${href}` : href
}

function LanguageMenu({ locale, onSwitch }: { locale: Locale; onSwitch: (code: Locale) => void }) {
  const current = LANGS.find((l) => l.code === locale) ?? LANGS[0]
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={m.lang_label({}, { locale })}
        className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 text-sm font-medium text-white transition-colors duration-300 hover:border-white/60"
      >
        <span className="leading-none whitespace-nowrap">{current.label}</span>
        <ChevronDown size={14} className="shrink-0 self-center opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[11rem]">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => onSwitch(l.code)}
            className={l.code === locale ? 'bg-neutral-100 font-semibold text-neutral-900' : ''}
          >
            <span className="flex-1">{l.label}</span>
            {l.code === locale && <Check size={15} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ── Liquid glass: SVG displacement (Jhey "glass displacement" demosi, dock preset:
   scale -180, kanallar R/G/B +0/+3/+6 — fringing minimal, glitch deyarli yo'q. ── */

export const FILTER_ID = 'kvarts-liquid-glass'

function buildDisplacementMap(w: number, h: number, radius: number): string {
  const W = Math.max(2, Math.round(w))
  const H = Math.max(2, Math.round(h))
  const R = Math.max(0, Math.min(radius, H / 2, W / 2))
  const inset = Math.min(W, H) * 0.045
  const iw = Math.max(1, W - inset * 2)
  const ih = Math.max(1, H - inset * 2)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">` +
    `<defs>` +
    `<linearGradient id="lg-r" x1="100%" y1="0%" x2="0%" y2="0%">` +
    `<stop offset="0%" stop-color="#000"/><stop offset="100%" stop-color="red"/>` +
    `</linearGradient>` +
    `<linearGradient id="lg-b" x1="0%" y1="0%" x2="0%" y2="100%">` +
    `<stop offset="0%" stop-color="#000"/><stop offset="100%" stop-color="blue"/>` +
    `</linearGradient>` +
    `</defs>` +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="black"/>` +
    `<rect x="0" y="0" width="${W}" height="${H}" rx="${R}" fill="url(#lg-r)"/>` +
    `<rect x="0" y="0" width="${W}" height="${H}" rx="${R}" fill="url(#lg-b)" style="mix-blend-mode:difference"/>` +
    `<rect x="${inset}" y="${inset}" width="${iw}" height="${ih}" rx="${R}" fill="hsl(0 0% 50% / 0.93)" style="filter:blur(11px)"/>` +
    `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/** Chromium + backdrop-filter: url() qo'llash mumkinmi (faqat client'da). */
export function useLiquidSupported() {
  const [liquid, setLiquid] = useState(false)
  useEffect(() => {
    try {
      const ua = navigator.userAgent || ''
      const isChromium = /Chrom(e|ium)/.test(ua) || /Edg\//.test(ua) || /OPR\//.test(ua)
      const ok =
        typeof CSS !== 'undefined' &&
        (CSS.supports('backdrop-filter', `url("#${FILTER_ID}")`) ||
          CSS.supports('-webkit-backdrop-filter', `url("#${FILTER_ID}")`))
      setLiquid(isChromium && ok)
    } catch {
      setLiquid(false)
    }
  }, [])
  return liquid
}

/** Navbar shishasi bilan bir xil liquid-glass yuza (badge, tugmalar uchun ham). */
export function glassStyle(liquid: boolean): React.CSSProperties {
  return liquid
    ? {
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: `url(#${FILTER_ID}) saturate(1.5) blur(2px)`,
        WebkitBackdropFilter: `url(#${FILTER_ID}) saturate(1.5) blur(2px)`,
        boxShadow:
          'inset 0 0 0 1px rgba(255,255,255,0.35), inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -1px 3px rgba(0,0,0,0.12)',
      }
    : {
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(16px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.5)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
      }
}

function InvestorsMenu({ locale }: { locale: Locale }) {
  // Click-only: hover sababli ochilishni e'tiborsiz qoldiramiz (controlled value).
  // Yopilish: trigger'ga qayta click, outside click, Escape yoki link click.
  const [value, setValue] = useState<string | null>(null)
  return (
    <NavigationMenu
      className="flex-none"
      value={value}
      onValueChange={(v, details) => {
        if (details?.reason === 'trigger-hover') return
        setValue(v)
      }}
    >
      <NavigationMenuList>
        <NavigationMenuItem value="investors">
          <NavigationMenuTrigger
            className="h-auto items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:border-white/60 focus:bg-white/20 data-popup-open:bg-white/20"
          >
            {m.nav_investors({}, { locale })}
            <ChevronDown size={14} className="shrink-0 self-center opacity-60" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[42rem] max-w-[calc(100vw-3rem)] overflow-hidden">
              {/* Hujjatlar — ikon + matn, scroll yo'q */}
              <ul className="grid grid-cols-2 gap-x-1 gap-y-0.5 p-2.5">
                {INVESTOR_LINKS.map((l, i) => (
                  <InvestorListItem
                    key={`${l.href}#${i}`}
                    icon={l.icon}
                    href={home(l.href)}
                    title={l.title({}, { locale })}
                    desc={l.desc({}, { locale })}
                  />
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  )
}

function InvestorListItem({ icon: Icon, title, desc, href }: { icon: typeof FileText; title: string; desc: string; href: string }) {
  return (
    <li>
      <NavigationMenuLink
        href={href}
        closeOnClick
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 outline-none transition-colors duration-150 hover:bg-neutral-100 focus-visible:bg-neutral-100"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neutral-100 text-neutral-600 ring-1 ring-black/[0.06] ring-inset transition-colors duration-150 group-hover:bg-neutral-200 group-hover:text-neutral-900">
          <Icon size={16} strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold tracking-[-0.01em] text-neutral-900">{title}</span>
          <span className="mt-px block truncate text-xs text-neutral-500">{desc}</span>
        </span>
        <ChevronRight
          size={15}
          className="shrink-0 text-neutral-300 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-neutral-900"
        />
      </NavigationMenuLink>
    </li>
  )
}

export function LiquidGlassNav({ locale, changeLocale }: { locale: Locale; changeLocale: (code: Locale) => void }) {
  const pillRef = useRef<HTMLDivElement>(null)
  const [menu, setMenu] = useState(false)
  const liquid = useLiquidSupported()
  const [mapUri, setMapUri] = useState(() => buildDisplacementMap(640, 60, 30))

  // Pill o'lchami o'zgarganda displacement map'ni qayta generatsiya qilish
  useEffect(() => {
    const el = pillRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const update = () => {
      const r = el.getBoundingClientRect()
      if (r.width > 2 && r.height > 2) setMapUri(buildDisplacementMap(r.width, r.height, r.height / 2))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const pillStyle: React.CSSProperties = liquid
    ? {
        background: 'hsl(0 0% 8% / 0.28)',
        backdropFilter: `url(#${FILTER_ID}) saturate(1.6) blur(1px)`,
        WebkitBackdropFilter: `url(#${FILTER_ID}) saturate(1.6) blur(1px)`,
        boxShadow:
          'inset 0 -10px 24px rgb(0 0 0 / 0.2), inset 0 10px 24px rgb(255 255 255 / 0.08), inset 0 0 0 1px rgb(255 255 255 / 0.1), 0 16px 40px -16px rgb(0 0 0 / 0.35)',
        border: '1px solid rgb(255 255 255 / 0.1)',
      }
    : {
        background: 'hsl(0 0% 8% / 0.35)',
        backdropFilter: 'blur(20px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
        boxShadow:
          'inset 0 -10px 24px rgb(0 0 0 / 0.2), inset 0 10px 24px rgb(255 255 255 / 0.08), inset 0 0 0 1px rgb(255 255 255 / 0.1), 0 16px 40px -16px rgb(0 0 0 / 0.35)',
        border: '1px solid rgb(255 255 255 / 0.1)',
      }

  return (
    <header className="fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-50 px-4 select-none sm:top-[max(1.25rem,env(safe-area-inset-top))]">
      {/* SVG filtr ta'rifi — display:none QILINMASIN (Chrome'da ref uziladi) */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id={FILTER_ID} colorInterpolationFilters="sRGB">
            <feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" href={mapUri} xlinkHref={mapUri} />
            {/* RED — eng kuchli siljish */}
            <feDisplacementMap in="SourceGraphic" in2="map" scale={-180} xChannelSelector="R" yChannelSelector="B" result="dispRed" />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />
            {/* GREEN — tayanch / eng kam siljish */}
            <feDisplacementMap in="SourceGraphic" in2="map" scale={-177} xChannelSelector="R" yChannelSelector="B" result="dispGreen" />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green"
            />
            {/* BLUE — o'rtacha siljish */}
            <feDisplacementMap in="SourceGraphic" in2="map" scale={-174} xChannelSelector="R" yChannelSelector="B" result="dispBlue" />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur in="output" stdDeviation="0.3" />
          </filter>
        </defs>
      </svg>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-stretch">
        <div ref={pillRef} className="flex h-16 w-full items-center justify-between gap-1 rounded-full py-1.5 pr-3.5 pl-2.5" style={pillStyle}>
          <a href={home("#hero")} className="flex shrink-0 items-center" aria-label="Kvarts AJ">
            <img src="/logo.png" alt="Kvarts AJ" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-3 lg:flex" aria-label="Asosiy">
            {LINKS.slice(0, 2).map((l) => (
              <a
                key={l.href}
                href={home(l.href)}
                className="whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:border-white/60"
              >
                {l.text({}, { locale })}
              </a>
            ))}
            <InvestorsMenu locale={locale} />
            {LINKS.slice(2).map((l) => (
              <a
                key={l.href}
                href={home(l.href)}
                className="whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:border-white/60"
              >
                {l.text({}, { locale })}
              </a>
            ))}
          </nav>

          <LanguageMenu locale={locale} onSwitch={changeLocale} />

          <button
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-neutral-300 transition active:scale-95 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label="Menyu"
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menu && (
          <>
            <div
              aria-hidden="true"
              onClick={() => setMenu(false)}
              className="fixed inset-0 -z-10 bg-black/60 lg:hidden"
            />
            <nav
              id="mobile-menu"
              className="anim-sheet mt-2 overflow-hidden rounded-[28px] border border-white/10 bg-neutral-950 p-2 shadow-2xl overscroll-contain"
              aria-label="Mobil"
            >
              {LINKS.slice(0, 2).map((l, i) => {
                const Icon = [Package, Factory][i]
                return (
                  <a
                    key={l.href}
                    href={home(l.href)}
                    onClick={() => setMenu(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-neutral-100 transition active:scale-[0.98] active:bg-white/15 hover:bg-white/10"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
                      <Icon size={19} />
                    </span>
                    <span className="flex-1">{l.text({}, { locale })}</span>
                    <ChevronRight size={16} className="shrink-0 text-neutral-500" />
                  </a>
                )
              })}
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-neutral-100 transition active:scale-[0.98] active:bg-white/15 hover:bg-white/10 [&::-webkit-details-marker]:hidden">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
                    <Users size={19} />
                  </span>
                  <span className="flex-1">{m.nav_investors({}, { locale })}</span>
                  <ChevronDown size={16} className="shrink-0 text-neutral-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-1 mb-1 ml-[52px] flex flex-col gap-0.5 border-l border-white/15 pl-3">
                  {INVESTOR_LINKS.map((l, i) => (
                    <a
                      key={`${l.href}#${i}`}
                      href={home(l.href)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMenu(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm text-neutral-300 transition active:scale-[0.98] active:bg-white/15 hover:bg-white/10 hover:text-white"
                    >
                      {l.title({}, { locale })}
                    </a>
                  ))}
                </div>
              </details>
              {LINKS.slice(2).map((l, i) => {
                const Icon = [Tag, Newspaper][i]
                return (
                  <a
                    key={l.href}
                    href={home(l.href)}
                    onClick={() => setMenu(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-neutral-100 transition active:scale-[0.98] active:bg-white/15 hover:bg-white/10"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
                      <Icon size={19} />
                    </span>
                    <span className="flex-1">{l.text({}, { locale })}</span>
                    <ChevronRight size={16} className="shrink-0 text-neutral-500" />
                  </a>
                )
              })}
              <a
                href={home("#aloqa")}
                onClick={() => setMenu(false)}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-neutral-100 transition active:scale-[0.98] active:bg-white/15 hover:bg-white/10"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
                  <Phone size={19} />
                </span>
                <span className="flex-1">{m.nav_contacts({}, { locale })}</span>
                <ChevronRight size={16} className="shrink-0 text-neutral-500" />
              </a>
              <div className="mt-2 rounded-2xl bg-white/[0.07] p-1.5">
                <div className="flex gap-1">
                  {LANGS.map((l) => {
                    const active = locale === l.code
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          changeLocale(l.code)
                          setMenu(false)
                        }}
                        aria-pressed={active}
                        className={`flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-bold transition active:scale-[0.98] ${
                          active ? 'bg-white text-black shadow' : 'text-neutral-300 hover:bg-white/10'
                        }`}
                      >
                        {l.short}
                      </button>
                    )
                  })}
                </div>
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  )
}
