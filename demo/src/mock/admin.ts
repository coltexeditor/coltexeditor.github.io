// Settings and Administration in the demo: a small research group's server, made up but
// consistent (the people listed are the ones counted, usage adds up per day, person and
// model). Monitoring figures are worked out from the clock, so they move while the page
// polls and agree between ranges. What needs a real server (backups, sign-ins, passwords)
// is refused with the demo's message.
import { BOB, CAROL, DEMO_PROJECT, ME, projects } from './store.ts'
import { onOpen } from './streams.ts'
import { DEMO_ONLY, HttpError, type Req } from './http.ts'
import { CONNECTED, CUSTOM_PROVIDERS, LOCAL, MODELS, PROVIDERS, STRONG, web, type ModelInfo } from './models.ts'
import { sleep } from './time.ts'

type Route = (method: string, path: string, handler: (req: Req, params: Record<string, string>) => unknown) => void

const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000
const GiB = 1024 ** 3
const MiB = 1024 ** 2
const loaded = Date.now()
const iso = (t: number) => new Date(t).toISOString()
const ago = (ms: number) => iso(Date.now() - ms)
const browserZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

/** A repeatable number in [0, 1) for `n` (the same minute or day always gets the same one). */
const noise = (n: number, salt = 0) => {
  const x = Math.sin(n * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}
const round1 = (x: number) => Math.round(x * 10) / 10

// ---- Models -----------------------------------------------------------------------------
// ColTex's providers (models.ts): DeepSeek and OpenRouter connected, the lab's GPU server as a
// self-hosted endpoint; the rest offered under Connect.

const LIGHT = LOCAL
type CustomProvider = (typeof CUSTOM_PROVIDERS)[number]
const settings: {
  auto: { judge: { provider: string; id: string } | null; light: { provider: string; id: string } | null; strong: { provider: string; id: string } | null }
  customProviders: CustomProvider[]
  web: typeof web
} = {
  auto: {
    judge: { provider: LIGHT.provider, id: LIGHT.id },
    light: { provider: LIGHT.provider, id: LIGHT.id },
    strong: { provider: STRONG.provider, id: STRONG.id },
  },
  customProviders: [...CUSTOM_PROVIDERS],
  web,
}

const healthy = { state: 'healthy', failures: 0, lastError: null, lastErrorAt: null }
function providers() {
  return [
    ...PROVIDERS.map(p => ({
      id: p.id,
      name: p.name,
      custom: false,
      apiKey: p.apiKey,
      oauth: p.oauth,
      configured: CONNECTED.includes(p.id) ? { type: 'api_key', source: 'stored credential' } : null,
      stored: CONNECTED.includes(p.id),
      modelCount: p.id === 'openrouter' ? p.models.length : p.modelCount,
      health: healthy,
    })),
    // Listed under "Self-hosted endpoints" only: it needs no key, so nothing is configured here.
    ...settings.customProviders.map(p => ({
      id: p.id,
      name: p.name,
      custom: true,
      apiKey: 'API key',
      oauth: null,
      configured: null,
      stored: false,
      modelCount: p.models.length,
      health: healthy,
    })),
  ]
}

const models = (): ModelInfo[] => MODELS

// ---- People -----------------------------------------------------------------------------

type Role = 'admin' | 'manager' | 'user'
type Policy = { mode: 'all' | 'selected' | 'none'; providers: string[]; models: { provider: string; id: string }[] }
type Limits = { period: 'day' | 'week' | 'month'; tokens: number | null; cost: number | null }
type Account = {
  person: { id: string; name: string; email: string }
  role: Role
  banned: boolean
  createdAt: string
  /** The admin whose team they're in (counts only while they are a member and the leader an admin). */
  team: string | null
  groupId: string | null
  custom: { policy: Policy | null; limits: Limits | null }
  /** Made-up AI use: requests on a busy weekday, and the share that goes to the strong model. */
  use: { perDay: number; strong: number; since?: number; until?: number }
}

const fictional = (first: string, last: string) => ({ id: `demo-${first}-${last}`.toLowerCase(), name: `${first} ${last}`, email: `${first.toLowerCase()}@lab.example` })
const noCustom = () => ({ policy: null, limits: null })
export const accounts: Account[] = [
  { person: ME, role: 'admin', banned: false, createdAt: ago(60 * DAY), team: null, groupId: null, custom: noCustom(), use: { perDay: 9, strong: 0.75 } },
  { person: BOB, role: 'manager', banned: false, createdAt: ago(58 * DAY), team: null, groupId: 'grp-lab', custom: noCustom(), use: { perDay: 7, strong: 0.8 } },
  { person: CAROL, role: 'user', banned: false, createdAt: ago(55 * DAY), team: null, groupId: 'grp-lab', custom: noCustom(), use: { perDay: 4, strong: 0.6 } },
  { person: fictional('Dan', 'Dawson'), role: 'user', banned: false, createdAt: ago(41 * DAY), team: BOB.id, groupId: 'grp-students', custom: noCustom(), use: { perDay: 6, strong: 0 } },
  { person: fictional('Frank', 'Fischer'), role: 'user', banned: true, createdAt: ago(49 * DAY), team: null, groupId: null, custom: noCustom(), use: { perDay: 3, strong: 0.5, until: 26 } },
  { person: fictional('Eve', 'Evans'), role: 'user', banned: false, createdAt: ago(21 * DAY), team: BOB.id, groupId: 'grp-students', custom: noCustom(), use: { perDay: 5, strong: 0 } },
  {
    person: fictional('Grace', 'Green'),
    role: 'user',
    banned: false,
    createdAt: ago(9 * DAY),
    team: BOB.id,
    groupId: 'grp-students',
    // Writing up her thesis: a larger daily allowance than the group's.
    custom: { policy: null, limits: { period: 'day', tokens: 500_000, cost: null } },
    use: { perDay: 4, strong: 0 },
  },
]
const account = (id: string) => {
  const a = accounts.find(x => x.person.id === id)
  if (!a) throw new HttpError(404, 'User not found')
  return a
}
const teamOf = (a: Account) => (a.role === 'user' && a.team && accounts.find(x => x.person.id === a.team)?.role === 'manager' ? a.team : null)
const managed = (a: Account) => ({
  id: a.person.id,
  name: a.person.name,
  email: a.person.email,
  role: a.role,
  banned: a.banned,
  createdAt: a.createdAt,
  managerId: teamOf(a),
  locked: false,
  twoFactor: a.person.id === ME.id || a.role === 'manager',
})
/** The system admin manages anyone but themselves. */
function target(id: string) {
  if (id === ME.id) throw new HttpError(403, 'Change your own account in Settings → Account')
  return account(id)
}

// ---- Invitations --------------------------------------------------------------------------

const fakeToken = () => `demo_${Array.from(crypto.getRandomValues(new Uint8Array(18)), b => b.toString(16).padStart(2, '0')).join('')}`
type InviteRow = { id: string; email: string | null; role: Role; createdAt: string; expiresAt: string; usedAt: string | null; usedByEmail: string | null; aiGroupId: string | null; token: string | null }
const invites: InviteRow[] = [
  { id: 'inv-hana', email: 'hana@lab.example', role: 'user', createdAt: ago(2 * DAY), expiresAt: ago(-5 * DAY), usedAt: null, usedByEmail: null, aiGroupId: 'grp-students', token: fakeToken() },
  { id: 'inv-visitor', email: null, role: 'user', createdAt: ago(5 * HOUR), expiresAt: ago(-7 * DAY + 5 * HOUR), usedAt: null, usedByEmail: null, aiGroupId: 'grp-lab', token: fakeToken() },
  { id: 'inv-grace', email: 'grace@lab.example', role: 'user', createdAt: ago(10 * DAY), expiresAt: ago(3 * DAY), usedAt: ago(9 * DAY), usedByEmail: 'grace@lab.example', aiGroupId: 'grp-students', token: null },
]

// ---- AI groups and usage ----------------------------------------------------------------

type Group = { id: string; name: string; policy: Policy; limits: Limits }
const groups: Group[] = [
  { id: 'grp-lab', name: 'Lab members', policy: { mode: 'all', providers: [], models: [] }, limits: { period: 'month', tokens: null, cost: 3 } },
  {
    id: 'grp-students',
    name: 'Students',
    policy: { mode: 'selected', providers: [], models: [{ provider: LIGHT.provider, id: LIGHT.id }] },
    limits: { period: 'day', tokens: 200_000, cost: null },
  },
]
const groupOut = (g: Group) => ({ ...g, members: accounts.filter(a => a.groupId === g.id).length })

// Tokens per request and prices (US dollars per token) of the two models people use.
const TOKENS = { strong: 6200, light: 3800 }
const OUTPUT_SHARE = 0.17
const PRICE = { input: 0.28e-6, output: 1.1e-6 }
const dayNumber = (t: number) => Math.floor(t / DAY)

/** Requests someone made on one (UTC) day, split between the strong and the light model. */
function requestsOn(a: Account, day: number, seed: number) {
  const start = dayNumber(Date.parse(a.createdAt))
  const today = dayNumber(Date.now())
  if (day < start || (a.use.until !== undefined && day > today - a.use.until)) return { strong: 0, light: 0 }
  const weekday = new Date(day * DAY).getUTCDay()
  const week = weekday === 0 ? 0.25 : weekday === 6 ? 0.35 : 1
  // Today is not over yet.
  const part = day === today ? Math.min(1, (Date.now() - day * DAY) / (18 * HOUR)) : 1
  const total = Math.max(0, Math.round(a.use.perDay * week * part * (0.55 + 0.9 * noise(day, seed))))
  const strong = Math.round(total * a.use.strong)
  return { strong, light: total - strong }
}

function usage(days: number, userId?: string | null) {
  const people = userId ? accounts.filter(a => a.person.id === userId) : accounts
  const today = dayNumber(Date.now())
  const byModel = { strong: { requests: 0, tokens: 0 }, light: { requests: 0, tokens: 0 } }
  const byDay = Array.from({ length: days }, (_, i) => {
    const day = today - (days - 1 - i)
    let requests = 0
    let tokens = 0
    let cost = 0
    for (const a of people) {
      const r = requestsOn(a, day, accounts.indexOf(a) + 1)
      const strongTokens = r.strong * TOKENS.strong
      const lightTokens = r.light * TOKENS.light
      requests += r.strong + r.light
      tokens += strongTokens + lightTokens
      cost += strongTokens * ((1 - OUTPUT_SHARE) * PRICE.input + OUTPUT_SHARE * PRICE.output)
      byModel.strong.requests += r.strong
      byModel.strong.tokens += strongTokens
      byModel.light.requests += r.light
      byModel.light.tokens += lightTokens
    }
    return { date: iso(day * DAY).slice(0, 10), requests, tokens, cost: +cost.toFixed(4) }
  })
  const split = (tokens: number) => ({ inputTokens: Math.round(tokens * (1 - OUTPUT_SHARE)), outputTokens: tokens - Math.round(tokens * (1 - OUTPUT_SHARE)) })
  const strongCost = +(byModel.strong.tokens * ((1 - OUTPUT_SHARE) * PRICE.input + OUTPUT_SHARE * PRICE.output)).toFixed(4)
  const models = [
    { provider: STRONG.provider, model: STRONG.id, requests: byModel.strong.requests, ...split(byModel.strong.tokens), cost: strongCost },
    { provider: LIGHT.provider, model: LIGHT.id, requests: byModel.light.requests, ...split(byModel.light.tokens), cost: 0 },
  ].filter(m => m.requests > 0)
  const totalTokens = byModel.strong.tokens + byModel.light.tokens
  return {
    days,
    totals: { requests: byModel.strong.requests + byModel.light.requests, ...split(totalTokens), cost: strongCost },
    byDay,
    byModel: models,
  }
}

function lastUsed(a: Account): string | null {
  const today = dayNumber(Date.now())
  for (let day = today; day > today - 120; day--) {
    const r = requestsOn(a, day, accounts.indexOf(a) + 1)
    if (r.strong + r.light === 0) continue
    if (day === today) return ago((10 + 170 * noise(day, accounts.indexOf(a) + 40)) * MINUTE)
    return iso(day * DAY + (13 + 5 * noise(day, 7)) * HOUR)
  }
  return null
}

function userRows(days: number) {
  return accounts.map(a => {
    const { totals } = usage(days, a.person.id)
    return {
      userId: a.person.id,
      name: a.person.name,
      email: a.person.email,
      role: a.role,
      banned: a.banned,
      lastUsedAt: lastUsed(a),
      groupId: a.groupId,
      custom: a.custom,
      ...totals,
    }
  })
}

// ---- Monitoring ---------------------------------------------------------------------------

// The server was last restarted for an update two days ago, and once before that.
const STARTED = loaded - (2 * DAY + 5 * HOUR + 17 * MINUTE)
const RESTARTS = [loaded - (19 * DAY + 3 * HOUR + 41 * MINUTE), STARTED]
const MEM_TOTAL = 16 * GiB
const COMPILER_LIMIT = 4 * GiB

/** How busy the group is at a moment: mornings, afternoons, a few evenings; quiet weekends. */
function activity(t: number) {
  const d = new Date(t)
  const h = d.getHours() + d.getMinutes() / 60
  const g = (mu: number, s: number) => Math.exp(-((h - mu) ** 2) / (2 * s * s))
  const weekend = d.getDay() === 0 || d.getDay() === 6
  return (0.06 + 0.9 * g(10.8, 1.8) + 0.85 * g(15.2, 2.2) + 0.35 * g(21.3, 1.4)) * (weekend ? 0.3 : 1)
}

type Sample = { down: boolean; builds: number; failed: number; durationMs: number; serverCpu: number; serverMem: number; compilerCpu: number; compilerMem: number }
function minute(m: number): Sample {
  const t = m * MINUTE
  const a = activity(t)
  const builds = Math.floor(a * 0.2 + noise(m, 1))
  const failed = builds ? Math.min(builds, Math.floor(0.12 + noise(m, 2))) : 0
  return {
    down: RESTARTS.some(r => t >= r - 3 * MINUTE && t < r),
    builds,
    failed,
    durationMs: 1600 + 2800 * noise(m, 7),
    serverCpu: 0.8 + 5.5 * a + 1.2 * noise(m, 3) + builds * 3.5,
    serverMem: 300 * MiB + 90 * MiB * a + 25 * MiB * noise(m, 4),
    compilerCpu: builds ? 6 + 10 * noise(m, 5) + 5 * builds : 0.2 + 0.5 * noise(m, 5),
    compilerMem: 150 * MiB + (builds ? 380 * MiB + 650 * MiB * noise(m, 6) : 40 * MiB * noise(m, 6)),
  }
}

const RANGES: Record<string, { ms: number; bucketSeconds: number }> = {
  '1h': { ms: HOUR, bucketSeconds: 60 },
  '6h': { ms: 6 * HOUR, bucketSeconds: 300 },
  '24h': { ms: DAY, bucketSeconds: 900 },
  '7d': { ms: 7 * DAY, bucketSeconds: 3600 },
  '30d': { ms: 30 * DAY, bucketSeconds: 4 * 3600 },
}

function history(range: string) {
  const r = RANGES[range] ?? RANGES['1h']!
  const name = RANGES[range] ? range : '1h'
  const now = Date.now()
  const step = r.bucketSeconds * 1000
  const end = Math.floor(now / step) * step
  const start = end - r.ms + step
  const nowMinute = Math.floor(now / MINUTE)
  const points = []
  for (let at = start; at <= end; at += step) {
    let n = 0
    let serverCpu = 0
    let compilerCpu = 0
    let serverMem = 0
    let compilerMem = 0
    let builds = 0
    let failed = 0
    for (let m = at / MINUTE; m < (at + step) / MINUTE && m <= nowMinute; m++) {
      const s = minute(m)
      if (s.down) continue
      n++
      serverCpu += s.serverCpu
      compilerCpu += s.compilerCpu
      serverMem = Math.max(serverMem, s.serverMem)
      compilerMem = Math.max(compilerMem, s.compilerMem)
      builds += s.builds
      failed += s.failed
    }
    points.push({
      at: iso(at),
      serverCpu: n ? round1(serverCpu / n) : null,
      serverMem: n ? Math.round(serverMem) : null,
      serverMemPct: n ? round1((serverMem / MEM_TOTAL) * 100) : null,
      compilerCpu: n ? round1(compilerCpu / n) : null,
      compilerMem: n ? Math.round(compilerMem) : null,
      compilerMemPct: n ? round1((compilerMem / COMPILER_LIMIT) * 100) : null,
      builds,
      failedBuilds: failed,
    })
  }
  return { range: name, bucketSeconds: r.bucketSeconds, points, restarts: RESTARTS.filter(t => t > start).map(iso) }
}

function stats() {
  const now = Date.now()
  const m = Math.floor(now / MINUTE)
  // The overview polls every 5 s: each poll gets a slightly different reading.
  const tick = Math.floor(now / 5000)
  const jitter = (salt: number, spread: number) => 1 - spread + 2 * spread * noise(tick, salt)
  const current = minute(m)
  const a = activity(now)

  let total = 0
  let failed = 0
  let duration = 0
  for (let k = m - 1440; k <= m; k++) {
    const s = minute(k)
    if (s.down) continue
    total += s.builds
    failed += s.failed
    duration += s.builds * s.durationMs
  }

  const serverMem = Math.round(current.serverMem * jitter(1, 0.02))
  const compilerMem = Math.round(current.compilerMem * jitter(2, 0.05))
  const active = noise(tick, 3) < 0.15 + 0.4 * a ? 1 : 0
  const used = 4.1 * GiB + 1.3 * GiB * a + 0.2 * GiB * noise(tick, 4) + compilerMem
  const load = 0.25 + 2.4 * a * jitter(5, 0.15) + active * 0.9
  const day = 30 * DAY

  return {
    users: {
      total: accounts.length,
      admins: accounts.filter(x => x.role === 'admin').length,
      suspended: accounts.filter(x => x.banned).length,
      newLast30d: accounts.filter(x => now - Date.parse(x.createdAt) < day).length,
    },
    // Everyone's projects, so more than Alice's own list.
    projects: { total: 14, activeLast7d: 6, storageBytes: 1_284_311_552 + Math.round((now - loaded) / 40), files: 1237 },
    services: [
      { id: 'api', status: 'ok', latencyMs: null },
      { id: 'database', status: 'ok', latencyMs: 1 + Math.round(noise(tick, 6)) },
      { id: 'valkey', status: 'ok', latencyMs: 1 },
      { id: 'compiler', status: 'ok', latencyMs: null },
    ],
    compiler: { workers: 1, slots: 4, waiting: 0, active, failed: 3 },
    compiles: { total, failed, avgMs: total ? Math.round(duration / total) : null },
    host: {
      cpus: 8,
      loadAvg: [round1(load * 100) / 100, round1((0.3 + 2.1 * a) * 100) / 100, round1((0.35 + 1.8 * a) * 100) / 100],
      memTotal: MEM_TOTAL,
      memAvailable: Math.round(MEM_TOTAL - used),
      platform: 'Linux x64',
      docker: true,
    },
    containers: [
      { id: 'server', name: '3f9c2e1b7d40', used: serverMem, limit: null },
      { id: 'compiler', name: 'coltex-compiler-1', used: compilerMem, limit: COMPILER_LIMIT },
    ],
    process: { rss: serverMem, heapUsed: Math.round(96 * MiB * jitter(7, 0.08)), heapTotal: 128 * MiB },
    live: {
      serverCpu: round1(current.serverCpu * jitter(8, 0.25)),
      serverMem,
      serverMemLimit: MEM_TOTAL,
      compilerCpu: round1((active ? 38 + 30 * noise(tick, 9) : current.compilerCpu) * jitter(10, 0.2)),
      compilerMem,
      compilerMemLimit: COMPILER_LIMIT,
    },
    disk: { total: 1_000_204_886_016, free: 712_418_304_000 - Math.round((now - loaded) / 40) },
    server: { version: '0.0.4', uptimeSeconds: Math.round((now - STARTED) / 1000), startedAt: iso(STARTED) },
  }
}

// ---- Backups ----------------------------------------------------------------------------

const backup = {
  url: 'https://dav.example.org/coltex/',
  username: 'coltex-backup',
  hasPassword: true,
  encrypted: true,
  schedule: 'daily' as 'off' | 'daily' | 'weekly',
  hour: 3,
  weekday: 0,
  timeZone: browserZone(),
  keep: 14,
}
/** The scheduled time on a day `daysAgo` before today, in the browser's time zone. */
const at = (daysAgo: number, hour: number, minutes = 0) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, minutes, 0, 0)
  return d.getTime()
}
const stamp = (t: number) => iso(t).replace(/[-:]/g, '').replace('T', '-').slice(0, 15)
const runs = (() => {
  const list = []
  for (let k = 1; k <= 8; k++) {
    const started = at(k, 3, 0)
    const failed = k === 5
    const seconds = 70 + Math.round(40 * noise(k, 11))
    list.push({
      trigger: 'schedule',
      status: failed ? 'failed' : 'success',
      startedAt: iso(started),
      finishedAt: iso(started + (failed ? 21 : seconds) * 1000),
      file: failed ? null : `coltex-backup-${stamp(started)}.zip.enc`,
      bytes: failed ? null : 412_000_000 - k * 2_600_000 + Math.round(900_000 * noise(k, 12)),
      projects: failed ? null : 14 - (k > 6 ? 1 : 0),
      error: failed ? '507 Insufficient Storage' : null,
    })
    // After the failed night, someone ran one by hand once space was freed.
    if (k === 5) {
      const manual = at(4, 9, 12)
      list.push({
        trigger: 'manual',
        status: 'success',
        startedAt: iso(manual),
        finishedAt: iso(manual + 94_000),
        file: `coltex-backup-${stamp(manual)}.zip.enc`,
        bytes: 401_330_112,
        projects: 14,
        error: null,
      })
    }
  }
  // Newest first, numbered in the order they ran.
  list.sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))
  return list.map((r, i) => ({ id: 48 - i, ...r }))
})()
function nextRun() {
  if (backup.schedule === 'off' || !backup.url) return null
  const d = new Date()
  d.setHours(backup.hour, 0, 0, 0)
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1)
  if (backup.schedule === 'weekly') while (d.getDay() !== backup.weekday) d.setDate(d.getDate() + 1)
  return d.toISOString()
}

