// The demo's answers to the web app's /api requests (see mock/install.ts for how they get
// here), in the shapes of packages/shared. What the demo can't do (sending invitations,
// connecting services, compiling arbitrary changes) is refused with a message saying so.
import { applyEdits, stateText, STATES } from './scenario.ts'
import { bump, DEMO_PROJECT, docFor, ME, PEOPLE, projects, tags, textOf, type DemoProject } from './store.ts'
import * as ai from './ai.ts'
import * as review from './review.ts'
import * as history from './history.ts'
import * as admin from './admin.ts'
import * as accounts from './accounts.ts'
import * as templates from './templates.ts'
import { sleep } from './time.ts'

const pdfs = import.meta.glob<string>('../compiled/*/output.pdf', { query: '?url', import: 'default', eager: true })
const results = import.meta.glob<{ status: string; outputFiles: string[]; diagnostics: unknown[]; durationMs: number }>('../compiled/*/result.json', {
  import: 'default',
  eager: true,
})
const stateIndex = import.meta.glob<Record<string, string>>('../compiled/index.json', { import: 'default', eager: true })['../compiled/index.json']!

export const DEMO_ONLY = "That isn't part of the demo. Install ColTex to use it."

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export type Req = { method: string; path: string; query: URLSearchParams; body: () => Promise<any>; raw: Request }
type Handler = (req: Req, params: Record<string, string>) => unknown | Promise<unknown>
const routes: { method: string; pattern: RegExp; keys: string[]; handler: Handler }[] = []

function route(method: string, path: string, handler: Handler) {
  const keys: string[] = []
  const pattern = new RegExp(
    '^' +
      path.replace(/:(\w+)(\*)?/g, (_m, key, star) => {
        keys.push(key)
        return star ? '(.+)' : '([^/]+)'
      }) +
      '$',
  )
  routes.push({ method, pattern, keys, handler })
}

export async function handle(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const req: Req = {
    method: request.method,
    path: url.pathname,
    query: url.searchParams,
    body: async () => {
      const text = await request.clone().text()
      try {
        return text ? JSON.parse(text) : {}
      } catch {
        return text
      }
    },
    raw: request,
  }
  for (const r of routes) {
    if (r.method !== request.method) continue
    const m = r.pattern.exec(url.pathname)
    if (!m) continue
    const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1]!)]))
    try {
      const result = await r.handler(req, params)
      if (result instanceof Response) return result
      if (result === undefined) return new Response(null, { status: 204 })
      return Response.json(result)
    } catch (err) {
      if (err instanceof HttpError) return Response.json({ error: err.message }, { status: err.status })
      console.error('demo:', err)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
  // Anything else: reading gives nothing, changing is refused.
  if (request.method === 'GET') return Response.json({ error: DEMO_ONLY }, { status: 404 })
  return Response.json({ error: DEMO_ONLY }, { status: 403 })
}

// ---- Accounts ---------------------------------------------------------------------------

let signedIn = false
const created = new Date(Date.now() - 86_400_000 * 60).toISOString()
const sessionUser = () => ({
  id: ME.id,
  name: ME.name,
  email: ME.email,
  emailVerified: true,
  image: null,
  createdAt: created,
  updatedAt: created,
  role: ME.role,
  banned: false,
  banReason: null,
  banExpires: null,
})
const session = () =>
  signedIn
    ? {
        session: { id: 'demo-session', userId: ME.id, token: 'demo', expiresAt: new Date(Date.now() + 86_400_000).toISOString(), createdAt: created, updatedAt: created, ipAddress: null, userAgent: null },
        user: sessionUser(),
      }
    : null

