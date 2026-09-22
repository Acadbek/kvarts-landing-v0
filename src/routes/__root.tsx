import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  getRouteApi,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { getInitialLocale } from '../lib/locale'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  // Har request'da cookie'dan tilni o'qiydi → SSR to'g'ri tilda render qiladi.
  loader: async () => ({ locale: await getInitialLocale() }),
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title: 'Kvarts AJ - Markaziy Osiyodagi eng katta shisha zavodi | Quvasoy, 1975 yildan',
      },
      {
        name: 'description',
        content: "Kvarts AJ - listovoy float-oyna, rangli va toblangan oyna, shisha banka va butilkalar. Kuniga 400 tonna. 1975 yildan Quvasoyda. 5 davlatga eksport.",
      },
      {
        name: 'theme-color',
        content: '#0a0a0a',
      },
      {
        name: 'color-scheme',
        content: 'light',
      },
      {
        property: 'og:title',
        content: 'Kvarts AJ - Markaziy Osiyodagi eng katta shisha zavodi',
      },
      {
        property: 'og:description',
        content: 'Float-oyna, shisha banka va butilkalar ishlab chiqarish. 1975 yildan Quvasoyda.',
      },
      {
        property: 'og:image',
        content: '/ENZ_4950.jpg',
      },
      {
        property: 'og:type',
        content: 'website',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/logo.png',
      },
      // SF Pro kritik vaznlar — CSS'dan oldin yuklanadi, hard refresh'da
      // font almashinuvi (FOUT/siljish) ko'rinmaydi.
      {
        rel: 'preload',
        href: '/fonts/SFPRODISPLAYREGULAR.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/SFPRODISPLAYMEDIUM.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/SFPRODISPLAYBOLD.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  let locale = 'uz'
  try {
    locale = getRouteApi('__root__').useLoaderData().locale
  } catch {
    /* loader hali tayyor emas — default */
  }
  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
