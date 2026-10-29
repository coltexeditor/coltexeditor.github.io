// Sign-ins (Settings → Account, and Sign-ins for the system administrator) and groups
// (Settings → Groups, sharing a project with a group), made up for the lab's accounts.
import { ME, BOB, CAROL } from './store.ts'
import { DEMO_ONLY, HttpError, type Req } from './http.ts'
import { accounts } from './admin.ts'

type Route = (method: string, path: string, handler: (req: Req, params: Record<string, string>) => unknown) => void

const HOUR = 3_600_000
const DAY = 24 * HOUR
const iso = (t: number) => new Date(t).toISOString()
const refuse = () => {
  throw new HttpError(403, DEMO_ONLY)
}

// ---- Sign-ins ---------------------------------------------------------------------------------

const FIREFOX_MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 15.6; rv:140.0) Gecko/20100101 Firefox/140.0'
const SAFARI_IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 19_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.1 Mobile/15E148 Safari/604.1'
const CHROME_WINDOWS = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
const CHROME_LINUX = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'

type Where = { ip: string; place: { kind: 'lan' | 'tailscale' | 'public'; country?: string } }
const LAB: Where = { ip: '192.168.1.23', place: { kind: 'lan' } }
const TAILNET: Where = { ip: '100.101.12.4', place: { kind: 'tailscale' } }
const ABROAD: Where = { ip: '203.0.113.48', place: { kind: 'public', country: 'NL' } }

type Event = {
  id: string
  at: string
  outcome: 'success' | 'failure' | 'two_factor_failure' | 'refused' | 'locked' | 'unlocked' | 'ip_blocked'
  method: 'password' | 'totp' | 'recovery_code' | null
  reason: null
  user: { id: string; name: string } | null
  email: string
  ip: string | null
  place: Where['place']
  device: string | null
}

const events: Event[] = []
const born = Date.now()
function add(hoursAgo: number, who: (typeof accounts)[number]['person'], where: Where, device: string, outcome: Event['outcome'] = 'success', method: Event['method'] = 'password') {
  events.push({
    id: `demo-signin-${events.length}`,
    at: iso(born - hoursAgo * HOUR),
    outcome,
    method: outcome === 'success' ? method : null,
    reason: null,
    user: { id: who.id, name: who.name },
    email: who.email,
    ip: where.ip,
    place: where.place,
    device,
  })
}
// Alice: the lab's Mac most days, her phone over Tailscale now and then, one mistyped password.
for (let d = 0; d < 26; d++) {
  if (d % 7 === 5 || d % 7 === 6) continue
  add(d * 24 + 1.5, ME, LAB, FIREFOX_MAC, 'success')
  if (d % 4 === 1) add(d * 24 + 9, ME, TAILNET, SAFARI_IPHONE, 'success')
}
add(3 * 24 + 1.6, ME, LAB, FIREFOX_MAC, 'failure')
// The others.
for (let d = 0; d < 20; d += 2) add(d * 24 + 3, BOB, LAB, CHROME_LINUX, 'success')
for (let d = 1; d < 20; d += 3) add(d * 24 + 5, CAROL, TAILNET, CHROME_WINDOWS)
add(6 * 24 + 2, CAROL, ABROAD, CHROME_WINDOWS, 'failure')
const dan = accounts.find(a => a.person.name === 'Dan Dawson')?.person
if (dan) for (let d = 0; d < 12; d += 3) add(d * 24 + 6, dan, LAB, CHROME_WINDOWS)
events.sort((a, b) => b.at.localeCompare(a.at))

const PAGE_SIZE = 10
const FAILED = new Set(['failure', 'two_factor_failure', 'refused', 'locked', 'ip_blocked'])
function page(list: Event[], req: Req) {
  const page = Math.max(1, Number(req.query.get('page') ?? 1) || 1)
  return { events: list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), page, pageSize: PAGE_SIZE, total: list.length }
}

// ---- Groups -----------------------------------------------------------------------------------