route('GET', '/api/auth/get-session', () => Response.json(session()))
route('POST', '/api/auth/get-session', () => Response.json(session()))
route('POST', '/api/auth/sign-in/email', () => {
  // Any email and password: this is a demo.
  signedIn = true
  return { redirect: false, token: 'demo', user: sessionUser() }
})
route('POST', '/api/auth/sign-out', () => {
  signedIn = false
  return { success: true }
})
route('POST', '/api/auth/update-user', async req => {
  const { name } = await req.body()
  if (typeof name === 'string' && name.trim()) ME.name = name.trim()
  return { status: true }
})
route('POST', '/api/auth/change-password', () => {
  throw new HttpError(400, DEMO_ONLY)
})
route('GET', '/api/setup', () => ({ needsSetup: false, language: null }))
route('GET', '/api/instance', () => ({
  addresses: [
    { kind: 'env', url: admin.SERVER_URL, label: '' },
    { kind: 'tailnet', url: admin.TAILNET_URL, label: 'Tailscale' },
  ],
}))

// ---- Me ---------------------------------------------------------------------------------

const preferences: { theme: string | null; avatarHue: number | null } = {
  // The account's theme: the one the page was opened with, else the system's (ColTex itself
  // starts everyone on Light).
  theme: new URLSearchParams(location.search).get('theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : null),
  avatarHue: null,
}
route('GET', '/api/me/preferences', () => preferences)
route('PUT', '/api/me/preferences', async req => Object.assign(preferences, await req.body()))
route('GET', '/api/users/avatar-hues', () => ({}))
route('GET', '/api/users/search', req => {
  const q = (req.query.get('q') ?? '').toLowerCase()
  return PEOPLE.filter(p => p.id !== ME.id && (p.name.toLowerCase().includes(q) || p.email.includes(q))).map(p => ({ id: p.id, name: p.name, email: p.email }))
})
const learned = new Set<string>()
route('GET', '/api/me/dictionary', () => ({ words: [...learned].sort() }))
route('POST', '/api/me/dictionary', async req => void learned.add((await req.body()).word))
route('DELETE', '/api/me/dictionary', async req => void learned.delete((await req.body()).word))
route('GET', '/api/me/notifications', () => ({ notifications: [], unread: 0, hasMore: false, users: {} }))
route('POST', '/api/me/notifications/read', () => ({ unread: 0 }))
route('POST', '/api/me/notifications/seen', () => undefined)

// ---- The project list -------------------------------------------------------------------

const nameOf = (id: string) => PEOPLE.find(p => p.id === id)?.name ?? 'Someone'
const meta = (p: DemoProject) => ({
  id: p.id,
  name: p.name,
  rootFile: p.rootFile,
  engine: 'auto',
  spellCheckLanguage: 'en_US',
  ownerId: p.ownerId,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
})
const roleOf = (p: DemoProject) => p.members.find(m => m.userId === ME.id)?.role ?? 'viewer'
function project(id: string): DemoProject {
  const p = projects.get(id)
  if (!p) throw new HttpError(404, 'Project not found')
  return p
}

route('GET', '/api/projects', () =>
  [...projects.values()].map(p => ({
    ...meta(p),
    role: roleOf(p),
    ownerName: nameOf(p.ownerId),
    memberCount: p.members.length,
    archived: p.archived,
    trashed: p.trashed,
    tagIds: p.tagIds,
  })),
)
route('GET', '/api/me/tags', () => tags.map(t => ({ ...t, projectIds: [...projects.values()].filter(p => p.tagIds.includes(t.id)).map(p => p.id) })))
route('PATCH', '/api/me/projects', async req => {
  const { projectIds, archived, trashed } = await req.body()
  for (const id of projectIds as string[]) {
    const p = project(id)
    if (archived !== undefined) p.archived = archived
    if (trashed !== undefined) p.trashed = trashed
  }
  return undefined
})

// ---- A project --------------------------------------------------------------------------

function tree(p: DemoProject) {
  const files = [...p.files.entries()].map(([path, f]) => {
    const text = f.text === undefined ? undefined : textOf(p.id, path)
    return { path, size: text === undefined ? f.size : new TextEncoder().encode(text).length, binary: f.text === undefined, modifiedAt: f.modifiedAt }
  })
  return { files, folders: [...p.folders].sort() }
}

route('GET', '/api/projects/:id', (_req, { id }) => {
  const p = project(id)
  const docs = [...p.files.keys()].flatMap(path => {
    const doc = docFor(p.id, path)
    return doc ? [{ id: doc.id, path }] : []
  })
  return { project: meta(p), role: roleOf(p), ...tree(p), docs }
})
route('PATCH', '/api/projects/:id', async (req, { id }) => {
  const p = project(id)
  const body = await req.body()
  if (typeof body.name === 'string') p.name = body.name
  if (typeof body.rootFile === 'string') p.rootFile = body.rootFile
  return meta(p)
})
route('GET', '/api/projects/:id/docs/resolve', (req, { id }) => {
  const doc = docFor(id, req.query.get('path') ?? '')
  if (!doc) throw new HttpError(404, 'File not found')
  return { docId: doc.id }
})
route('GET', '/api/projects/:id/members', (_req, { id }) =>
  project(id).members.map(m => {
    const person = PEOPLE.find(x => x.id === m.userId)!
    return { userId: m.userId, name: person.name, email: person.email, role: m.role }
  }),
)
route('GET', '/api/projects/:id/files/:path*', async (_req, { id, path }) => {
  const p = project(id)
  const file = p.files.get(path)
  if (!file) throw new HttpError(404, 'File not found')
  if (file.asset) return new Response(await (await realFetch(file.asset)).blob(), { headers: { 'content-type': 'application/pdf' } })
  return new Response(textOf(id, path) ?? '', { headers: { 'content-type': 'text/plain; charset=utf-8' } })
})
route('GET', '/api/projects/:id/sources', (_req, { id }) => {
  const p = project(id)
  return { files: [...p.files.entries()].filter(([, f]) => f.text !== undefined).map(([path]) => ({ path, content: textOf(id, path)! })) }
})
route('GET', '/api/projects/:id/linked-files', () => [])
route('GET', '/api/projects/:id/references', () => [])
// The literature search answers one question the tour asks (real papers, as Crossref and arXiv list
// them); adding one writes its entry into the .bib file like the server does.
const LITERATURE = [
  { source: 'arxiv', id: 'arxiv:1710.10903', doi: null, title: 'Graph Attention Networks', authors: ['Petar Veličković', 'Guillem Cucurull', 'Arantxa Casanova', 'Adriana Romero', 'Pietro Liò', 'Yoshua Bengio'], year: 2018, venue: 'ICLR' },
  { source: 'arxiv', id: 'arxiv:2105.14491', doi: null, title: 'How Attentive are Graph Attention Networks?', authors: ['Shaked Brody', 'Uri Alon', 'Eran Yahav'], year: 2022, venue: 'ICLR' },
  { source: 'arxiv', id: 'arxiv:1609.02907', doi: null, title: 'Semi-Supervised Classification with Graph Convolutional Networks', authors: ['Thomas N. Kipf', 'Max Welling'], year: 2017, venue: 'ICLR' },
]
const ENTRIES: Record<string, { key: string; entry: string }> = {
  'arxiv:1710.10903': {
    key: 'velickovic2018',
    entry: '@inproceedings{velickovic2018,\n  author    = {Veli{\\v{c}}kovi{\\\'c}, Petar and Cucurull, Guillem and Casanova, Arantxa and Romero, Adriana and Li{\\`o}, Pietro and Bengio, Yoshua},\n  title     = {Graph Attention Networks},\n  booktitle = {International Conference on Learning Representations},\n  year      = {2018},\n  eprint    = {1710.10903},\n  archivePrefix = {arXiv},\n}\n',
  },
}
route('GET', '/api/projects/:id/references/search', () => ({ hits: LITERATURE, unavailable: [] }))
route('POST', '/api/projects/:id/references/doi', async (req, { id }) => {
  const { id: ref, path } = await req.body()
  const found = ENTRIES[ref]
  if (!found) throw new HttpError(403, DEMO_ONLY)
  const doc = docFor(id, path)
  if (!doc) throw new HttpError(404, 'File not found')
  const text = doc.ytext.toString()
  if (!text.includes(`{${found.key},`)) doc.ytext.insert(text.length, (text.endsWith('\n\n') ? '' : '\n') + found.entry)
  bump(id, 'treeVersion')
  return { path, key: found.key, entry: found.entry }
})
// The project chat, with a few messages from earlier today.
const chat = new Map<string, { id: string; userId: string | null; userName: string; content: string; createdAt: string; editedAt: string | null }[]>([
  [
    DEMO_PROJECT,
    [
      { id: 'demo-c1', userId: 'demo-bob-baker', userName: 'Bob Baker', content: 'I redrew the architecture figure, it is in figures/ now.', createdAt: new Date(Date.now() - 4 * 3_600_000).toISOString(), editedAt: null },
      { id: 'demo-c2', userId: ME.id, userName: ME.name, content: 'Thanks! I will add the update rule to the method today.', createdAt: new Date(Date.now() - 3.6 * 3_600_000).toISOString(), editedAt: null },
    ],
  ],
])
route('GET', '/api/projects/:id/chat', (_req, { id }) => ({ messages: chat.get(id) ?? [], hasMore: false }))
route('POST', '/api/projects/:id/chat', async (req, { id }) => {
  const message = { id: `demo-c${Date.now()}`, userId: ME.id, userName: ME.name, content: String((await req.body()).content), createdAt: new Date().toISOString(), editedAt: null }
  chat.set(id, [...(chat.get(id) ?? []), message])
  bump(id, 'chatVersion')
  return message
})

// ---- Compiling: the builds made in ColTex's compiler image --------------------------------

const CANT_BUILD = "The demo can only build the versions of the paper that its tour makes. Install ColTex to compile your own changes."

async function sha256(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')
}

/** The build of the project as it is now, if the demo has one. */
export const build = (projectId: string) => buildOf(projectId, {})

/** The build of the project with some files replaced (a draft), if the demo has one. */
export async function buildOf(projectId: string, replaced: Record<string, string>) {
  const p = project(projectId)
  const files: Record<string, string> = {}
  for (const [path, f] of p.files) if (f.text !== undefined) files[path] = replaced[path] ?? textOf(projectId, path)!
  const state = projectId === DEMO_PROJECT ? stateIndex[await sha256(stateText(files))] : undefined
  if (!state) return { buildId: 'demo-none', status: 'error', outputFiles: [], diagnostics: [], durationMs: 400, message: CANT_BUILD }
  const r = results[`../compiled/${state}/result.json`]!
  return { buildId: `demo-${state}`, status: r.status, outputFiles: r.outputFiles, diagnostics: r.diagnostics, durationMs: r.durationMs }
}

route('POST', '/api/projects/:id/compile', async (_req, { id }) => {
  // About as long as a small build takes.
  await sleep(900)
  return build(id)
})
route('GET', '/api/projects/:id/builds/:build/:name', async (_req, { build: buildId, name }) => {
  const state = buildId.replace(/^demo-/, '')
  if (name === 'output.pdf') {
    const url = pdfs[`../compiled/${state}/output.pdf`]
    if (!url) throw new HttpError(404, 'Not found')
    return new Response(await (await realFetch(url)).blob(), { headers: { 'content-type': 'application/pdf' } })
  }
  throw new HttpError(404, 'Not found')
})
route('GET', '/api/projects/:id/builds/:build/synctex/pdf', () => ({ positions: [] }))
route('GET', '/api/projects/:id/builds/:build/synctex/code', () => ({ position: null }))

// The tour's states, for other modules (the AI agent's draft is the next one).
export const tourFiles = (id: string) => {
  const base: Record<string, string> = {}
  for (const [path, f] of project(DEMO_PROJECT).files) if (f.text !== undefined) base[path] = f.text
  return applyEdits(base, STATES.find(s => s.id === id)!.edits)
}

export { bump }

// Set by install.ts: the browser's own fetch, for the demo's files.
export let realFetch: typeof fetch = fetch.bind(globalThis)
export function setRealFetch(f: typeof fetch) {
  realFetch = f
}

ai.register(route)
review.register(route)
history.register(route)
admin.register(route)
accounts.register(route)
templates.register(route)
