import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import remarkDocs from './src/lib/remark-docs.mjs'

export default defineConfig({
  site: 'https://coltexeditor.github.io',
  // Plain <img> only: no sharp at build time.
  image: { service: { entrypoint: 'astro/assets/services/noop' } },
  markdown: { remarkPlugins: [remarkDocs] },
  vite: { plugins: [tailwindcss()] },
})