// ---- Tokens and Zotero --------------------------------------------------------------------

type Token = { id: string; name: string; uses: ('git' | 'mcp')[]; readOnly: boolean; projects: { id: string; name: string }[] | null; expiresAt: string | null; createdAt: string; lastUsedAt: string | null }
const tokens: Token[] = [
  { id: 'tok-laptop', name: 'MacBook', uses: ['git'], readOnly: false, projects: null, expiresAt: ago(-75 * DAY), createdAt: ago(15 * DAY), lastUsedAt: ago(2 * HOUR + 14 * MINUTE) },
  {
    id: 'tok-cursor',
    name: 'Cursor on the workstation',
    uses: ['mcp'],
    readOnly: true,
    projects: [{ id: DEMO_PROJECT, name: projects.get(DEMO_PROJECT)?.name ?? DEMO_PROJECT }],
    expiresAt: ago(-20 * DAY),
    createdAt: ago(10 * DAY),
    lastUsedAt: ago(DAY + 3 * HOUR),
  },
]

let zotero: { connected: boolean; username?: string } = { connected: true, username: 'alice.anders' }
const LIBRARIES = [
  { id: 'user:9284117', name: 'My Library' },
  { id: 'group:5521043', name: 'Anders Lab' },
]
const COLLECTIONS: Record<string, { key: string; name: string }[]> = {
  'user:9284117': [
    { key: 'Q7MZ2K4D', name: 'Thesis' },
    { key: 'H3VN8T1P', name: 'Thesis / Chapter 2' },
    { key: 'B9XC5R6W', name: 'Thesis / Chapter 3' },
    { key: 'L2FJ7Y0S', name: 'Reading list' },
  ],
  'group:5521043': [
    { key: 'K5PD3M8A', name: 'Protein folding' },
    { key: 'T8WQ1N4E', name: 'Protein folding / Graph networks' },
    { key: 'R4GH6Z2U', name: 'Grant 2027' },
  ],
}

