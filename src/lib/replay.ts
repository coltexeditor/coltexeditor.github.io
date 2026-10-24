// The install replay: what install.sh draws in a terminal, step by step. The page renders the
// finished screen (finalLines), and the player draws it again from the start, as the installer
// does (same layout, colours, spinner, bar and timing, only faster).

export type Seg = { t: string; c?: string } // c: space-separated classes (b, d, blue, green, gray)
export type Line = Seg[] | { logo: number } // logo: how many stroke cells are white

export type Step =
  | { kind: 'type'; prompt: string; command: string }
  | { kind: 'logo' }
  | { kind: 'blank' }
  | { kind: 'step'; label: string; ms: number }
  | { kind: 'choose'; title: string; options: { name: string; detail: string }[]; path: number[] }
  | { kind: 'note'; text: string }
  | { kind: 'download'; label: string; total: number; ms: number }
  | { kind: 'print'; lines: Seg[][] }

export type Spec = {
  steps: Step[]
  logo: { pixels: string[]; stroke: [number, number][]; name: string; tagline: string }
}

const SPIN = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

const s = (t: string, c?: string): Seg => (c ? { t, c } : { t })

// Columns a string takes in a terminal: two for CJK, Hangul and full-width forms.
export function width(text: string) {
  let w = 0
  for (const ch of text) {
    const cp = ch.codePointAt(0)!
    const wide =
      (cp >= 0x1100 && cp <= 0x115f) ||
      (cp >= 0x2e80 && cp <= 0xa4cf) ||
      (cp >= 0xac00 && cp <= 0xd7a3) ||
      (cp >= 0xf900 && cp <= 0xfaff) ||
      (cp >= 0xfe30 && cp <= 0xfe4f) ||
      (cp >= 0xff00 && cp <= 0xff60) ||
      (cp >= 0xffe0 && cp <= 0xffe6)
    w += wide ? 2 : 1
  }
  return w
}
const pad = (text: string, cols: number) => text + ' '.repeat(Math.max(0, cols - width(text)))

// The installer's awk formats: "1.2 GB" / "340 MB", "48.2 MB/s" / "800 KB/s".
const size = (b: number) => (b >= 1e9 ? `${(b / 1e9).toFixed(1)} GB` : `${Math.round(b / 1e6)} MB`)
const speed = (r: number) => (r >= 1e6 ? `${(r / 1e6).toFixed(1)} MB/s` : `${Math.round(r / 1e3)} KB/s`)

const done = (label: string): Seg[] => [s('  '), s('✓', 'green'), s(` ${label}`)]

function chooseLines(step: Extract<Step, { kind: 'choose' }>, at: number): Seg[][] {
  return [
    [],
    [s('  '), s(step.title, 'b')],
    ...step.options.map((o, i) => {
      const detail = o.detail ? [s(`  ${o.detail}`, 'd')] : []
      return i === at ? [s('    '), s('❯', 'blue'), s(' '), s(o.name, 'b'), ...detail] : [s('      '), s(o.name, 'd'), ...detail]
    }),
    [s('      '), s('↑/↓ · Enter', 'd')],
  ]
}
const chosen = (step: Extract<Step, { kind: 'choose' }>): Seg[] => [
  s('  '),
  s('✓', 'green'),
  s(` ${step.title} `),
  s(step.options[step.path.at(-1)!].name, 'd'),
]

function barLine(label: string, pct: number, cur: number, total: number, rate: string): Seg[] {
  const filled = Math.floor((pct * 20) / 100)
  return [
    s(`    ${pad(label, 16)} `),
    s('━'.repeat(filled), 'blue'),
    s('━'.repeat(20 - filled), 'gray'),
    s(` ${String(pct).padStart(3)}%  `),
    s(`${size(cur)} / ${size(total)}${rate}`, 'd'),
  ]
}

/** The screen once the installer has finished. */
export function finalLines(spec: Spec): Line[] {
  const lines: Line[] = []
  for (const step of spec.steps) {
    switch (step.kind) {
      case 'type':
        lines.push([s(step.prompt, 'd'), s(step.command)])
        break
      case 'logo':
        lines.push({ logo: spec.logo.stroke.length })
        break
      case 'blank':
        lines.push([])
        break
      case 'step':
      case 'download':
        lines.push(done(step.label))
        break
      case 'choose':
        lines.push(chosen(step))
        break
      case 'note':
        lines.push([s('  '), s(step.text, 'd')])
        break
      case 'print':
        lines.push(...step.lines)
        break
    }
  }
  return lines
}

// ---- Drawing --------------------------------------------------------------------------

const SVG = 'http://www.w3.org/2000/svg'
const BLUE = 'rgb(37 99 235)'

/** The mark's pixels: blue, or white once the pen has drawn them (" " is outside the tile). */
export function logoPixels(logo: Spec['logo'], drawn: number) {
  const shown = new Set(logo.stroke.slice(0, drawn).map(([r, c]) => `${r},${c}`))
  return logo.pixels.flatMap((row, y) =>
    [...row].flatMap((p, x) => (p === ' ' ? [] : [{ x, y, white: p === 'W' && shown.has(`${y},${x}`) }])),
  )
}

