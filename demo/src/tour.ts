// The tour (?tour): about two minutes of using ColTex, played on the real interface. A pointer
// moves to what it clicks; typing goes into the real inputs and editor; Bob Baker's cursor and
// avatar come from the demo's awareness. Labels are found in the interface's own language
// through t(). At the end it starts over (a reload resets the demo).
//
// Time: the tour runs on its own clock, the sum of its pauses (waiting for the interface doesn't
// count), so the same moment always has the same time. ?seek=<ms>, or { coltexSeek: ms } posted
// by the page hosting it, plays everything before that moment at once (pauses skipped) and goes
// on from there; going back needs a reload with ?seek. The hosting page is told where the tour is
// ({ coltexTour: { at, chapter, seeking } }, several times a second).
import { EditorView } from '@codemirror/view'
import { closeCompletion } from '@codemirror/autocomplete'
import { t } from '../lib/i18n.ts'
import { userColor } from '../lib/collab.ts'
import { applyTrackedEdits } from '@coltex/review'
import { BOB, CAROL, DEMO_EMAIL, DEMO_PASSWORD, DEMO_PROJECT, ME, bump, docFor, peerCursor, peerJoin, peerType } from './mock/store.ts'
import { EDITS } from './mock/scenario.ts'
import { fastWhile } from './mock/time.ts'

// ---- The clock --------------------------------------------------------------------------------

/** Tour time passed (ms), not counting the pause under way. */
let clock = 0
/** The pause under way: when it started (real time) and how long is left of it. */
let pause: { since: number; ms: number } | null = null
/** Ends the pause under way early (a seek past it). */
let wake: (() => void) | null = null
/** Until the clock reaches this, pauses are skipped. */
let target = Number(new URLSearchParams(location.search).get('seek') ?? 0) || 0
const seeking = () => clock < target
const now = () => clock + (pause ? Math.min(pause.ms, performance.now() - pause.since) : 0)
// The made-up server answers at once while the tour plays through.
fastWhile(seeking)

/**
 * Lets the page do what it has queued (React renders from a MessageChannel task too, so it comes
 * first). Not a timer: nested timers wait at least 4 ms each, which made playing through slow.
 */
const channel = new MessageChannel()
const queued: (() => void)[] = []
channel.port1.onmessage = () => queued.shift()?.()
const yieldToPage = () =>
  new Promise<void>(r => {
    queued.push(r)
    channel.port2.postMessage(null)
  })

/** A pause of `ms` tour time: skipped while seeking (just long enough for the page to draw). */
async function sleep(ms: number) {
  const end = clock + ms
  while (clock < end) {
    if (target >= end) {
      clock = end
      await yieldToPage()
      return
    }
    if (clock < target) clock = target
    const rest = end - clock
    const since = performance.now()
    pause = { since, ms: rest }
    const woke = await new Promise<boolean>(r => {
      const timer = setTimeout(() => r(false), rest)
      wake = () => {
        clearTimeout(timer)
        r(true)
      }
    })
    wake = null
    pause = null
    clock += woke ? Math.min(rest, performance.now() - since) : rest
  }
}

/** Forward from the hosting page: on from there (going back reloads the tour with ?seek). */
addEventListener('message', e => {
  if (e.origin !== location.origin || e.source !== parent || typeof e.data?.coltexSeek !== 'number') return
  target = Math.max(target, e.data.coltexSeek)
  if (target > now()) wake?.()
})

// The tour plays in a frame on the site's home page: focusing something or scrolling it into view
// would also scroll that page to the frame (browsers do that across frames). Here both only move
// what is inside this page.
if (parent !== window) {
  const focus = HTMLElement.prototype.focus
  HTMLElement.prototype.focus = function (options?: FocusOptions) {
    focus.call(this, { ...options, preventScroll: true })
  }
  Element.prototype.scrollIntoView = function () {
    for (let box = this.parentElement; box; box = box.parentElement) {
      if (box.scrollHeight <= box.clientHeight || !/(auto|scroll)/.test(getComputedStyle(box).overflowY)) continue
      const r = this.getBoundingClientRect()
      const b = box.getBoundingClientRect()
      if (r.top < b.top) box.scrollTop -= b.top - r.top
      else if (r.bottom > b.bottom) box.scrollTop += Math.min(r.bottom - b.bottom, r.top - b.top)
    }
  }
}

