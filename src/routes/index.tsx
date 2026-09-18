import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Award, Banknote, BookOpen, CalendarDays, ChevronLeft, ChevronRight, Factory, Landmark, Mail, MapPin, Phone } from 'lucide-react'

import * as m from '../paraglide/messages.js'
import type { Locale } from '../paraglide/runtime.js'
import { switchLocale } from '../lib/locale'
import { NEWS, formatNewsDate } from '../lib/news.js'
import { CATALOGS } from '../lib/catalog'
import { FILTER_ID, LINKS, LiquidGlassNav, glassStyle, useLiquidSupported } from '../components/navbar'

export const Route = createFileRoute('/')({ component: VercelHero })


/* ── Scroll reveal o'rami (stagger uchun delay ms) ── */
function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    // Sinxron tekshiruv: refresh'da scroll tiklangan bo'lsa (element allaqachon
    // ekranda), IO kutilmasdan darhol ko'rsatiladi.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px 8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal${shown ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  )
}

/* ── Umumiy seksiya sarlavhasi (VBG: sentence-case da'vo, bir ritm egasi) ── */
function SectionHead({ eyebrow, title, sub, dark = false }: { eyebrow?: string; title: string; sub: string; dark?: boolean }) {
  return (
    <Reveal>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className={`text-sm font-semibold ${dark ? 'text-white/60' : 'text-neutral-500'}`}>{eyebrow}</p>
        )}
        <h2
          className={`mt-3 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl ${
            dark ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {title}
        </h2>
        <p className={`mt-4 max-w-xl text-pretty text-base leading-7 ${dark ? 'text-white/60' : 'text-neutral-600'}`}>{sub}</p>
      </div>
    </Reveal>
  )
}

/* ── Scroll'da sanash animatsiyasi ── */
function useCountUp(target: number, run: boolean, duration = 1400) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!run) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(target)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      setVal(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, target, duration])
  return val
}


const SERVICES = [
  { img: '/services/refractory.jpg', title: m.svc_refr_t, desc: m.svc_refr_d },
  { img: '/services/photo-print.jpg', title: m.svc_print_t, desc: m.svc_print_d },
  { img: '/services/stable.jpg', title: m.svc_horse_t, desc: m.svc_horse_d },
  { img: '/services/chodak.jpg', title: m.svc_chodak_t, desc: m.svc_chodak_d },
  { img: '/services/logistics.jpg', title: m.svc_auto_t, desc: m.svc_auto_d },
] as const

const PRICE_ROWS = [
  [400, 1400000, 1250000.0],
  [430, 1500000, 1339285.71],
  [550, 1700000, 1517857.14],
  [720, 2000000, 1785714.29],
  [1000, 2100000, 1875000.0],
  [1500, 3000000, 2678571.43],
  [1800, 3450000, 3080357.14],
  [2000, 3400000, 3035714.29],
  [3000, 4200000, 3750000.0],
] as const

function grp(n: number): string {
  return Math.trunc(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function money(n: number): string {
  return `${grp(n)},${(n % 1).toFixed(2).slice(2)}`
}

function StatCell({ locale, value, decimals, unit, label }: { locale: Locale; value: number; decimals: number; unit: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [run, setRun] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRun(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRun(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const v = useCountUp(value, run)
  const num = v.toFixed(decimals).replace('.', locale === 'en' ? '.' : ',')
  return (
    <div ref={ref} className="border-t-2 border-neutral-900 pt-5">
      <p className="text-5xl font-semibold tracking-[-0.02em] tabular-nums text-neutral-900 sm:text-6xl">{num}</p>
      <p className="mt-3 text-sm font-semibold text-neutral-900">{unit}</p>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500">{label}</p>
    </div>
  )
}

function QuickLinks({ locale }: { locale: Locale }) {
  const cards = [
    {
      icon: BookOpen,
      title: locale === 'ru' ? 'Каталоги продукции' : locale === 'en' ? 'Product catalogs' : 'Mahsulot kataloglari',
      desc:
        locale === 'ru'
          ? 'На банку, бутылку, листовое стекло, огнеупоры, фотопечать. Общий каталог.'
          : locale === 'en'
            ? 'For jars, bottles, sheet glass, refractories, photo printing. General catalog.'
            : 'Banka, butilka, listovoy oyna, o‘tga chidamlilar, fotopechat. Umumiy katalog.',
      link: locale === 'ru' ? 'Смотреть каталоги' : locale === 'en' ? 'View catalogs' : 'Kataloglarni ko‘rish',
      href: '#mahsulotlar',
      external: false,
    },
    {
      icon: Award,
      title: locale === 'ru' ? 'Сертификаты качества' : locale === 'en' ? 'Quality certificates' : 'Sifat sertifikatlari',
      desc:
        locale === 'ru'
          ? 'Выпускаемая продукция и услуги лицензированы.'
          : locale === 'en'
            ? 'Our products and services are licensed.'
            : 'Ishlab chiqarilayotgan mahsulot va xizmatlar litsenziyalangan.',
      link: locale === 'ru' ? 'Смотреть сертификаты' : locale === 'en' ? 'View certificates' : 'Sertifikatlarni ko‘rish',
      href: '#sertifikatlar',
      external: false,
    },
    {
      icon: Landmark,
      title: locale === 'ru' ? 'Корпоративные сведения' : locale === 'en' ? 'Corporate disclosure' : 'Korporativ ma’lumotlar',
      desc:
        locale === 'ru'
          ? 'Ознакомиться с финансово-хозяйственной деятельностью предприятия.'
          : locale === 'en'
            ? 'Review the financial and business activities of the enterprise.'
            : 'Korxonaning moliyaviy-xo‘jalik faoliyati bilan tanishing.',
      link: locale === 'ru' ? 'Перейти' : locale === 'en' ? 'Open' : 'O‘tish',
      href: 'https://docs.kvarts.uz/',
      external: true,
    },
  ]
  return (
    <section className="relative z-10 border-b border-black/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-10 sm:grid-cols-3 sm:py-12">
        {cards.map((c, i) => (
          <Reveal key={c.href} delay={i * 90}>
            <a
              href={c.href}
              {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group block h-full rounded-2xl border border-black/10 bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_12px_32px_-12px_rgb(0_0_0/0.18)]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-neutral-100 text-neutral-700 ring-1 ring-black/[0.06] ring-inset transition-colors duration-200 group-hover:bg-neutral-200 group-hover:text-neutral-900">
                <c.icon size={20} />
              </span>
              <span className="mt-4 block text-lg font-bold tracking-tight text-neutral-900">{c.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-neutral-500">{c.desc}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
                {c.link}
                <ArrowUpRight size={15} className="text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-900" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function StatsSection({ locale }: { locale: Locale }) {
  const stats = [
    { value: 1402.21, decimals: 2, unit: m.stat_fire_u({}, { locale }), label: m.stat_fire_l({}, { locale }) },
    { value: 269, decimals: 0, unit: m.stat_mln_u({}, { locale }), label: m.stat_jar_l({}, { locale }) },
    { value: 110, decimals: 0, unit: m.stat_mln_u({}, { locale }), label: m.stat_bottle_l({}, { locale }) },
    { value: 30, decimals: 0, unit: m.stat_glass_u({}, { locale }), label: m.stat_glass_l({}, { locale }) },
  ]
  return (
    <section id="zavod" className="relative scroll-mt-24 border-t border-black/10 bg-white">
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <SectionHead eyebrow={m.nav_factory({}, { locale })} title={m.sec_stats_title({}, { locale })} sub={m.sec_stats_sub({}, { locale })} />
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCell key={s.label} locale={locale} value={s.value} decimals={s.decimals} unit={s.unit} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection({ locale }: { locale: Locale }) {
  const facts = [
    { icon: Factory, title: m.fact_mono_t({}, { locale }), desc: m.fact_mono_d({}, { locale }) },
    { icon: Award, title: m.fact_1995_t({}, { locale }), desc: m.fact_1995_d({}, { locale }) },
    { icon: Landmark, title: m.fact_state_t({}, { locale }), desc: m.fact_state_d({}, { locale }) },
    { icon: Banknote, title: m.fact_profit_t({}, { locale }), desc: m.fact_profit_d({}, { locale }) },
  ]
  return (
    <section className="relative scroll-mt-24 border-t border-black/10 bg-white">
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <SectionHead
          eyebrow={locale === 'ru' ? 'О предприятии' : locale === 'en' ? 'About the plant' : 'Korxona haqida'}
          title={locale === 'ru' ? '«Кварц» в фактах' : locale === 'en' ? 'Kvarts in facts' : 'Faktlarda Kvarts'}
          sub={
            locale === 'ru'
              ? 'Крупнейший производитель стекла в Центральной Азии с 1975 года.'
              : locale === 'en'
                ? 'The largest glass manufacturer in Central Asia since 1975.'
                : '1975 yildan buyon Markaziy Osiyodagi eng yirik shisha ishlab chiqaruvchi.'
          }
        />
        <dl className="mt-10 border-t border-black/10">
          {facts.map((f) => (
            <div
              key={f.title}
              className="grid grid-cols-[auto_1fr] items-start gap-4 border-b border-black/10 py-6 sm:items-center sm:gap-8 sm:px-4"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-neutral-950 text-white">
                <f.icon size={20} />
              </span>
              <span className="min-w-0">
                <dt className="text-lg font-bold tracking-tight text-neutral-900">{f.title}</dt>
                <dd className="mt-0.5 text-sm leading-relaxed text-neutral-500">{f.desc}</dd>
              </span>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}


function CatalogSection({ locale }: { locale: Locale }) {  return (
    <section id="mahsulotlar" className="relative scroll-mt-24 border-t border-black/10 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <SectionHead eyebrow={m.nav_products({}, { locale })} title={m.sec_cat_title({}, { locale })} sub={m.sec_cat_sub({}, { locale })} />
        <div className="mt-12 border-t border-black/10">
          {CATALOGS.map((c, i) => (
            <a
              key={c.file}
              href={c.file}
              target="_blank"
              rel="noreferrer"
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-black/10 py-6 transition-colors hover:bg-neutral-50 sm:gap-8 sm:px-4"
            >
                <span
                  aria-hidden="true"
                  className="text-xl font-medium tabular-nums text-neutral-300 transition-colors group-hover:text-primary sm:text-2xl"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex min-w-0 items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground ring-1 ring-primary/30 ring-inset">
                    <c.icon size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">
                      {c.title({}, { locale })}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-neutral-500">{c.desc({}, { locale })}</span>
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <span className="hidden sm:inline">{m.cat_open({}, { locale })}</span>
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            ))}
          </div>
      </div>
    </section>
  )
}

function ServicesSection({ locale }: { locale: Locale }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const total = SERVICES.length

  useEffect(() => {
    const track = trackRef.current
    if (!track || typeof IntersectionObserver === 'undefined') return
    const slides = Array.from(track.children)
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = slides.indexOf(entry.target as HTMLElement)
            if (i >= 0) setActive(i)
          }
        }
      },
      { root: track, threshold: 0.6 },
    )
    slides.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  const goTo = (i: number) => {
    const track = trackRef.current
    if (!track) return
    const next = (i + total) % total
    const slide = track.children[next] as HTMLElement | undefined
    if (!slide) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead dark eyebrow={m.nav_factory({}, { locale })} title={m.sec_svc_title({}, { locale })} sub={m.sec_svc_sub({}, { locale })} />
          <div className="flex items-center gap-3" role="group" aria-label={m.sec_svc_title({}, { locale })}>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label={locale === 'ru' ? 'Предыдущий' : locale === 'en' ? 'Previous' : 'Oldingi'}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/15 text-white transition active:scale-95 hover:border-white/60"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="min-w-14 text-center font-mono text-xs tabular-nums text-white/50" aria-live="polite">
              {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label={locale === 'ru' ? 'Следующий' : locale === 'en' ? 'Next' : 'Keyingi'}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/15 text-white transition active:scale-95 hover:border-white/60"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={m.sec_svc_title({}, { locale })}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SERVICES.map((s, i) => (
            <article
              key={s.img}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${total}`}
              className="grid w-full flex-none snap-start items-center gap-6 md:grid-cols-2 md:gap-12"
            >
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={s.img}
                  alt=""
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold tabular-nums text-white/40">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 max-w-md text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-4xl">
                  {s.title({}, { locale })}
                </h3>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/60">{s.desc({}, { locale })}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2">
          {SERVICES.map((s, i) => (
            <button
              key={s.img}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${i + 1} / ${total}`}
              aria-current={i === active}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                i === active ? 'w-8 bg-white' : 'w-1.5 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const CERT_DOCS = [
  { file: 'list1.jpg', title: m.cert_doc1, meta: 'GOST 111-2014 · № 22201-v1' },
  { file: 'list2.jpg', title: m.cert_doc2, meta: 'GOST 32997-2014 · № 22169' },
  { file: 'list3.jpg', title: m.cert_doc3, meta: 'GOST 30698-2014 · № 22171' },
  { file: 'tara1.jpg', title: m.cert_doc4, meta: 'UzTR.86-013:2017' },
  { file: 'tara2.jpg', title: m.cert_doc5, meta: 'UzTR.86-013:2017' },
  { file: 'ogn1.jpg', title: m.cert_doc6, meta: 'GOST 390-2018' },
  { file: 'ogn2.jpg', title: m.cert_doc7, meta: 'GOST 3910-75' },
  { file: 'smk.jpg', title: m.cert_doc8, meta: 'DQS · № 31101400 QM15' },
] as const

function CertsSection({ locale }: { locale: Locale }) {
  const eyebrow =
    locale === 'ru' ? 'Сертификаты качества' : locale === 'en' ? 'Quality certificates' : 'Sifat sertifikatlari'
  const title =
    locale === 'ru'
      ? 'Продукция и услуги лицензированы'
      : locale === 'en'
        ? 'Licensed products and services'
        : 'Mahsulot va xizmatlar litsenziyalangan'
  const sub =
    locale === 'ru'
      ? 'Выпускаемая продукция соответствует международным стандартам качества.'
      : locale === 'en'
        ? 'Our products meet international quality standards.'
        : 'Ishlab chiqarilayotgan mahsulotlar xalqaro sifat standartlariga mos.'
  return (
    <section id="sertifikatlar" className="relative scroll-mt-24 bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-white/60">{eyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-white/60">{sub}</p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <ul className="mt-10 border-t border-white/10">
            {CERT_DOCS.map((d) => (
              <li key={d.file} className="border-b border-white/10 transition-colors hover:bg-white/[0.03]">
                <a
                  href={`/certs/${d.file}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${m.cert_open({}, { locale })} — ${d.title({}, { locale })}`}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 py-4 sm:px-4"
                >
                  <span className="min-w-0 truncate text-[15px] tracking-tight text-white sm:text-base">
                    <span className="font-bold">{d.title({}, { locale })}</span>
                    <span className="font-mono text-xs font-normal tabular-nums text-white/40"> · {d.meta}</span>
                  </span>
                  <ArrowUpRight size={16} className="shrink-0 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

const HISTORY = [
  { year: '1975', img: '/history/IMG_6668-600x450.jpg', title: m.hist1_t, desc: m.hist1_d },
  { year: '1995', img: '/history/IMG_6678-600x450.jpg', title: m.hist2_t, desc: m.hist2_d },
  { year: '1996', img: '/history/IMG_7479-600x450.jpg', title: m.hist3_t, desc: m.hist3_d },
  { year: '2006', img: '/history/proizvodstvo-stekljannyh-butylok-600x450.jpg', title: m.hist4_t, desc: m.hist4_d },
  { year: '2016', img: '/history/kalcinirovannaya-soda-600x450.jpg', title: m.hist5_t, desc: m.hist5_d },
  { year: '2017', img: '/history/printer-600x450.jpg', title: m.hist6_t, desc: m.hist6_d },
  { year: '2017', img: '/history/IMG_59412-600x450.jpg', title: m.hist7_t, desc: m.hist7_d },
  { year: '2018', img: '/history/ipo-600x450.jpg', title: m.hist8_t, desc: m.hist8_d },
  { year: '2021', img: '/history/IMG_3217-600x450.jpg', title: m.hist9_t, desc: m.hist9_d },
] as const

function HistorySection({ locale }: { locale: Locale }) {
  const cards = [...HISTORY, ...HISTORY]
  const wrapRef = useRef<HTMLDivElement>(null)
  const [running, setRunning] = useState(false)

  // Slider faqat ekranga yaqinlashganda yuradi (400px qolganda start),
  // ko'rinmay qolganda to'xtaydi — keraksiz animatsiya yo'q.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setRunning(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { rootMargin: '0px 0px 400px 0px', threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section id="tarix" aria-label={m.sec_hist_title({}, { locale })} className="relative scroll-mt-24 overflow-hidden border-t border-black/10 bg-neutral-50">
      <div className="relative mx-auto max-w-6xl px-5 pt-16 sm:pt-24">
        <SectionHead eyebrow={m.nav_history({}, { locale })} title={m.sec_hist_title({}, { locale })} sub={m.sec_hist_sub({}, { locale })} />
      </div>
      <div ref={wrapRef} className="relative mt-12 pb-16 sm:pb-24">
        <div className={`anim-history-track flex w-max gap-4 pr-4 motion-reduce:animate-none motion-reduce:overflow-x-auto motion-reduce:px-5${running ? ' is-running' : ''}`}>
          {cards.map((h, i) => (
            <article
              key={`${h.img}#${i}`}
              aria-hidden={i >= HISTORY.length}
              className="w-[280px] flex-none overflow-hidden rounded-2xl border border-black/10 bg-white sm:w-[340px]"
            >
              <div className="overflow-hidden">
                <img
                  src={h.img}
                  alt=""
                  loading="lazy"
                  className="aspect-[3/2] w-full object-cover"
                />
              </div>
              <div className="p-5">
                <p className="font-mono text-sm font-semibold tabular-nums text-neutral-400">{h.year}</p>
                <p className="mt-2 text-base font-bold leading-snug tracking-tight text-neutral-900">
                  {h.title({}, { locale })}
                </p>
                <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-neutral-600">{h.desc({}, { locale })}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PriceSection({ locale }: { locale: Locale }) {
  const docs = [m.price_doc1, m.price_doc2, m.price_doc3]
  const vatShort = locale === 'ru' ? 'С НДС' : locale === 'en' ? 'With VAT' : 'QQS bilan'
  const novatShort = locale === 'ru' ? 'Без НДС' : locale === 'en' ? 'Excl. VAT' : 'QQS siz'
  const perUnit = locale === 'ru' ? 'сум / 1000 шт' : locale === 'en' ? 'UZS / 1000 pcs' : 'so‘m / 1000 dona'
  return (
    <section id="narxlar" className="relative scroll-mt-24 border-t border-black/10 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <SectionHead eyebrow={m.nav_prices({}, { locale })} title={m.sec_price_title({}, { locale })} sub={m.sec_price_sub({}, { locale })} />
        <p className="mx-auto mt-6 w-fit rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white">
          {m.price_note({}, { locale })}
        </p>
        <p className="mt-6 text-right text-xs tabular-nums text-neutral-400">
          {vatShort} · {novatShort} — {perUnit}
        </p>
        <div className="mt-3">
          {PRICE_ROWS.map(([vol, vat, novat]) => (
            <div
              key={vol}
              className="flex items-baseline gap-3 border-t border-black/10 py-5 whitespace-nowrap last:border-b sm:gap-6 sm:px-2"
            >
              <p className="text-base font-bold tracking-tight tabular-nums text-neutral-900 sm:text-xl">
                {grp(vol)} <span className="text-xs font-semibold text-neutral-400 sm:text-sm">sm³</span>
              </p>
              <p className="ml-auto text-right text-base font-semibold tracking-tight tabular-nums text-neutral-900 sm:min-w-36 sm:text-xl">
                {grp(vat)}
              </p>
              <p className="min-w-28 text-right text-[13px] tabular-nums text-neutral-400 sm:min-w-36 sm:text-sm">
                {money(novat)}
              </p>
            </div>
          ))}
        </div>
        <nav aria-label={m.price_docs_t({}, { locale })} className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
          <span className="font-semibold text-neutral-400">{m.price_docs_t({}, { locale })}:</span>
          {docs.map((d, i) => (
            <span key={d({}, { locale })} className="inline-flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="text-neutral-300">·</span>}
              <a
                href="https://docs.kvarts.uz/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
              >
                {d({}, { locale })}
              </a>
            </span>
          ))}
        </nav>
      </div>
    </section>
  )
}

function NewsSection({ locale }: { locale: Locale }) {
  return (
    <section id="yangiliklar" className="relative scroll-mt-24 border-t border-black/10 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <SectionHead eyebrow={m.nav_news({}, { locale })} title={m.sec_news_title({}, { locale })} sub={m.sec_news_sub({}, { locale })} />
        {NEWS.length === 0 ? (
          <p className="mt-10 text-center text-sm text-neutral-500">{m.news_empty({}, { locale })}</p>
        ) : (
          <div className="mt-12 flex flex-col gap-4">
            {NEWS.map((n, i) =>
              i === 0 ? (
                <a
                  key={n.slug}
                  href={n.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid overflow-hidden rounded-2xl border border-black/10 bg-neutral-50 transition-colors hover:border-black/25 md:grid-cols-2"
                >
                  <div className="overflow-hidden">
                    <img
                      src={n.image}
                      alt=""
                      loading="lazy"
                      className="aspect-[16/10] h-full w-full object-cover md:aspect-auto"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-10">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span className="rounded-full bg-neutral-900 px-2.5 py-1 font-semibold text-white">
                        {n.category[locale]}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={12} />
                        {formatNewsDate(n.date, locale)}
                      </span>
                    </div>
                    <p className="mt-4 text-balance text-2xl font-semibold leading-tight tracking-[-0.02em] text-neutral-900 sm:text-3xl">
                      {n.title[locale]}
                    </p>
                    <p className="mt-3 line-clamp-3 max-w-lg text-[15px] leading-relaxed text-neutral-600">{n.excerpt[locale]}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
                      {m.news_more({}, { locale })}
                      <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              ) : (
                <a
                  key={n.slug}
                  href={n.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-black/10 py-5 transition-colors first:border-t hover:bg-neutral-50 sm:gap-6 sm:px-4"
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span className="font-semibold text-primary">{n.category[locale]}</span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={12} />
                        {formatNewsDate(n.date, locale)}
                      </span>
                    </span>
                    <span className="mt-1.5 block truncate text-[15px] font-bold text-neutral-900 sm:text-base">
                      {n.title[locale]}
                    </span>
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/10 text-neutral-400 transition-colors group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white">
                    <ArrowUpRight size={16} />
                  </span>
                </a>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function Partners({ locale }: { locale: Locale }) {
  const logos = [...PARTNER_LOGOS, ...PARTNER_LOGOS]
  return (
    <section aria-label="Hamkorlar" className="overflow-hidden border-t border-black/10 bg-white py-14">
      <p className="mb-10 text-center text-sm font-semibold text-neutral-500">
        {locale === 'ru' ? 'Нам доверяют' : locale === 'en' ? 'Trusted by partners' : 'Hamkorlarimiz'}
      </p>
      <div className="anim-marquee flex w-max items-center gap-14 pr-14 motion-reduce:animate-none">
        {logos.map((l, i) => (
          <img
            key={`${l.src}-${i}`}
            src={l.src}
            alt={l.alt}
            loading="lazy"
            className="h-10 w-auto shrink-0 object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </div>
    </section>
  )
}

function ContactFooter({ locale }: { locale: Locale }) {
  return (
    <footer id="aloqa" className="scroll-mt-24 bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Kvarts AJ" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
            <p className="text-lg font-bold tracking-tight">Kvarts AJ</p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">{m.foot_about({}, { locale })}</p>
          <p className="mt-4 inline-block rounded-md bg-white/10 px-2 py-1 font-mono text-[11px] font-semibold text-white/85 ring-1 ring-white/15 ring-inset">
            UZSE: KVTS
          </p>
        </div>
        <nav aria-label={m.foot_nav_t({}, { locale })}>
          <p className="text-sm font-semibold text-white">{m.foot_nav_t({}, { locale })}</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm font-medium text-white/70 transition hover:text-white">
                  {l.text({}, { locale })}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold text-white">{m.foot_contact_t({}, { locale })}</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-white/70">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-white/40" />
              {m.foot_addr({}, { locale })}
            </li>
            <li>
              <a href="tel:+998733724434" className="flex items-center gap-2.5 transition hover:text-white">
                <Phone size={16} className="shrink-0 text-white/40" />
                +998 73 372 44 34
              </a>
            </li>
            <li>
              <a href="mailto:info@kvarts.uz" className="flex items-center gap-2.5 transition hover:text-white">
                <Mail size={16} className="shrink-0 text-white/40" />
                info@kvarts.uz
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 text-[11px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© 1975–2026 «Kvarts» AJ</span>
          <span>{m.foot_rights({}, { locale })}</span>
        </div>
      </div>
    </footer>
  )
}

const PARTNER_LOGOS = [
  { src: '/partner1.png', alt: 'Partner 1' },
  { src: '/partner2.png', alt: 'Partner 2' },
  { src: '/partner3.png', alt: 'Partner 3' },
  { src: '/partner4.png', alt: 'Partner 4' },
  { src: '/partner5.png', alt: 'Partner 5' },
]

const HERO_SLIDES = [
  { image: '/ENZ_4950.jpg', text: 0 },
  { image: '/ENZ_5391.jpg', text: 1 },
  { image: '/ENZ_5210.jpg', text: 0 },
  { image: '/ENZ_5316.jpg', text: 2 },
]

function VercelHero() {
  const [tick, setTick] = useState(0)
  const [paused, setPaused] = useState(false)
  const [focusHold, setFocusHold] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [canAnimate, setCanAnimate] = useState(false)
  const [imagesReady, setImagesReady] = useState(false)
  const liquid = useLiquidSupported()

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setCanAnimate(!motion.matches && !document.hidden)
    update()
    motion.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    return () => {
      motion.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  useEffect(() => {
    if (paused || focusHold || interacting || !canAnimate || !imagesReady) return
    const id = window.setInterval(() => setTick((t) => t + 1), 6500)
    return () => window.clearInterval(id)
  }, [paused, focusHold, interacting, canAnimate, imagesReady])

  const slide = tick % HERO_SLIDES.length
  const textIdx = HERO_SLIDES[slide].text
  const heroCopy = [
    { title: [m.hero_title_white, m.hero_title_accent], description: m.hero_sub },
    { title: [m.hero_s2_title], description: m.hero_s2_desc },
    { title: [m.hero_s3_title], description: m.hero_s3_desc },
  ]

  useEffect(() => {
    let cancelled = false
    Promise.all(HERO_SLIDES.map(({ image }) => {
      const img = new Image()
      img.src = image
      return img.decode()
    })).then(() => {
      if (!cancelled) setImagesReady(true)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])
  // Root loader hali tayyor bo'lmasa (masalan, dev'da dep re-optimizatsiya paytida
  // router konteksti topilmasa) sahifa yiqilmasligi uchun default 'uz'.
  let initialLocale: Locale = 'uz'
  try {
    initialLocale = getRouteApi('__root__').useLoaderData().locale
  } catch {
    /* router konteksti yo'q — default til bilan render */
  }
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const changeLocale = (code: Locale) => {
    switchLocale(code)
    setLocaleState(code)
  }

  // <html lang> ni joriy til bilan sinxronlash
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  // Refresh'da brauzer eski scroll'ni tiklab qo'ymasligi uchun — har doim tepada boshlanadi.
  useEffect(() => {
    try {
      if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    } catch {
      /* e'tiborsiz */
    }
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Kontentga o‘tish
      </a>

      <LiquidGlassNav locale={locale} changeLocale={changeLocale} />

      <main id="hero" className="relative overflow-hidden">
        <section
          className="hero-scene relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-neutral-950 pb-28"
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse') setInteracting(true)
          }}
          onPointerLeave={() => setInteracting(false)}
          onFocusCapture={() => setFocusHold(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocusHold(false)
          }}
        >
          {/* slayd-shou pauza boshqaruvi — avtomatik harakat >5s bo'lgani uchun (liquid glass, kam blur, glass chekka) */}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={paused ? 'Slayd-shouni davom ettirish' : 'Slayd-shouni pauza qilish'}
            className="absolute right-4 bottom-4 z-10 grid h-10 w-10 cursor-pointer place-items-center rounded-full text-white transition active:scale-[0.98] sm:right-6 sm:bottom-6"
            style={
              liquid
                ? {
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: `url(#${FILTER_ID}) saturate(1.6) blur(0.5px)`,
                    WebkitBackdropFilter: `url(#${FILTER_ID}) saturate(1.6) blur(0.5px)`,
                    boxShadow:
                      'inset 0 0 0 1px rgba(255,255,255,0.28), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.25)',
                  }
                : {
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(6px) saturate(1.6)',
                    WebkitBackdropFilter: 'blur(6px) saturate(1.6)',
                    boxShadow:
                      'inset 0 0 0 1px rgba(255,255,255,0.28), inset 0 1px 1px rgba(255,255,255,0.35), 0 4px 16px rgba(0,0,0,0.25)',
                  }
            }
          >
            {paused ? <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z" /></svg> : <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>}
          </button>

          {/* slayd-shou foni */}
          <div className="absolute inset-0 isolate" aria-hidden="true">
            {HERO_SLIDES.map(({ image }, i) => (
              <div
                key={image}
                className="hero-background absolute inset-0"
                data-active={i === slide}
              >
                <img
                  src={image}
                  alt=""
                  loading="eager"
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {/* matn o'qilishi uchun tekis parda (flat, gradient yo'q) */}
            <div className="absolute inset-0 z-[2] bg-black/55" />
          </div>

          <div className="relative mx-auto max-w-5xl px-5 py-28 text-center">
          {/* badge */}
          <a
            href="#hero-cta"
            className="group inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/20 py-1 pl-1 pr-3.5 text-xs text-white/85 shadow-sm transition-colors duration-300 hover:border-white/40 hover:text-white active:scale-[0.98] sm:text-[13px]"
            style={glassStyle(liquid)}
          >
            <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-black">
              {m.hero_badge_new({}, { locale })}
            </span>
            <span className="truncate">{m.hero_eyebrow({}, { locale })}</span>
            <ArrowRight size={14} className="shrink-0 text-white/60 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
          </a>

          <div>
            <h1 className="mx-auto mt-7 grid max-w-5xl text-balance text-[clamp(2.125rem,1.5rem+4vw,3.375rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-white">
              {heroCopy.map(({ title }, i) => (
                <span key={i} className="hero-copy" data-active={i === textIdx} aria-hidden={i !== textIdx}>
                  {title.map((line, j) => (
                    <span key={j} className="block">{line({}, { locale })}</span>
                  ))}
                </span>
              ))}
            </h1>
            <div className="mx-auto mt-5 grid max-w-xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
              {heroCopy.map(({ description }, i) => (
                <p key={i} className="hero-copy hero-description" data-active={i === textIdx} aria-hidden={i !== textIdx}>
                  {description({}, { locale })}
                </p>
              ))}
            </div>
          </div>

          {/* CTA — badge bilan bir xil struktura/uslub */}
          <div id="hero-cta" className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => document.getElementById('zavod')?.scrollIntoView({ behavior: 'smooth' })}
              className="rise rise-4 group inline-flex w-full cursor-pointer items-center gap-2.5 rounded-full border border-white/20 py-1.5 pl-1.5 pr-5 text-sm font-semibold text-white/90 shadow-sm transition-colors duration-300 hover:border-white/40 hover:text-white active:scale-[0.98] sm:w-auto"
              style={glassStyle(liquid)}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-black">
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="truncate">{m.hero_cta_more({}, { locale })}</span>
            </button>
          </div>
          </div>
        </section>

        <QuickLinks locale={locale} />
        <StatsSection locale={locale} />
        <CatalogSection locale={locale} />
        <PriceSection locale={locale} />
        <ServicesSection locale={locale} />
        <AboutSection locale={locale} />
        <CertsSection locale={locale} />
        <HistorySection locale={locale} />
        <NewsSection locale={locale} />
        <Partners locale={locale} />

        <ContactFooter locale={locale} />
        {/* pastki bar uchun joy (faqat mobil) */}
        <div aria-hidden="true" className="h-24 bg-white lg:hidden" />
      </main>

      {/* mobil pastki action bar — native app feel */}
      <div
        className="fixed inset-x-3 z-40 lg:hidden"
        style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex max-w-md items-center gap-2 rounded-[26px] border border-white/10 bg-neutral-950 p-2 shadow-2xl select-none">
          <a
            href="tel:+998733724434"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 text-sm font-bold text-white transition active:scale-[0.98]"
          >
            <Phone size={17} />
            {m.app_call({}, { locale })}
          </a>
          <a
            href="mailto:info@kvarts.uz"
            className="flex h-12 flex-[1.25] items-center justify-center gap-2 rounded-2xl bg-white text-sm font-bold text-black transition active:scale-[0.98]"
          >
            {m.app_catalog({}, { locale })}
          </a>
        </div>
      </div>
    </div>
  )
}