// ---- Skills ---------------------------------------------------------------------------------

type Skill = { id: string; scope: 'personal' | 'builtin'; name: string; description: string; body: string; files: Record<string, string>; updatedAt: string }

const IEEE_CHECKLIST = `# IEEE submission checklist

- Title in title case, no abbreviations unless universally known.
- Abstract: a single paragraph, 150–250 words, no citations, no equations.
- Index Terms follow the abstract, alphabetical, from the IEEE Taxonomy.
- Figures and tables referred to as "Fig. 3" and "Table II" (Roman numerals for tables).
- Equations referred to as "(4)", not "Eq. 4", except at the start of a sentence: "Equation (4)".
- Units in SI with a thin space: \`5~\\si{\\milli\\second}\` or \`5\\,ms\`.
- References numbered in order of first citation; "et al." for more than six authors.
- No \`\\vspace\` hacks to squeeze the page limit.
`

const REBUTTAL_TEMPLATE = `\\documentclass[11pt]{article}
\\usepackage[margin=2.5cm]{geometry}
\\usepackage{xcolor}
\\newcommand{\\reviewer}[1]{\\medskip\\noindent\\textbf{#1}\\par}
\\newcommand{\\comment}[1]{\\noindent\\textit{\\color{gray!70!black}#1}\\par}
\\newcommand{\\response}[1]{\\noindent #1\\par}

\\begin{document}
\\noindent Dear Editor,\\par
\\medskip
We thank the reviewers for their careful reading. Below we answer each comment;
changes in the manuscript are marked in blue.

\\reviewer{Reviewer 1}
\\comment{1.1 \\ldots}
\\response{We agree and have \\ldots (Section 3.2, p.~5).}

\\end{document}
`

