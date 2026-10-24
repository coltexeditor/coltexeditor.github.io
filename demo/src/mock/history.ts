// The sample project's history: a few earlier versions of the paper (as it grew), one saved by
// hand with a message and a label, and "now" when the paper changed since. Restoring and
// reverting change the text into one the demo can't build, so they are left to ColTex itself.
import { DEMO_PROJECT, ME, BOB, projects, textOf } from './store.ts'
import { DEMO_ONLY, HttpError, type Req } from './http.ts'

type Route = (method: string, path: string, handler: (req: Req, params: Record<string, string>) => unknown) => void
type Label = { id: number; name: string; versionId: string; createdBy: string | null; createdAt: string }
type Version = {
  id: string
  parent: string | null
  at: string
  kind: string
  message: string
  authors: { id: string; name: string }[]
  labels: Label[]
  files: Record<string, string>
}

const vid = (n: number) => n.toString(16).padStart(4, '0') + 'c01e7d3m0'.replace('m', 'a').repeat(4).slice(0, 36)
const daysAgo = (d: number, h = 0) => new Date(Date.now() - (d * 24 + h) * 3_600_000).toISOString()
const person = (p: typeof ME) => ({ id: p.id, name: p.name })
const PATHS = ['main.tex', 'refs.bib']

/** The paper without what was written after its introduction or its method. */
function earlier(text: string, upTo: 'intro' | 'method') {
  const cut = text.indexOf(upTo === 'intro' ? '\\section{Method}' : '\\section{Results}')
  return text.slice(0, cut) + text.slice(text.indexOf('\\bibliographystyle'))
}
const TEMPLATE = `\\documentclass[conference]{IEEEtran}
\\usepackage{amsmath,amssymb}
\\usepackage{graphicx}

\\title{Paper Title}
\\author{\\IEEEauthorblockN{Alice Anders}
\\IEEEauthorblockA{Department of Biology\\\\
University of Example}}

\\begin{document}
\\maketitle

\\begin{abstract}
\\end{abstract}

\\section{Introduction}

\\end{document}
`

let versions: Version[] | null = null
function saved(): Version[] {
  if (versions) return versions
  const p = projects.get(DEMO_PROJECT)!
  const main = p.files.get('main.tex')!.text!
  const bib = p.files.get('refs.bib')!.text!
  const v: Omit<Version, 'parent'>[] = [
    { id: vid(1), at: daysAgo(9, 3), kind: 'create', message: '', authors: [person(ME)], labels: [], files: { 'main.tex': TEMPLATE } },
    { id: vid(2), at: daysAgo(6, 5), kind: 'edit', message: '', authors: [person(ME)], labels: [], files: { 'main.tex': earlier(main, 'intro'), 'refs.bib': bib } },
    {
      id: vid(3),
      at: daysAgo(3, 2),
      kind: 'commit',
      message: 'Method section and the architecture figure',
      authors: [person(BOB), person(ME)],
      labels: [],
      files: { 'main.tex': earlier(main, 'method'), 'refs.bib': bib },
    },
    { id: vid(4), at: daysAgo(1, 4), kind: 'edit', message: '', authors: [person(ME)], labels: [], files: { 'main.tex': main, 'refs.bib': bib } },
  ]
  v[2]!.labels.push({ id: 1, name: 'Draft for Carol', versionId: v[2]!.id, createdBy: ME.id, createdAt: daysAgo(3, 1) })
  versions = v.map((x, i) => ({ ...x, parent: i ? v[i - 1]!.id : null })).reverse()
  return versions
}

const nowFiles = () => Object.fromEntries(PATHS.map(path => [path, textOf(DEMO_PROJECT, path)!]))

/** The saved versions, with one for the edits made since the latest (as the next automatic version). */
function all(): Version[] {
  const list = saved()
  const now = nowFiles()
  const last = list[0]!
  if (PATHS.every(p => now[p] === last.files[p])) return list
  return [{ id: vid(999), parent: last.id, at: new Date(Date.now() - 30_000).toISOString(), kind: 'edit', message: '', authors: [person(ME), person(BOB)], labels: [], files: now }, ...list]
}

const find = (id: string) => {
  const v = all().find(x => x.id === id)
  if (!v) throw new HttpError(404, 'Version not found')
  return v
}
function compare(to: Version, from: Version | undefined) {
  const paths = new Set([...Object.keys(to.files), ...Object.keys(from?.files ?? {})])
  return [...paths].sort().flatMap(path => {
    const a = from?.files[path]
    const b = to.files[path]
    if (a === b) return []
    return [{ status: a === undefined ? 'added' : b === undefined ? 'deleted' : 'modified', path }]
  })
}
const shape = (v: Version) => {
  const { files: _files, ...rest } = v
  return { ...rest, changes: compare(v, v.parent ? find(v.parent) : undefined) }
}

export function register(route: Route) {
  route('GET', '/api/projects/:id/history', (req, { id }) => {
    if (id !== DEMO_PROJECT) return { versions: [], more: false }
    const list = all()
    const before = req.query.get('before')
    const start = before ? list.findIndex(v => v.id === before) + 1 : 0
    return { versions: list.slice(start, start + 50).map(shape), more: false }
  })
  route('GET', '/api/projects/:id/history/:v/compare', (req, { v }) => {
    const to = find(v)
    const fromId = req.query.get('from')
    return { changes: compare(to, fromId ? find(fromId) : to.parent ? find(to.parent) : undefined) }
  })
  route('GET', '/api/projects/:id/history/:v/file', (req, { v }) => {
    const path = req.query.get('path') ?? ''
    const text = find(v).files[path]
    return text === undefined ? { path, exists: false, binary: false, size: 0 } : { path, exists: true, binary: false, size: text.length, text }
  })
  route('POST', '/api/projects/:id/history/commit', async req => {
    const list = saved()
    const message = String((await req.body()).message ?? '')
    list.unshift({ id: vid(100 + list.length), parent: list[0]!.id, at: new Date().toISOString(), kind: 'commit', message, authors: [person(ME)], labels: [], files: nowFiles() })
    return { versionId: list[0]!.id }
  })
  route('POST', '/api/projects/:id/history/labels', async req => {
    const { name, versionId } = await req.body()
    // A label on "now" saves it as a version first, as the server does.
    if (!versionId && all()[0]!.id === vid(999)) saved().unshift({ ...all()[0]!, id: vid(100 + saved().length) })
    const v = saved().find(x => x.id === (versionId ?? saved()[0]!.id))
    if (!v) throw new HttpError(404, 'Version not found')
    const label: Label = { id: Date.now(), name, versionId: v.id, createdBy: ME.id, createdAt: new Date().toISOString() }
    v.labels.push(label)
    return label
  })
  route('DELETE', '/api/projects/:id/history/labels/:n', (_req, { n }) => {
    for (const v of saved()) v.labels = v.labels.filter(l => String(l.id) !== n)
    return undefined
  })
  for (const action of ['restore', 'revert']) {
    route('POST', `/api/projects/:id/history/:v/${action}`, () => {
      throw new HttpError(403, DEMO_ONLY)
    })
  }
}
