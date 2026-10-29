// The demo's entry: pick the language and theme it was opened with (?lang=, ?theme=), answer
// the app's requests here, then start ColTex's own web app; ?tour plays the tour.
import { DEMO_EMAIL, DEMO_PASSWORD } from './mock/store.ts'

// The language first: the app's i18n module reads it once, when it is loaded (the mock loads it).
const params = new URLSearchParams(location.search)
try {
  const lang = params.get('lang')
  if (lang) localStorage.setItem('coltex:locale', lang)
} catch {}

const { installMock } = await import('./mock/install.ts')
installMock()
await import('../main.tsx')
if (params.has('tour')) await import('./tour.ts')
else prefillSignIn()

/** The sign-in form comes filled in with the tour's account (any email and password work). */
function prefillSignIn() {
  const fill = () => {
    for (const [id, value] of [['email', DEMO_EMAIL], ['password', DEMO_PASSWORD]] as const) {
      const input = document.querySelector<HTMLInputElement>(`form #${id}`)
      if (!input || input.value || input.dataset.demoFilled) continue
      input.dataset.demoFilled = '1'
      // The way React notices a value: its own setter, then an input event.
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }
  // Again whenever the form appears (after signing out too).
  new MutationObserver(fill).observe(document.getElementById('root')!, { childList: true, subtree: true })
  fill()
}