const SKILL_CREATOR_EXAMPLES = `# Example skills

## polish-abstract

description: Tighten an abstract to the venue's word limit while keeping the author's claims. Use for "abstract", "摘要", "shorten the summary".

1. Count the words; name the limit you are working to.
2. Cut repetition and hedging first, then background; never cut results.
3. Show the new abstract as a draft edit, with the word count.

## check-figure-refs

description: Find figures and tables that are never referenced, or referenced before they are defined. Use before submitting.
`

const skills: Skill[] = [
  {
    id: 'skill-ieee',
    scope: 'personal',
    name: 'ieee-style-check',
    description: 'Check a paper against IEEE journal style before submission: abstract length, Index Terms, how figures, tables and equations are referred to, units and references. Use when I say "IEEE check", "ready to submit" or "house style".',
    body: `Review the project against IEEE journal style and draft fixes for anything that breaks it.

1. Read the main file and every file it inputs.
2. Go through references/ieee-checklist.md item by item. For each problem, note the file and line.
3. Fix mechanical issues directly in the draft (\`Fig.~\\ref\`, \`Table~\\ref\`, equation references, units).
4. For anything that needs the author's judgement (abstract over the limit, missing Index Terms), list it in your reply instead of rewriting.
5. Compile the draft and say how many warnings are left.

Keep the author's wording; only change what the style requires.`,
    files: { 'references/ieee-checklist.md': IEEE_CHECKLIST },
    updatedAt: ago(6 * DAY),
  },
  {
    id: 'skill-captions',
    scope: 'personal',
    name: 'figure-captions',
    description: 'Write or tighten figure and table captions so each one stands on its own: what is shown, the key takeaway, and what the symbols and colours mean. Use for "captions", "figure text", "图注".',
    body: `For each figure or table the author points to (or all of them, if asked):

- Start with a short noun phrase that says what is shown, ending with a full stop.
- Add one sentence with the main takeaway, in the present tense.
- Explain every symbol, colour, line style and error bar that the reader needs; nothing the axis labels already say.
- Keep captions under 60 words unless the figure has several panels; then describe each panel as (a), (b), ….
- Keep \\label right after \\caption.

Draft the changes; don't touch the figure files themselves.`,
    files: {},
    updatedAt: ago(13 * DAY),
  },
  {
    id: 'skill-rebuttal',
    scope: 'personal',
    name: 'rebuttal-letter',
    description: 'Draft a point-by-point response to reviewers from their comments: polite, specific, pointing to where the paper changed. Use for "rebuttal", "response letter", "answer the reviewers".',
    body: `Draft the response letter as a new file \`response.tex\`, based on references/template.tex.

1. Ask for the reviewers' comments if they aren't in the project or the conversation.
2. Number the comments as Reviewer.Comment (1.1, 1.2, 2.1, …) and quote each one in \\comment{}.
3. Answer each in \\response{}: thank briefly once per reviewer, not per comment; say what changed and where (section and page); when you disagree, give the reason and the evidence.
4. Where the answer needs a change in the paper, draft that change too and mention it.
5. Never promise experiments the author hasn't confirmed.`,
    files: { 'references/template.tex': REBUTTAL_TEMPLATE },
    updatedAt: ago(2 * DAY + 4 * HOUR),
  },
]
const BUILTIN: Skill[] = [
  {
    id: 'builtin:skill-creator',
    scope: 'builtin',
    name: 'skill-creator',
    description:
      "Guide for writing effective skills for ColTex's AI agent. Use when the author wants to create a new skill, improve or rewrite an existing one, or turn a way of working from the conversation into a skill.",
    body: `# Skill Creator

Skills are instructions the AI agent in a ColTex project loads for recurring tasks: a journal's house style, how this author wants an abstract tightened, the checks to run before submitting, how to translate their Chinese drafts into English. A skill turns the general-purpose agent into one that knows the author's own procedures and preferences.

## Core principles

### Concise is key

The context window is shared with the project, the conversation and every other skill's description. Assume the agent already knows LaTeX and academic writing well; only write down what it can't know: the author's preferences, a journal's rules, the order of steps, the mistakes to avoid.

### Match the freedom to the task

- **High freedom** (plain guidance) when several approaches are fine and judgement matters.
- **Low freedom** (exact steps, exact wording, a checklist) when the task is fragile or must be the same every time.

## Process

1. **Understand it with concrete examples.** Ask what the author would say when they want it, what a good result looks like, and what goes wrong today.
2. **Plan the contents.** Rules go into the instructions, long material into reference files.
3. **Write the skill**, then propose it so the author can save it. For examples, read references/examples.md.`,
    files: { 'references/examples.md': SKILL_CREATOR_EXAMPLES },
    updatedAt: iso(STARTED),
  },
]
const allSkills = () => {
  const own = new Set(skills.map(s => s.name))
  return [...skills, ...BUILTIN.filter(b => !own.has(b.name))]
}
const skillOut = (s: Skill) => ({
  id: s.id,
  scope: s.scope,
  name: s.name,
  description: s.description,
  body: s.body,
  files: Object.entries(s.files).map(([path, text]) => ({ path, size: new TextEncoder().encode(text).length })),
  updatedAt: s.updatedAt,
})
const findSkill = (name: string) => {
  const s = allSkills().find(x => x.name === name)
  if (!s) throw new HttpError(404, 'Skill not found')
  return s
}
const SKILL_NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/
function skillBody(body: { name?: unknown; description?: unknown; body?: unknown }) {
  const name = String(body.name ?? '').trim()
  const description = String(body.description ?? '').trim()
  const text = String(body.body ?? '').trim()
  if (!SKILL_NAME.test(name) || name.length > 64) throw new HttpError(400, 'Use lowercase letters, digits and single hyphens')
  if (['compact', 'new', 'chats'].includes(name)) throw new HttpError(400, 'This name is taken by a built-in command')
  if (!description || !text) throw new HttpError(400, 'A skill needs a description and instructions')
  return { name, description, body: text }
}