// ---- Finding things ---------------------------------------------------------------------------

async function waitFor<T>(find: () => T | null | undefined | false, timeout = 10_000): Promise<T> {
  const until = Date.now() + timeout
  for (;;) {
    const found = find()
    if (found) return found
    if (Date.now() > until) throw new Error('not found in time')
    // Real time: waiting for the interface isn't tour time.
    await new Promise(r => setTimeout(r, 60))
  }
}
const text = (el: Element) => (el.textContent ?? '').replace(/\s+/g, ' ').trim()
const visible = (el: Element) => {
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0
}
/** The first visible element matching `selector` whose text is `label` (or starts with it). */
function find(selector: string, label: string, starts = false): HTMLElement | undefined {
  return [...document.querySelectorAll<HTMLElement>(selector)].find(el => visible(el) && (starts ? text(el).startsWith(label) : text(el) === label))
}

// ---- The pointer ------------------------------------------------------------------------------

const pointer = document.createElement('div')
pointer.innerHTML =
  '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 2.5v17.2l4.6-4.4 2.9 6.5 2.6-1.1-2.9-6.4h6.3z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>'
Object.assign(pointer.style, {
  position: 'fixed',
  left: '0',
  top: '0',
  zIndex: '2147483647',
  pointerEvents: 'none',
  margin: '-3px 0 0 -4px',
  filter: 'drop-shadow(0 2px 3px rgb(0 0 0 / 0.3))',
  transitionProperty: 'transform',
  transitionTimingFunction: 'cubic-bezier(0.45, 0, 0.2, 1)',
})
const ripple = document.createElement('div')
Object.assign(ripple.style, {
  position: 'fixed',
  left: '0',
  top: '0',
  width: '36px',
  height: '36px',
  margin: '-18px 0 0 -18px',
  borderRadius: '999px',
  background: 'rgb(37 99 235 / 0.35)',
  zIndex: '2147483646',
  pointerEvents: 'none',
  opacity: '0',
})
let at = { x: innerWidth * 0.62, y: innerHeight * 0.72 }
pointer.style.transform = `translate(${at.x}px, ${at.y}px)`

async function moveTo(target: Element | { x: number; y: number }, ms = 550) {
  let p = target as { x: number; y: number }
  if (target instanceof Element) {
    const r = target.getBoundingClientRect()
    p = { x: r.left + Math.min(r.width / 2, 60), y: r.top + r.height / 2 }
  }
  at = p
  pointer.style.transitionDuration = seeking() ? '0ms' : `${ms}ms`
  pointer.style.transform = `translate(${p.x}px, ${p.y}px)`
  await sleep(ms + 80)
}

/** A full click, as a mouse makes it (Radix menus open on pointerdown, not on click). */
async function press(el: HTMLElement, move = true) {
  if (move) await moveTo(el)
  if (!seeking())
    ripple.animate(
      [
        { opacity: 0.9, transform: `translate(${at.x}px, ${at.y}px) scale(0.3)` },
        { opacity: 0, transform: `translate(${at.x}px, ${at.y}px) scale(1.4)` },
      ],
      { duration: 450, easing: 'ease-out' },
    )
  const opts = { bubbles: true, cancelable: true, clientX: at.x, clientY: at.y, button: 0 }
  el.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerType: 'mouse', isPrimary: true }))
  el.dispatchEvent(new MouseEvent('mousedown', opts))
  el.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerType: 'mouse', isPrimary: true }))
  el.dispatchEvent(new MouseEvent('mouseup', opts))
  el.click()
  await sleep(180)
}

/**
 * Picks an option of an open select: the pointer goes to it and clicks, and the pick itself is
 * the keyboard's (Radix's options don't take a pick from made-up pointer events).
 */
async function choose(option: HTMLElement) {
  await moveTo(option)
  option.focus()
  option.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
  await sleep(180)
}

/** Types into an input or textarea the way React notices (its value setter, then an input event). */
async function typeInto(el: HTMLInputElement | HTMLTextAreaElement, value: string, ms = 55) {
  el.focus()
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')!.set!
  for (let i = 1; i <= value.length; i++) {
    setter.call(el, value.slice(0, i))
    el.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(ms + ((i * 17) % 35))
  }
}
/**
 * Types text in the interface's language in `total` ms whatever its length, so the tour takes
 * the same time in every language (its timeline is one for all).
 */
