// The demo build: ColTex's own web app (vite.config.ts beside this file once it is copied into
// the checkout) under /demo/, with the collaboration module swapped for the demo's and the
// few absolute asset paths moved under /demo/. Copied to apps/web/vite.demo.config.ts.
import path from 'node:path'
import { mergeConfig, type Plugin } from 'vite'
import app from './vite.config.ts'

const BASE = '/demo/'
const real = path.resolve(import.meta.dirname, 'src/lib/collab.ts')
const replacement = path.resolve(import.meta.dirname, 'src/demo/collab.ts')

// Absolute paths in the app that don't go through Vite's base, and the side panel a little wider
// (the tour plays at 1280 px, where the AI panel's picker rows are tight at 320).
const MOVED: [RegExp, string, string][] = [
  [/src\/components\/EditorPage\.tsx$/, 'defaultSize={320} minSize={240}', 'defaultSize={380} minSize={240}'],
  [/src\/components\/PdfViewer\.tsx$|src\/lib\/pdf-figures\.ts$/, "'/pdfjs/", `'${BASE}pdfjs/`],
  [/src\/spelling\/hunspell\/HunspellManager\.ts$/, "'/dictionaries/'", `'${BASE}dictionaries/'`],
  [/src\/components\/shell\/app-shell\.tsx$/, "window.location.assign('/')", `window.location.assign('${BASE}')`],
]

function demo(): Plugin {
  return {
    name: 'coltex-demo',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (!importer || importer === replacement || !/collab/.test(source)) return null
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true })
      return resolved?.id === real ? replacement : null
    },
    transform(code, id) {
      for (const [file, from, to] of MOVED) {
        if (!file.test(id)) continue
        if (!code.includes(from)) throw new Error(`demo: ${from} not found in ${id}`)
        return code.replaceAll(from, to)
      }
      return null
    },
  }
}

export default mergeConfig(app, { base: BASE, build: { outDir: 'dist-demo', emptyOutDir: true }, plugins: [demo()] })