// The skills chat (Settings → AI skills) starts empty.
const freshChat = () => ({
  id: `demo-skill-chat-${Date.now().toString(36)}`,
  running: false,
  items: [],
  changes: { files: [], trial: null, turn: null },
  lastApplied: null,
  model: STRONG,
  contextTokens: null,
})
let skillChat = freshChat()
onOpen(path => (path === '/api/me/ai/skill-chat/events' ? [{ type: 'snapshot', state: skillChat }] : undefined))

// ---- Network ------------------------------------------------------------------------------

// A server set up as a lab's would be: its own domain, and Tailscale for working from home.
export const SERVER_URL = 'https://tex.lab.example'
export const TAILNET_URL = 'https://coltex.tail4b2e.ts.net'

const network = () => ({
  envUrl: SERVER_URL,
  trustedOrigins: [],
  trustProxy: null,
  clientIp: '192.168.1.42',
  forwarded: false,
  tailscale: { state: 'running', enabled: true, authUrl: null, name: 'coltex.tail4b2e.ts.net', addresses: ['100.101.102.103'], tailnet: 'lab.example', https: true, servingUrl: TAILNET_URL, error: null },
  cloudflare: { state: 'off', enabled: false, mode: null, url: null, urls: [], hasToken: false, tunnelId: null, error: null },
})

