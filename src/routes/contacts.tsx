import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Check, Mail, MapPin, Phone } from 'lucide-react'

import * as m from '../paraglide/messages.js'
import type { Locale } from '../paraglide/runtime.js'
import { useInvestorLocale } from '../components/investor-page'
import { LiquidGlassNav } from '../components/navbar'
import { submitLead } from '../lib/api'

export const Route = createFileRoute('/contacts')({
  component: ContactsPage,
})

type Status = 'idle' | 'sending' | 'ok' | 'error'

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-neutral-700">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-[15px] text-neutral-900 outline-none backdrop-blur transition placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  )
}

function ContactForm({ locale }: { locale: Locale }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      await submitLead({
        data: {
          name: name.trim(),
          phone: phone.trim(),
          ...(email.trim() ? { email: email.trim() } : {}),
          ...(message.trim() ? { message: message.trim() } : {}),
        },
      })
      setStatus('ok')
      setName('')
      setPhone('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="glass flex items-start gap-4 rounded-[24px] p-5 sm:p-6">
        <span className="ios-blue grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white">
          <Check size={20} />
        </span>
        <p className="text-[15px] font-medium leading-relaxed text-neutral-800">
          {m.ct_ok({}, { locale })}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-[28px] p-5 sm:p-8">
      <p className="text-xl font-semibold tracking-[-0.01em] text-neutral-900">
        {m.ct_form_t({}, { locale })}
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label={m.ct_name({}, { locale })}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          placeholder="—"
        />
        <Field
          label={m.ct_phone({}, { locale })}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          minLength={7}
          maxLength={32}
          autoComplete="tel"
          inputMode="tel"
          placeholder="+998 —"
        />
      </div>
      <div className="mt-4">
        <Field
          label={m.ct_email({}, { locale })}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          maxLength={120}
          autoComplete="email"
          placeholder="—"
        />
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-neutral-700">
          {m.ct_message({}, { locale })}
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          maxLength={2000}
          className="w-full resize-y rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-[15px] text-neutral-900 outline-none backdrop-blur transition placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </label>
      {status === 'error' && (
        <p className="mt-3 text-sm font-medium text-red-600">{m.ct_err({}, { locale })}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="ios-blue mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {status === 'sending' ? '…' : m.ct_send({}, { locale })}
      </button>
    </form>
  )
}

function ContactsPage() {
  const [locale, changeLocale] = useInvestorLocale()

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const cards = [
    {
      icon: MapPin,
      label: m.ct_address({}, { locale }),
      value: m.foot_addr({}, { locale }),
      href: undefined as string | undefined,
    },
    {
      icon: Phone,
      label: m.ct_phone({}, { locale }),
      value: '+998 73 372-44-34',
      href: 'tel:+998733724434',
    },
    {
      icon: Mail,
      label: m.ct_email({}, { locale }),
      value: 'info@kvarts.uz',
      href: 'mailto:info@kvarts.uz',
    },
  ]

  return (
    <div className="bg-ios min-h-screen font-sans text-neutral-900">
      <a
        href="#contacts"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-sm font-semibold text-white"
      >
        {locale === 'ru' ? 'Перейти к содержимому' : locale === 'en' ? 'Skip to content' : 'Kontentga o‘tish'}
      </a>

      <LiquidGlassNav locale={locale} changeLocale={changeLocale} />

      <main id="contacts" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl">
          {m.nav_contacts({}, { locale })}
        </h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {cards.map((c) => {
            const Icon = c.icon
            const inner = (
              <>
                <span className="ios-blue grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white">
                  <Icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-neutral-400">{c.label}</span>
                  <span className="mt-0.5 block text-[15px] font-semibold leading-snug text-neutral-900">
                    {c.value}
                  </span>
                </span>
              </>
            )
            return c.href ? (
              <a key={c.label} href={c.href} className="glass flex items-start gap-4 rounded-[24px] p-5 transition duration-300 hover:-translate-y-1">
                {inner}
              </a>
            ) : (
              <div key={c.label} className="glass flex items-start gap-4 rounded-[24px] p-5">
                {inner}
              </div>
            )
          })}
        </div>

        <div className="mt-4">
          <ContactForm locale={locale} />
        </div>
      </main>
    </div>
  )
}