/** The mark: an 11×11 grid of pixels (" " outside, b blue, W white once drawn) beside the name. */
export function renderLogo(doc: Document, logo: Spec['logo'], drawn: number) {
  const block = doc.createElement('div')
  block.className = 'term-logo'
  // One SVG, not a grid of boxes: boxes leave hairline seams between them at some zooms.
  const svg = doc.createElementNS(SVG, 'svg')
  svg.setAttribute('class', 'term-mark')
  svg.setAttribute('viewBox', `0 0 ${logo.pixels[0].length} ${logo.pixels.length}`)
  svg.setAttribute('shape-rendering', 'crispEdges')
  for (const px of logoPixels(logo, drawn)) {
    const rect = doc.createElementNS(SVG, 'rect')
    for (const [k, v] of Object.entries({ x: px.x, y: px.y, width: 1.02, height: 1.02, fill: px.white ? '#fff' : BLUE }))
      rect.setAttribute(k, String(v))
    svg.append(rect)
  }
  const text = doc.createElement('div')
  text.className = 'term-logo-text'
  const name = doc.createElement('b')
  name.textContent = logo.name
  const tagline = doc.createElement('span')
  tagline.className = 'd'
  tagline.textContent = logo.tagline
  text.append(name, tagline)
  block.append(svg, text)
  return block
}

export function renderLine(doc: Document, line: Line, logo: Spec['logo']) {
  if (!Array.isArray(line)) return renderLogo(doc, logo, line.logo)
  const el = doc.createElement('div')
  el.className = 'term-line'
  for (const seg of line) {
    const span = doc.createElement('span')
    if (seg.c) span.className = seg.c
    span.textContent = seg.t
    el.append(span)
  }
  if (!line.length) el.textContent = ' '
  return el
}

// ---- Playing --------------------------------------------------------------------------

/** Plays the installer in `screen`; resolves when it has finished, or stops when `signal` aborts. */
export async function play(screen: HTMLElement, spec: Spec, signal: AbortSignal) {
  const lines: Line[] = []
  const draw = () => {
    screen.replaceChildren(...lines.map(l => renderLine(document, l, spec.logo)))
    screen.scrollTop = screen.scrollHeight
  }
  const wait = (ms: number) =>
    new Promise<void>((resolve, reject) => {
      if (signal.aborted) return reject(signal.reason)
      const id = setTimeout(resolve, ms)
      signal.addEventListener('abort', () => (clearTimeout(id), reject(signal.reason)), { once: true })
    })
  const set = (i: number, line: Line) => ((lines[i] = line), draw())

  draw()
  await wait(500)
  for (const step of spec.steps) {
    switch (step.kind) {
      case 'type': {
        const i = lines.push([s(step.prompt, 'd'), s('▋', 'cursor')]) - 1
        draw()
        await wait(600)
        for (let n = 1; n <= step.command.length; n++) {
          set(i, [s(step.prompt, 'd'), s(step.command.slice(0, n)), s('▋', 'cursor')])
          // Quicker inside words than at spaces and punctuation, like someone typing.
          await wait(/[\s|/:.]/.test(step.command[n - 1]) ? 70 : 22 + ((n * 7) % 20))
        }
        await wait(450)
        set(i, [s(step.prompt, 'd'), s(step.command)])
        await wait(300)
        break
      }
      case 'logo': {
        const i = lines.push({ logo: 0 }) - 1
        for (let n = 1; n <= spec.logo.stroke.length; n++) {
          await wait(30)
          set(i, { logo: n })
        }
        await wait(250)
        break
      }
      case 'blank':
        lines.push([])
        draw()
        break
      case 'step': {
        const i = lines.length
        const start = performance.now()
        for (let k = 0; performance.now() - start < step.ms; k++) {
          set(i, [s('  '), s(SPIN[k % 10], 'blue'), s(` ${step.label}`)])
          await wait(80)
        }
        set(i, done(step.label))
        break
      }
      case 'choose': {
        const i = lines.length
        for (const [n, at] of step.path.entries()) {
          lines.splice(i, Infinity, ...chooseLines(step, at))
          draw()
          await wait(n === 0 ? 1100 : 650)
        }
        await wait(250)
        lines.splice(i, Infinity, chosen(step))
        draw()
        await wait(200)
        break
      }
      case 'note':
        lines.push([s('  '), s(step.text, 'd')])
        draw()
        await wait(400)
        break
      case 'download': {
        const i = lines.length
        set(i, [s(`    ${step.label}`)])
        await wait(900) // the installer asks the registries for the sizes first
        // The real download takes minutes; here `step.ms`, by the clock (timers may run late).
        // The speed shown is the made-up download's own (bytes per second of its time, about
        // 46 MB/s, a little uneven), over its last few seconds, as the installer's.
        const simSeconds = step.total / 46e6
        const start = performance.now()
        const recent: [number, number][] = [[0, 0]]
        for (let x = 0; x < 1; ) {
          await wait(110)
          x = Math.min(1, (performance.now() - start) / step.ms)
          const cur = step.total * (x + Math.sin(x * 6 * Math.PI) / 60)
          const sim = x * simSeconds
          recent.push([sim, cur])
          while (recent.length > 2 && sim - recent[0][0] > 3) recent.shift()
          const [t0, c0] = recent[0]
          const shown = sim - t0 >= 1 ? ` · ${speed((cur - c0) / (sim - t0))}` : ''
          set(i, barLine(step.label, Math.floor((cur * 100) / step.total), cur, step.total, shown))
        }
        await wait(300)
        set(i, done(step.label))
        break
      }
      case 'print':
        for (const line of step.lines) {
          lines.push(line)
          draw()
          await wait(45)
        }
        break
    }
  }
}