type Member = { userId: string; role: 'owner' | 'member'; status: 'invited' | 'joined' }
type Group = { id: string; name: string; createdAt: string; invitedBy: string | null; members: Member[] }
const person = (id: string) => accounts.find(a => a.person.id === id)?.person
const groups: Group[] = [
  {
    id: 'demo-group-lab',
    name: 'Structural Biology Lab',
    createdAt: iso(born - 50 * DAY),
    invitedBy: null,
    members: [
      { userId: ME.id, role: 'owner', status: 'joined' },
      { userId: BOB.id, role: 'owner', status: 'joined' },
      { userId: CAROL.id, role: 'member', status: 'joined' },
      ...accounts.filter(a => a.team === BOB.id).map(a => ({ userId: a.person.id, role: 'member' as const, status: 'joined' as const })),
    ],
  },
  {
    id: 'demo-group-reading',
    name: 'Protein ML reading group',
    createdAt: iso(born - 18 * DAY),
    invitedBy: BOB.id,
    members: [
      { userId: BOB.id, role: 'owner', status: 'joined' },
      { userId: ME.id, role: 'member', status: 'joined' },
      { userId: CAROL.id, role: 'member', status: 'invited' },
    ],
  },
]
function groupOut(g: Group) {
  const mine = g.members.find(m => m.userId === ME.id)!
  const inviter = g.invitedBy ? person(g.invitedBy) : null
  return {
    id: g.id,
    name: g.name,
    role: mine.role,
    status: mine.status,
    invitedBy: inviter ? { id: inviter.id, name: inviter.name } : null,
    members: g.members.flatMap(m => {
      const p = person(m.userId)
      return p ? [{ userId: p.id, name: p.name, email: p.email, role: m.role, status: m.status }] : []
    }),
    createdAt: g.createdAt,
  }
}
const group = (id: string) => {
  const g = groups.find(x => x.id === id)
  if (!g) throw new HttpError(404, 'Group not found')
  return g
}
/** Projects shared with a group (none: the demo paper's people were added one by one). */
const projectShares = new Map<string, { groupId: string; role: 'editor' | 'reviewer' | 'viewer' }[]>()

/** The group names a person sees on templates shared with groups. */
export const groupName = (id: string) => groups.find(g => g.id === id)?.name ?? ''

export function register(route: Route) {
  route('GET', '/api/me/sign-ins', req => page(events.filter(e => e.user?.id === ME.id), req))
  route('GET', '/api/admin/sign-ins', req => {
    const user = req.query.get('user')
    const failed = req.query.get('failed') === 'true'
    return page(events.filter(e => (!user || e.user?.id === user) && (!failed || FAILED.has(e.outcome))), req)
  })
  route('GET', '/api/admin/sign-ins/blocks', () => ({ accounts: [], addresses: [] }))
  route('POST', '/api/admin/sign-ins/unblock', refuse)
  route('POST', '/api/admin/users/:id/unlock', refuse)
  route('GET', '/api/admin/users/:id/sessions', (_req, { id }) => {
    const latest = events.filter(e => e.user?.id === id && e.outcome === 'success').slice(0, 2)
    return latest.map((e, i) => ({ id: `demo-session-${id}-${i}`, createdAt: e.at, expiresAt: iso(Date.parse(e.at) + 7 * DAY), ip: e.ip, place: e.place, device: e.device, current: id === ME.id && i === 0 }))
  })
  route('DELETE', '/api/admin/users/:id/sessions', refuse)
  route('DELETE', '/api/admin/users/:id/sessions/:session', refuse)

  route('GET', '/api/me/groups', () => groups.filter(g => g.members.some(m => m.userId === ME.id)).map(groupOut))
  route('POST', '/api/groups', refuse)
  route('PATCH', '/api/groups/:id', async (req, { id }) => {
    const { name } = await req.body()
    if (typeof name === 'string' && name.trim()) group(id).name = name.trim()
    return undefined
  })
  route('DELETE', '/api/groups/:id', refuse)
  route('POST', '/api/groups/:id/invites', refuse)
  route('POST', '/api/groups/:id/accept', (_req, { id }) => {
    const me = group(id).members.find(m => m.userId === ME.id)
    if (me) me.status = 'joined'
    return undefined
  })
  route('DELETE', '/api/groups/:id/members/:user', refuse)
  route('PATCH', '/api/groups/:id/members/:user', refuse)

  route('GET', '/api/projects/:id/groups', (_req, { id }) =>
    (projectShares.get(id) ?? []).map(s => {
      const g = group(s.groupId)
      return { groupId: g.id, name: g.name, role: s.role, members: g.members.filter(m => m.status === 'joined').length }
    }),
  )
  route('PUT', '/api/projects/:id/groups/:group', refuse)
  route('DELETE', '/api/projects/:id/groups/:group', refuse)
}