async function typeTranslated(el: HTMLInputElement | HTMLTextAreaElement, value: string, total: number) {
  el.focus()
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')!.set!
  const chars = [...value]
  for (let i = 1; i <= chars.length; i++) {
    setter.call(el, chars.slice(0, i).join(''))
    el.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(Math.floor((total * i) / chars.length) - Math.floor((total * (i - 1)) / chars.length))
  }
}
const key = (el: Element, name: string) => el.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }))

// ---- The editor -------------------------------------------------------------------------------

const editor = () => EditorView.findFromDOM(document.querySelector<HTMLElement>('.cm-editor')!)!

/** Scrolls the editor so `pos` sits about a third of the way down. */
function scrollEditorTo(view: EditorView, pos: number) {
  view.dispatch({ effects: EditorView.scrollIntoView(pos, { y: 'start', yMargin: view.dom.clientHeight / 3 }) })
}

/**
 * Types at `pos` a few characters at a time (one keystroke each would make the editor redo its
 * work for every letter), the caret following, as edits from the keyboard.
 */
async function typeCode(view: EditorView, pos: number, value: string, ms = 45) {
  view.focus()
  for (const piece of value.match(/\n|[^\n]{1,3}/g) ?? []) {
    view.dispatch({ changes: { from: pos, insert: piece }, selection: { anchor: pos + piece.length }, userEvent: 'input.type', scrollIntoView: true })
    pos += piece.length
    await sleep(piece === '\n' ? 160 : ms + ((pos * 7) % 25))
  }
  closeCompletion(view)
  return pos
}

async function pointAtText(view: EditorView, pos: number) {
  await sleep(150)
  const c = view.coordsAtPos(pos)
  if (c) await moveTo({ x: c.left + 2, y: (c.top + c.bottom) / 2 })
}

// ---- The scenes ---------------------------------------------------------------------------------

const asPeer = (p: typeof BOB) => ({ id: p.id, name: p.name, color: userColor(p.id), colorLight: userColor(p.id).replace(')', ' / 0.18)') })
const peer = { id: BOB.id, name: BOB.name, color: userColor(BOB.id), colorLight: userColor(BOB.id).replace(')', ' / 0.18)') }

async function signIn() {
  const email = await waitFor(() => document.querySelector<HTMLInputElement>('#email'))
  await sleep(700)
  await press(email)
  await typeInto(email, DEMO_EMAIL, 40)
  const password = document.querySelector<HTMLInputElement>('#password')!
  await press(password)
  await typeInto(password, DEMO_PASSWORD, 40)
  await press(document.querySelector<HTMLElement>('form button[type=submit]')!)
}

async function workspace() {
  const title = 'Graph neural networks for protein folding'
  const row = await waitFor(() => find('a, [role=link], tr, button', title, true))
  await sleep(900)
  // A new project starts from a template: by field, or found by name.
  await press(await waitFor(() => find('button', t('New project'))))
  await sleep(1200)
  await press(await waitFor(() => find('[role=dialog] button, [role=dialog] [role=radio]', t('Life sciences'))))
  await sleep(1400)
  await press(await waitFor(() => find('[role=dialog] button, [role=dialog] [role=radio]', t('All'))))
  const search = await waitFor(() => document.querySelector<HTMLInputElement>('#template-search'))
  await press(search)
  await typeInto(search, 'clinical', 60)
  await sleep(1600)
  await press(await waitFor(() => [...document.querySelectorAll<HTMLElement>('[role=dialog] button')].find(b => visible(b) && text(b) === t('Cancel'))))
  await sleep(600)
  await moveTo(row, 900)
  await sleep(400)
  await press(row, false)
  await sleep(300)
  // Some rows navigate on their link only.
  if (!location.hash.includes(DEMO_PROJECT)) location.hash = `#/project/${DEMO_PROJECT}`
}

