// The demo build: ColTex's own web app (vite.config.ts beside this file once it is copied into
// the checkout) under /demo/, with the collaboration module swapped for the demo's and the
// few absolute asset paths moved under /demo/. Copied to apps/web/vite.demo.config.ts.
import path from 'node:path'
import { mergeConfig, type Plugin } from 'vite'
import app from './vite.config.ts'

const BASE = '/demo/'
const real = path.resolve(import.meta.dirname, 'src/lib/collab.ts')
const replacement = path.resolve(import.meta.dirname, 'src/demo/collab.ts')

// Absolute paths in the app that don't go through Vite's base; and React's 300 ms before a page
// that was loading is shown, which the tour turns off while it plays through to a moment (each
// page it passes waited that long).
const THROTTLE = '(globalThis.__coltexFallbackThrottle ?? 300)'
const MOVED: [RegExp, string, string][] = [
  [/react-dom-client\.production\.js$/, 'globalMostRecentFallbackTime + 300 - now()', `globalMostRecentFallbackTime + ${THROTTLE} - now()`],
  [/react-dom-client\.production\.js$/, '300 > now() - globalMostRecentFallbackTime', `${THROTTLE} > now() - globalMostRecentFallbackTime`],
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
      let changed = false
      for (const [file, from, to] of MOVED) {
        if (!file.test(id)) continue
        if (!code.includes(from)) throw new Error(`demo: ${from} not found in ${id}`)
        code = code.replaceAll(from, to)
        changed = true
      }
      return changed ? code : null
    },
  }
}

// tour-chunks.json lists the build's files, so the tour can load the code of every page it
// visits at its start (demo/src/tour.ts).
export default mergeConfig(app, { base: BASE, build: { outDir: 'dist-demo', emptyOutDir: true, manifest: 'tour-chunks.json' }, plugins: [demo()] })