// ---- Routes ---------------------------------------------------------------------------------

const refuse = () => {
  throw new HttpError(403, DEMO_ONLY)
}

export function register(route: Route) {
  // Settings → Sync services
  route('GET', '/api/me/git-tokens', () => tokens)
  route('POST', '/api/me/git-tokens', async req => {
    const body = await req.body()
    const name = String(body.name ?? '').trim()
    if (!name) throw new HttpError(400, 'A token needs a name')
    const ids: string[] | null = Array.isArray(body.projectIds) ? body.projectIds : null
    const token: Token = {
      id: `tok-${Date.now().toString(36)}`,
      name,
      uses: Array.isArray(body.uses) && body.uses.length ? [...new Set(body.uses as ('git' | 'mcp')[])] : ['git', 'mcp'],
      readOnly: !!body.readOnly,
      projects: ids ? ids.flatMap(id => (projects.has(id) ? [{ id, name: projects.get(id)!.name }] : [])) : null,
      expiresAt: body.expiresInDays ? ago(-Number(body.expiresInDays) * DAY) : null,
      createdAt: iso(Date.now()),
      lastUsedAt: null,
    }
    tokens.unshift(token)
    // Obviously not a working token: the demo has no Git server or MCP endpoint behind it.
    return { ...token, token: `ctx_demo_${fakeToken().slice(5)}` }
  })
  route('DELETE', '/api/me/git-tokens/:id', (_req, { id }) => {
    const i = tokens.findIndex(t => t.id === id)
    if (i < 0) throw new HttpError(404, 'Token not found')
    tokens.splice(i, 1)
    return undefined
  })
  route('GET', '/api/me/zotero', () => zotero)
  route('PUT', '/api/me/zotero', refuse)
  route('DELETE', '/api/me/zotero', () => {
    zotero = { connected: false }
    return undefined
  })
  route('GET', '/api/me/zotero/libraries', () => {
    if (!zotero.connected) throw new HttpError(400, 'Connect Zotero first')
    return LIBRARIES
  })
  route('GET', '/api/me/zotero/collections', req => COLLECTIONS[req.query.get('library') ?? ''] ?? [])

  // Settings → AI skills
  route('GET', '/api/me/ai/skills', () => allSkills().map(skillOut))
  route('GET', '/api/me/ai/skill-menu', () => allSkills().map(s => ({ name: s.name, description: s.description, scope: s.scope })))
  route('POST', '/api/me/ai/skills/import', refuse)
  route('POST', '/api/me/ai/skills', async req => {
    const body = skillBody(await req.body())
    if (skills.some(s => s.name === body.name)) throw new HttpError(409, `You already have a skill named ${body.name}`)
    const skill: Skill = { id: `skill-${Date.now().toString(36)}`, scope: 'personal', ...body, files: {}, updatedAt: iso(Date.now()) }
    skills.push(skill)
    return skillOut(skill)
  })
  route('PUT', '/api/me/ai/skills/:name', async (req, { name }) => {
    const skill = skills.find(s => s.name === name)
    if (!skill) throw new HttpError(404, 'Skill not found')
    const body = skillBody(await req.body())
    if (body.name !== name && skills.some(s => s.name === body.name)) throw new HttpError(409, `You already have a skill named ${body.name}`)
    Object.assign(skill, body, { updatedAt: iso(Date.now()) })
    return skillOut(skill)
  })
  route('DELETE', '/api/me/ai/skills/:name', (_req, { name }) => {
    const i = skills.findIndex(s => s.name === name)
    if (i < 0) throw new HttpError(404, 'Skill not found')
    skills.splice(i, 1)
    return { ok: true }
  })
  route('GET', '/api/me/ai/skills/:name/files/:path*', (_req, { name, path }) => {
    const text = findSkill(name).files[path]
    if (text === undefined) throw new HttpError(404, 'File not found')
    return new Response(text, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
  })
  route('GET', '/api/me/ai/skills/:name/download', (_req, { name }) => {
    const s = findSkill(name)
    const md = `---\nname: ${s.name}\ndescription: ${s.description}\n---\n\n${s.body}\n`
    return new Response(md, { headers: { 'content-type': 'text/markdown; charset=utf-8', 'content-disposition': `attachment; filename="${s.name}.md"` } })
  })
  route('GET', '/api/me/ai/skill-chat', () => skillChat)
  route('POST', '/api/me/ai/skill-chat/reset', () => (skillChat = freshChat()))
  route('POST', '/api/me/ai/skill-chat/abort', () => ({ ok: true }))
  route('POST', '/api/me/ai/skill-chat/messages', refuse)

  // Administration → Overview
  route('GET', '/api/admin/stats', () => stats())
  route('GET', '/api/admin/stats/history', req => history(req.query.get('range') ?? '1h'))

  // Manage users
  route('GET', '/api/admin/users', () => accounts.map(managed))
  route('PUT', '/api/admin/users/:id/role', async (req, { id }) => {
    const a = target(id)
    const { role } = await req.body()
    if (role !== 'user' && role !== 'manager') throw new HttpError(400, 'Invalid role')
    a.role = role
    return undefined
  })
  route('PUT', '/api/admin/users/:id/team', async (req, { id }) => {
    const a = target(id)
    if (a.role !== 'user') throw new HttpError(400, 'Only members are in a team')
    const { managerId } = await req.body()
    if (managerId && accounts.find(x => x.person.id === managerId)?.role !== 'manager') throw new HttpError(400, 'A team is led by an admin')
    a.team = managerId ?? null
    return undefined
  })
  route('PUT', '/api/admin/users/:id/suspended', async (req, { id }) => {
    target(id).banned = !!(await req.body()).suspended
    return undefined
  })
  route('POST', '/api/admin/users/:id/password', refuse)
  route('DELETE', '/api/admin/users/:id', refuse)

  // Invitations
  route('GET', '/api/admin/invites', () => invites)
  route('POST', '/api/admin/invites', async req => {
    const body = await req.body()
    const token = fakeToken()
    const now = Date.now()
    const invite: InviteRow = {
      id: `inv-${now.toString(36)}`,
      email: typeof body.email === 'string' && body.email ? body.email.toLowerCase() : null,
      role: body.role === 'manager' ? 'manager' : 'user',
      createdAt: iso(now),
      expiresAt: iso(now + (Number(body.expiresInDays) || 7) * DAY),
      usedAt: null,
      usedByEmail: null,
      aiGroupId: body.aiGroupId ?? null,
      token,
    }
    invites.unshift(invite)
    return { invite, token }
  })
  route('DELETE', '/api/admin/invites/:id', (_req, { id }) => {
    const i = invites.findIndex(x => x.id === id && !x.usedAt)
    if (i < 0) throw new HttpError(404, 'Invite not found or already used')
    invites.splice(i, 1)
    return undefined
  })

  // AI services
  // DeepSeek's search runs on the connected DeepSeek provider's key; Tavily has its own.
  route('GET', '/api/admin/ai', () => ({ settings, providers: providers(), web: { keys: ['tavily'], deepseekConnected: true, native: [] } }))
  route('GET', '/api/admin/ai/models', () => models())
  route('PUT', '/api/admin/ai/settings', async req => {
    const patch = await req.body()
    if (patch.auto) settings.auto = { judge: patch.auto.judge ?? null, light: patch.auto.light ?? null, strong: patch.auto.strong ?? null }
    if (Array.isArray(patch.customProviders)) settings.customProviders = patch.customProviders
    if (patch.web) Object.assign(web, patch.web)
    return settings
  })
  route('POST', '/api/admin/ai/test', async () => {
    const ms = 650 + Math.round(700 * Math.random())
    await sleep(ms)
    return { ok: true, message: 'OK', ms }
  })
  route('PUT', '/api/admin/ai/web/keys/:service', refuse)
  route('DELETE', '/api/admin/ai/web/keys/:service', refuse)
  route('POST', '/api/admin/ai/web/test', async () => {
    const ms = 900 + Math.round(900 * Math.random())
    await sleep(ms)
    return { ok: true, message: 'OK', results: 5, ms }
  })
  route('POST', '/api/admin/ai/providers/:provider/login', refuse)
  route('DELETE', '/api/admin/ai/providers/:provider/credential', refuse)

  // AI usage & access
  const days = (req: Req) => Math.min(366, Math.max(1, Number(req.query.get('days')) || 30))
  route('GET', '/api/admin/ai/usage', req => usage(days(req), req.query.get('userId')))
  route('GET', '/api/admin/ai/users', req => userRows(days(req)))
  route('GET', '/api/admin/ai/groups', () => groups.map(groupOut))
  route('POST', '/api/admin/ai/groups', async req => {
    const body = await req.body()
    const group: Group = { id: `grp-${Date.now().toString(36)}`, name: String(body.name ?? '').trim() || 'New group', policy: body.policy, limits: body.limits ?? { period: 'month', tokens: null, cost: null } }
    groups.push(group)
    return groupOut(group)
  })
  route('PUT', '/api/admin/ai/groups/:id', async (req, { id }) => {
    const group = groups.find(g => g.id === id)
    if (!group) throw new HttpError(404, 'Group not found')
    const body = await req.body()
    Object.assign(group, { name: String(body.name ?? group.name).trim(), policy: body.policy ?? group.policy, limits: body.limits ?? group.limits })
    return groupOut(group)
  })
  route('DELETE', '/api/admin/ai/groups/:id', (_req, { id }) => {
    const i = groups.findIndex(g => g.id === id)
    if (i < 0) throw new HttpError(404, 'Group not found')
    groups.splice(i, 1)
    for (const a of accounts) if (a.groupId === id) a.groupId = null
    return undefined
  })
  route('PUT', '/api/admin/ai/users/:id/group', async (req, { id }) => {
    const { groupId } = await req.body()
    if (groupId && !groups.some(g => g.id === groupId)) throw new HttpError(404, 'Group not found')
    account(id).groupId = groupId ?? null
    return { ok: true }
  })
  route('PUT', '/api/admin/ai/users/:id/custom', async (req, { id }) => {
    const { policy, limits } = await req.body()
    account(id).custom = { policy: policy ?? null, limits: limits ?? null }
    return { ok: true }
  })

  // Storage & backups
  route('GET', '/api/admin/backup', () => ({ config: backup, runs, nextRun: nextRun(), storage: { driver: 'local', location: '/data/projects' } }))
  route('PUT', '/api/admin/backup', async req => {
    const patch = await req.body()
    for (const key of ['url', 'username', 'schedule', 'hour', 'weekday', 'timeZone', 'keep'] as const) {
      if (patch[key] !== undefined) (backup as Record<string, unknown>)[key] = patch[key]
    }
    if (patch.password !== undefined) backup.hasPassword = patch.password !== null
    if (patch.encryptionPassword !== undefined) backup.encrypted = patch.encryptionPassword !== null
    return backup
  })
  route('POST', '/api/admin/backup/test', async () => {
    await sleep(800)
    return { ok: true }
  })
  route('POST', '/api/admin/backup/run', refuse)

  // Network
  route('GET', '/api/admin/network', network)
  route('PUT', '/api/admin/network/cloudflare', refuse)
  route('PUT', '/api/admin/network/tailscale', refuse)
  route('POST', '/api/admin/network/tailscale/login', refuse)
  route('POST', '/api/admin/network/tailscale/logout', refuse)
  route('PUT', '/api/admin/network/tailscale/serve', refuse)
}