async function writing() {
  await waitFor(() => document.querySelector('.cm-editor'))
  // The first build and its PDF.
  await waitFor(() => document.querySelector('.pdfViewer canvas'), 15_000)
  await sleep(800)
  const view = editor()
  const anchor = view.state.doc.toString().indexOf('of its neighbours.') + 'of its neighbours'.length
  scrollEditorTo(view, anchor)
  await pointAtText(view, anchor + 1)
  view.dispatch({ selection: { anchor: anchor + 1 } })
  view.focus()
  await sleep(350)
  view.dispatch({ changes: { from: anchor, to: anchor + 1 }, selection: { anchor }, userEvent: 'delete.backward' })
  await sleep(200)
  // "of its neighbours." becomes "of its neighbours:" and the equation (the line break after it stays).
  await typeCode(view, anchor, EDITS.equation!.replace.slice('of its neighbours'.length, -1))
  await sleep(400)
  await press(await waitFor(() => find('button', t('Recompile'))))
  await sleep(2000)
  // Word, for journals that take nothing else: from the project settings' actions.
  await press(await waitFor(() => find('nav button', t('Settings'), true)))
  await sleep(700)
  await press(await waitFor(() => find('[role=dialog] button', t('Actions'))))
  await sleep(600)
  await press(await waitFor(() => find('[role=dialog] button', t('Export to Word…'))))
  await sleep(900)
  await press(await waitFor(() => document.querySelector<HTMLElement>('#word-style')))
  await sleep(700)
  await choose(await waitFor(() => find('[role=option]', 'IEEE')))
  await sleep(1300)
  await press(await waitFor(() => [...document.querySelectorAll<HTMLElement>('[role=dialog] button')].find(b => visible(b) && text(b) === t('Cancel'))))
  await sleep(500)
}

async function visual() {
  await press(await waitFor(() => find('button, [role=radio], [role=tab]', t('Visual'))))
  await sleep(1000)
  const view = editor()
  scrollEditorTo(view, view.state.doc.toString().indexOf('\\section{Method}'))
  await sleep(1800)
  await press(await waitFor(() => find('button, [role=radio], [role=tab]', t('Code'))))
  await sleep(600)
}

async function collaboration() {
  const doc = docFor(DEMO_PROJECT, 'main.tex')!
  peerJoin(DEMO_PROJECT, peer, 'main.tex')
  await sleep(600)
  const view = editor()
  const from = doc.ytext.toString().indexOf(EDITS.colleague!.find) + EDITS.colleague!.find.length
  scrollEditorTo(view, from)
  peerCursor(doc, peer, from)
  await sleep(600)
  // Word by word: each remote change redraws the editor.
  let pos = from
  for (const word of EDITS.colleague!.replace.slice(EDITS.colleague!.find.length).match(/\S+\s*|\s+/g) ?? []) {
    peerType(doc, peer, pos, word)
    pos += word.length
    await sleep(120 + word.length * 18)
  }
  await sleep(500)
  await press(await waitFor(() => find('button', t('Recompile'))))
  await sleep(1000)
  // Bob's comment on the abstract, answered.
  await press(await waitFor(() => find('nav button', t('Review'), true)))
  const reply = await waitFor(() => [...document.querySelectorAll<HTMLTextAreaElement>('textarea')].find(visible))
  await sleep(500)
  await press(reply)
  await typeInto(reply, 'CASP15, yes. I will add it.', 35)
  await sleep(250)
  key(reply, 'Enter')
  await sleep(1400)
}

async function ai() {
  // A new row for the table, with a typo in it.
  await press(await waitFor(() => find('nav button', t('Files'), true)))
  const view = editor()
  const row = EDITS.row!
  const pos = view.state.doc.toString().indexOf(row.find) + row.find.length
  scrollEditorTo(view, pos)
  await pointAtText(view, pos)
  view.dispatch({ selection: { anchor: pos } })
  await typeCode(view, pos, row.replace.slice(row.find.length), 35)
  await sleep(300)
  await press(await waitFor(() => find('button', t('Recompile'))))
  await sleep(1800)
  // The AI agent fixes it.
  await press(await waitFor(() => find('nav button', t('AI'), true)))
  const composer = await waitFor(() => [...document.querySelectorAll<HTMLTextAreaElement>('textarea')].find(visible))
  await sleep(400)
  await press(composer)
  await typeTranslated(composer, t('Fix the compile errors.'), 1800)
  await sleep(300)
  // Enabled once the composer has the text (a moment later when the tour plays through at once).
  await press(await waitFor(() => document.querySelector<HTMLButtonElement>(`button[aria-label="${t('Send')}"]:not(:disabled)`)))
  await press(await waitFor(() => find('button', t('Review')), 20_000))
  await sleep(1100)
  await press(await waitFor(() => find('button', t('Apply selected'), true)))
  await sleep(2600)
}

