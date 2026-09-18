import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Package } from 'lucide-react'

import * as m from '../paraglide/messages.js'
import type { Locale } from '../paraglide/runtime.js'

const MODEL_VIEWER_SRC = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js'

let modelViewerPromise: Promise<void> | null = null

/** model-viewer kutubxonasini bir marta, dangasa yuklash. */
function loadModelViewer(): Promise<void> {
  if (typeof document === 'undefined') return Promise.reject(new Error('ssr'))
  if (typeof customElements !== 'undefined' && customElements.get('model-viewer')) return Promise.resolve()
  if (!modelViewerPromise) {
    modelViewerPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.type = 'module'
      s.src = MODEL_VIEWER_SRC
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('model-viewer load failed'))
      document.head.appendChild(s)
    })
  }
  return modelViewerPromise
}

/**
 * Mahsulot 3D ko'rinishi. Model fayli (`public/models/*.glb`) topilmasa yoki
 * kutubxona yuklanmasa — PDF katalogga havola ko'rinadi, bo'sh joy qolmaydi.
 */
export function ModelCard({
  locale,
  src,
  title,
  hint,
  catalogHref,
  shadow = true,
}: {
  locale: Locale
  src: string
  title: string
  hint: string
  catalogHref: string
  shadow?: boolean
}) {
  // Shisha transmissiyasi oq fonda "yo'qolib" ketmasligi uchun orqada
  // quyuq, rangli blur foto turadi (erigan shisha sexi surati).
  const backdropSrc = '/history/proizvodstvo-stekljannyh-butylok-600x450.jpg'
  const wrapRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLElement>(null)
  const [state, setState] = useState<'idle' | 'ready' | 'missing'>('idle')

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let cancelled = false
    const start = () => {
      fetch(src, { method: 'HEAD' }).then(
        (r) => {
          if (cancelled) return
          if (!r.ok) {
            setState('missing')
            return
          }
          loadModelViewer().then(
            () => {
              if (!cancelled) setState('ready')
            },
            () => {
              if (!cancelled) setState('missing')
            },
          )
        },
        () => {
          if (!cancelled) setState('missing')
        },
      )
    }
    if (typeof IntersectionObserver === 'undefined') {
      start()
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          start()
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px 400px 0px' },
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
    }
  }, [src])

  useEffect(() => {
    const v = viewerRef.current
    if (!v || state !== 'ready') return
    const onError = () => setState('missing')
    v.addEventListener('error', onError)
    return () => v.removeEventListener('error', onError)
  }, [state])

  return (
    <div ref={wrapRef} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="border-b border-black/[0.07] px-5 pt-5 sm:px-6">
        <p className="text-lg font-bold tracking-tight text-neutral-900">{title}</p>
        <p className="mt-0.5 pb-4 text-sm text-neutral-500">{hint}</p>
      </div>
      {state === 'ready' ? (
        <div className="relative overflow-hidden">
          <img
            src={backdropSrc}
            alt=""
            aria-hidden="true"
            draggable={false}
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-[0.8] saturate-150"
          />
          <model-viewer
            ref={viewerRef}
            src={src}
            alt={title}
            loading="lazy"
            environment-image="neutral"
            shadow-intensity={shadow ? '1' : '0'}
            shadow-softness={shadow ? '1' : '0'}
            camera-controls
            touch-action="pan-y"
            className="relative h-[300px] w-full sm:h-[360px]"
          />
        </div>
      ) : state === 'missing' ? (
        <a
          href={catalogHref}
          target="_blank"
          rel="noreferrer"
          className="group flex h-[300px] flex-col items-center justify-center gap-3 bg-neutral-50 p-6 text-center sm:h-[360px]"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-neutral-100 text-neutral-600 ring-1 ring-black/[0.06] ring-inset transition-colors group-hover:bg-neutral-200 group-hover:text-neutral-900">
            <Package size={20} />
          </span>
          <span className="max-w-xs text-sm leading-relaxed text-neutral-500">{hint}</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
            {m.cat_open({}, { locale })}
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </a>
      ) : (
        <div aria-hidden="true" className="h-[300px] animate-pulse bg-neutral-100 sm:h-[360px]" />
      )}
    </div>
  )
}
