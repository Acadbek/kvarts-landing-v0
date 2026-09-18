import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro(),
    tailwindcss(),
    // outdir atayin explicit: config fayl topilmasa ham (masalan, to'liq
    // commit qilinmagan snapshot'da) build yiqilmasligi uchun.
    paraglideVitePlugin({ project: './project.inlang', outdir: './src/paraglide' }),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