/** The first visible element matching `selector` whose text contains `part`. */
const findWith = (selector: string, part: string) => [...document.querySelectorAll<HTMLElement>(selector)].find(el => visible(el) && text(el).includes(part))

async function review() {
  // A comment: select the words, the editor's Comment button, write it.
  const view = editor()
  const quote = 'contact maps'
  const from = view.state.doc.toString().indexOf(quote)
  scrollEditorTo(view, from)
  await pointAtText(view, from)
  view.focus()
  view.dispatch({ selection: { anchor: from, head: from + quote.length } })
  const selected = view.coordsAtPos(from + quote.length)
  if (selected) await moveTo({ x: selected.left, y: selected.bottom - 4 }, 400)
  await sleep(300)
  await press(await waitFor(() => document.querySelector<HTMLElement>('.cm-review-add')))
  const box = await waitFor(() => [...document.querySelectorAll<HTMLTextAreaElement>('textarea')].find(el => visible(el) && el.placeholder === t('Add a comment…')))
  await sleep(300)
  await typeInto(box, 'Say what a contact map is, for readers outside the field?', 28)
  await sleep(200)
  await press(await waitFor(() => [...document.querySelectorAll<HTMLElement>('button')].find(b => visible(b) && text(b) === t('Comment') && !b.closest('.cm-editor'))))
  // As a click elsewhere would, which ends the selection (and its Comment button).
  view.dispatch({ selection: { anchor: from + quote.length } })
  await sleep(1300)
  // Carol, a reviewer, suggests words there: a tracked change, accepted.
  const carol = asPeer(CAROL)
  peerJoin(DEMO_PROJECT, carol, 'main.tex')
  const doc = docFor(DEMO_PROJECT, 'main.tex')!
  const end = doc.ytext.toString().indexOf(quote) + quote.length
  await sleep(600)
  applyTrackedEdits(doc.ydoc, [{ fromA: end, toA: end, insert: ' (which residues touch)' }], CAROL.id, Date.now(), 'demo-peer')
  peerCursor(doc, carol, end + ' (which residues touch)'.length)
  bump(DEMO_PROJECT, 'reviewVersion')
  await sleep(1600)
  await press(await waitFor(() => [...document.querySelectorAll<HTMLElement>(`button[aria-label="${t('Accept')}"]`)].find(visible)))
  await sleep(1500)
}

async function references() {
  await press(await waitFor(() => find('nav button', t('References'), true)))
  await press(await waitFor(() => find('[role=tab]', t('Add'))))
  const field = await waitFor(() => [...document.querySelectorAll<HTMLInputElement>('input')].find(el => visible(el) && el.placeholder === t('Title, authors, keywords, DOI or arXiv id')))
  await press(field)
  await typeInto(field, 'graph attention networks', 40)
  await sleep(250)
  field.form?.requestSubmit()
  const add = await waitFor(() => document.querySelector<HTMLElement>(`button[aria-label="${t('Add “{title}”', { title: 'Graph Attention Networks' })}"]`))
  await sleep(1300)
  await press(add)
  await sleep(1200)
  // Cited where the method names the idea.
  const view = editor()
  const anchor = view.state.doc.toString().indexOf('A graph neural network') + 'A graph neural network'.length
  scrollEditorTo(view, anchor)
  await pointAtText(view, anchor)
  view.focus()
  view.dispatch({ selection: { anchor } })
  await press(await waitFor(() => find('[role=tab]', t('Cite'))))
  await sleep(500)
  await press(await waitFor(() => findWith('button', 'velickovic2018')))
  await sleep(1600)
}

async function history() {
  await press(await waitFor(() => find('button', t('History'))))
  const version = await waitFor(() => find('button, li, [role=option]', 'Method section and the architecture figure', true))
  await sleep(900)
  await press(version)
  await sleep(2300)
  await press(await waitFor(() => find('button', t('Back to editor'))))
  await sleep(600)
}

/** Scrolls the page's main column (console pages scroll inside it) by `dy`, smoothly. */
async function scrollPage(dy: number, ms = 900) {
  const candidates = [...document.querySelectorAll<HTMLElement>('main, main *')].filter(el => el.scrollHeight > el.clientHeight + 40 && /(auto|scroll)/.test(getComputedStyle(el).overflowY))
  const target = candidates[0] ?? (document.scrollingElement as HTMLElement)
  target.scrollBy({ top: dy, behavior: 'smooth' })
  await sleep(ms)
}

