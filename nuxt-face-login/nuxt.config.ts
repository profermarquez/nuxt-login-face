// nuxt.config.ts
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const rootDir = dirname(fileURLToPath(import.meta.url))
const tailwindCssAbs = resolve(rootDir, 'assets/css/tailwind.css')
console.log('RootDir:', tailwindCssAbs )

// Log para verificar la ruta en consola
console.log('[Nuxt] CSS Tailwind en:', tailwindCssAbs)

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss', // (si no usás @vueuse/nuxt, sacalo)
  ],
  css: [tailwindCssAbs],   // <-- usamos la ruta absoluta
  postcss: {
    plugins: { tailwindcss: {}, autoprefixer: {} },
  },
  runtimeConfig: {
    jwtSecret: process.env.NUXT_JWT_SECRET || 'dev-secret-change-me',
  },
  nitro: {
    compatibilityDate: '2025-09-15',
  },pages: true,
  app: {
    head: {
      title: 'Face Login Nuxt',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