/** A page from the settings sidebar, looked at for `ms` (scrolled down by `scroll` on the way). */
async function page(title: string, ms: number, scroll = 0) {
  await press(await waitFor(() => find('a', t(title))))
  await sleep(scroll ? ms / 2 : ms)
  if (scroll) {
    await scrollPage(scroll)
    await sleep(ms / 2)
  }
}

async function personalSettings() {
  // From the editor back to the workspace, then the user menu.
  const home = document.querySelector<HTMLElement>('header a[href="#/"], a[href="#/"]')
  if (home) await press(home)
  else location.hash = '#/'
  await press(await waitFor(() => [...document.querySelectorAll<HTMLElement>('button')].find(b => visible(b) && text(b).includes(ME.email))))
  await press(await waitFor(() => find('[role=menuitem]', t('Settings'))))
  // Account: a colour for the avatar.
  const swatches = await waitFor(() => {
    const list = [...document.querySelectorAll<HTMLElement>('[aria-labelledby="settings-avatar-colour"] [role=radio]')]
    return list.length > 4 && list
  })
  await sleep(900)
  await press(swatches[5]!)
  await sleep(1300)
  // Appearance: the themes, applied at once.
  await page('Appearance', 700)
  await press(await waitFor(() => find('button', t('Forest'))))
  await sleep(1300)
  await press(await waitFor(() => find('button', t('Light'))))
  await sleep(600)
  await page('Sync services', 2600)
  await page('Groups', 2600)
  await page('AI agent', 4200, 600)
  await page('AI skills', 1400)
  // Waited for: the list may still be loading when the tour plays through at once.
  await press(await waitFor(() => [...document.querySelectorAll<HTMLElement>('button, a')].find(el => visible(el) && /ieee|figure|rebuttal/i.test(text(el)))))
  await sleep(2200)
}

async function administration() {
  await page('Overview', 4200, 500)
  await page('Manage users', 3200)
  await page('Sign-ins', 2800)
  await page('Invitations', 2600)
  await page('AI services', 3400, 400)
  await page('AI usage & access', 3600, 400)
  await page('Storage & backups', 3200)
  await page('Network', 3200)
}

const STEPS = [signIn, workspace, writing, visual, collaboration, ai, review, references, history, personalSettings, administration]

/**
 * Where each chapter starts and when the tour ends, in tour time (the hosting page draws its
 * bar from them). Measured with ?timeline; the tour warns when a chapter starts elsewhere.
 */
export const TIMELINE = { starts: [0, 4736, 17018, 34360, 39380, 49976, 65770, 77902, 89832, 96062, 124482], end: 162362 }

let chapter = 0
/**
 * Where the tour is, and how far the pause under way goes (`until`): the hosting page moves its
 * bar on with the time only up to there, as the clock stands while the tour waits for the
 * interface.
 */
function report() {
  if (parent === window) return
  const until = pause ? clock + pause.ms : clock
  parent.postMessage({ coltexTour: { at: now(), until, chapter, seeking: seeking(), ...TIMELINE } }, location.origin)
}

async function play() {
  document.body.append(ripple, pointer)
  try {
    localStorage.removeItem('coltex:theme')
  } catch {}
  const measured: number[] = []
  const real: number[] = []
  setInterval(report, 200)
  for (const [i, step] of STEPS.entries()) {
    chapter = i
    measured.push(clock)
    real.push(Math.round(performance.now()))
    if (Math.abs(clock - TIMELINE.starts[i]!) > 300) console.warn(`tour: ${step.name} starts at ${clock}, not ${TIMELINE.starts[i]}`)
    report()
    try {
      await step()
    } catch (err) {
      console.warn('tour:', step.name, err)
    }
  }
  await sleep(2500)
  if (new URLSearchParams(location.search).has('timeline')) console.info('tour: timeline', JSON.stringify({ starts: measured, end: clock }), 'real', JSON.stringify(real.map(r => r - real[0]!)))
  try {
    localStorage.removeItem('coltex:theme')
  } catch {}
  // From the start again, without the seek this run began with.
  const url = new URL(location.href)
  url.searchParams.delete('seek')
  url.hash = ''
  location.replace(url)
}

void play()
