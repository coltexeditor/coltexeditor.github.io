// The AI agent in the demo. No model is called: asked to fix the tour's compile error, the
// agent goes through the steps the real one takes (read the log, read the file, edit, compile
// the draft) and drafts the fix; anything else gets a short answer saying what the demo can do.
// The draft is applied like the real one: into the shared document, then built.
import { DEMO_PROJECT, docFor, textOf } from './store.ts'
import { onOpen, publish } from './streams.ts'
import { HttpError, build, buildOf, type Req } from './http.ts'
import { replaceText } from './text.ts'
import { aiStatus, clampThinking, findModel, preference, STRONG, LOCAL } from './models.ts'

type Route = (method: string, path: string, handler: (req: Req, params: Record<string, string>) => unknown) => void

// What the agent says, in the interface's language where the demo has it (else English).
const lang = () => {
  try {
    const locale = localStorage.getItem('coltex:locale') ?? navigator.language
    return locale === 'zh-TW' || locale === 'zh-Hant' ? 'zhTW' : locale.startsWith('zh') ? 'zh' : 'en'
  } catch {
    return 'en'
  }
}
const SAY = {
  en: {
    found:
      'Line {line} uses `\\textbd`, which LaTeX doesn’t know: it is a typo for `\\textbf`, the bold in the row above. I corrected both cells of the new row, and the draft compiles without errors.',
    other:
      'This is the demo, so I can show one example: when the paper has a compile error, ask me to fix it and I’ll draft the change for you to review. Installed, the AI agent works with your own models on any project.',
    nothing: 'The paper compiles without errors, so there is nothing to fix right now.',
  },
  zh: {
    found: '第 {line} 行的 `\\textbd` 不是 LaTeX 认识的命令，是上一行加粗命令 `\\textbf` 的笔误。我把新加这一行的两个单元格都改正了，草稿编译没有错误。',
    other: '这是演示版，我只能展示一个例子：论文出现编译错误时，让我修复，我会起草修改供你审阅。安装后，AI 智能体会用你自己的模型处理任何项目。',
    nothing: '论文现在编译没有错误，暂时没有需要修复的地方。',
  },
  zhTW: {
    found: '第 {line} 行的 `\\textbd` 不是 LaTeX 認得的指令，是上一行粗體指令 `\\textbf` 的筆誤。我把新加這一行的兩個儲存格都改正了，草稿編譯沒有錯誤。',
    other: '這是示範版，我只能展示一個例子：論文出現編譯錯誤時，請我修正，我會起草修改讓你審閱。安裝後，AI 代理會用你自己的模型處理任何專案。',
    nothing: '論文現在編譯沒有錯誤，暫時沒有需要修正的地方。',
  },
}

type Item = Record<string, unknown> & { id: string; kind: string }
type Session = {
  id: string
  running: boolean
  items: Item[]
  changes: { files: { path: string; kind: 'modified'; base: string; proposed: string }[]; trial: unknown; turn: { base: Record<string, string | null> } | null }
  lastApplied: { snapshot: string; files: string[]; at: string } | null
  model: ReturnType<typeof aiStatus>['model']
  contextTokens: number | null
}
const sessions = new Map<string, Session>()
const fresh = (): Session => ({
  id: `demo-chat-${Date.now().toString(36)}`,
  running: false,
  items: [],
  changes: { files: [], trial: null, turn: null },
  lastApplied: null,
  model: aiStatus().model,
  contextTokens: null,
})
const sessionOf = (projectId: string) => {
  let s = sessions.get(projectId)
  if (!s) sessions.set(projectId, (s = fresh()))
  return s
}
const eventsPath = (projectId: string) => `/api/projects/${projectId}/ai/session/events`
const send = (projectId: string, event: unknown) => publish(eventsPath(projectId), event)
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
let counter = 0
const nextId = (prefix: string) => `${prefix}-${++counter}`

// A new session stream starts with the session as it is, like the server's.
onOpen(path => {
  const m = /^\/api\/projects\/([^/]+)\/ai\/session\/events$/.exec(path)
  return m ? [{ type: 'snapshot', state: sessionOf(m[1]!) }] : undefined
})

/** Plays one turn: steps, then the reply streamed in pieces, then the draft if there is one. */
async function turn(projectId: string, text: string) {
  const s = sessionOf(projectId)
  const say = SAY[lang()]
  const user: Item = { kind: 'user', id: nextId('u'), text, attachments: [] }
  s.items.push(user)
  s.running = true
  send(projectId, { type: 'item', item: user })
  send(projectId, { type: 'running', running: true })

  // The model thinks (only "Working…" shows), then calls a tool, which is done at once.
  const step = async (name: string, label: string, ms: number) => {
    await sleep(ms)
    const item: Item = { kind: 'tool', id: nextId('t'), name, label, status: 'ok' }
    s.items.push(item)
    send(projectId, { type: 'item', item })
  }
  const reply = async (words: string) => {
    const item: Item = { kind: 'assistant', id: nextId('a'), text: '' }
    s.items.push(item)
    send(projectId, { type: 'item', item: { ...item } })
    for (const piece of words.match(/[^\s　-鿿＀-￯]+\s*|[　-鿿＀-￯]{1,3}/g) ?? [words]) {
      item.text += piece
      send(projectId, { type: 'delta', id: item.id, text: piece })
      await sleep(30)
    }
  }

  // The fault the demo's agent knows: \textbd, a typo for \textbf (what the tour types).
  const now = projectId === DEMO_PROJECT ? textOf(projectId, 'main.tex') : undefined
  const typo = now?.indexOf('\\textbd') ?? -1
  const broken = typo >= 0
  const asksToFix = /fix|error|修|错|錯/i.test(text)
  await sleep(400)
  if (broken && asksToFix) {
    await step('read_log', 'Read compile log', 550)
    await step('read_file', 'Read main.tex', 500)
    await step('edit_file', 'Edit main.tex', 550)
    await step('compile', 'Compile with proposed changes', 1000)
    const line = now!.slice(0, typo).split('\n').length
    await reply(say.found.replace('{line}', String(line)))
    const proposed = now!.replaceAll('\\textbd', '\\textbf')
    s.changes = {
      files: [{ path: 'main.tex', kind: 'modified', base: now!, proposed }],
      trial: await trialOf(projectId, proposed),
      turn: { base: { 'main.tex': now! } },
    }
    send(projectId, { type: 'changes', changes: s.changes })
    const lines = now!.split('\n').filter(l => l.includes('\\textbd')).length
    const card: Item = { kind: 'changes', id: nextId('c'), files: [{ path: 'main.tex', kind: 'modified', added: lines, removed: lines }] }
    s.items.push(card)
    send(projectId, { type: 'item', item: card })
    // Auto and Full access: applied when the turn ends, and the build goes to the PDF viewer.
    if (permission !== 'manual') {
      const result = await applyDraft(projectId, s.changes.files.map(f => ({ path: f.path, content: f.proposed })))
      send(projectId, { type: 'built', compile: result.compile })
    }
  } else {
    await reply(asksToFix && !broken ? say.nothing : say.other)
  }
  s.running = false
  s.contextTokens = 6_800 + s.items.length * 420
  send(projectId, { type: 'running', running: false })
  send(projectId, { type: 'snapshot', state: s })
}

let permission = 'manual'
const undoTo = new Map<string, { path: string; content: string }[]>()

/** The draft's test build: the tour's states have one; other text can't be built here. */
async function trialOf(projectId: string, mainTex: string) {
  const r = await buildOf(projectId, { 'main.tex': mainTex })
  return r.status === 'error' ? null : { buildId: r.buildId, status: r.status, errors: 0, warnings: 0 }
}

/** Applies the draft as AiSession.applyDraft does: into the shared documents, then a build. */
async function applyDraft(id: string, files: { path: string; content: string }[]) {
  const s = sessionOf(id)
  const before = await build(id)
  // What Undo goes back to.
  undoTo.set(id, files.map(f => ({ path: f.path, content: textOf(id, f.path) ?? '' })))
  for (const f of files) {
    const doc = docFor(id, f.path)
    if (doc) replaceText(doc.ytext, f.content, 'demo-ai')
  }
  // Applying takes a build, as on the server.
  await sleep(900)
  const compile = await build(id)
  s.changes = { files: [], trial: null, turn: null }
  s.lastApplied = { snapshot: 'demo', files: files.map(f => f.path), at: new Date().toISOString() }
  send(id, { type: 'snapshot', state: s })
  const summary = (r: { buildId: string; status: string; diagnostics: unknown[] }) => ({
    buildId: r.buildId,
    status: r.status,
    errors: (r.diagnostics as { level: string }[]).filter(d => d.level === 'error').length,
  })
  return { outcome: 'applied', before: summary(before), after: summary(compile), compile, message: `Applied to ${files.map(f => f.path).join(', ')}` }
}

export function register(route: Route) {
  route('GET', '/api/ai/status', aiStatus)
  // The model, thinking level and auto routing picked in the panel, kept as the server keeps them.
  route('PUT', '/api/ai/preference', async req => {
    const body = await req.body()
    const model = findModel(body.model)
    if (!model) throw new HttpError(400, `Unknown model ${body.model?.provider}/${body.model?.id}`)
    Object.assign(preference, { model: { provider: model.provider, id: model.id }, thinkingLevel: clampThinking(model, body.thinkingLevel ?? preference.thinkingLevel), auto: !!body.auto })
    for (const s of sessions.values()) s.model = aiStatus().model
    return aiStatus()
  })
  route('GET', '/api/ai/allowance', () => null)
  route('GET', '/api/ai/permission', () => ({ permission }))
  route('PUT', '/api/ai/permission', async req => ({ permission: (permission = (await req.body()).permission) }))
  route('GET', '/api/ai/usage', req => usage(Number(req.query.get('days') ?? 30)))

  route('POST', '/api/projects/:id/ai/session/messages', async (req, { id }) => {
    const s = sessionOf(id)
    if (s.running) throw new HttpError(409, 'The AI agent is still working')
    const body = await req.body()
    // The model and thinking level picked in the panel go with each message, as on the server.
    const picked = findModel(body.preference?.model)
    if (picked) Object.assign(preference, { model: { provider: picked.provider, id: picked.id }, thinkingLevel: clampThinking(picked, body.preference.thinkingLevel ?? preference.thinkingLevel), auto: !!body.preference.auto })
    s.model = aiStatus().model
    void turn(id, String(body.text ?? ''))
    return { ok: true }
  })
  route('POST', '/api/projects/:id/ai/session/abort', () => ({ ok: true }))
  route('POST', '/api/projects/:id/ai/session/discard', (_req, { id }) => {
    const s = sessionOf(id)
    s.changes = { files: [], trial: null, turn: null }
    send(id, { type: 'changes', changes: s.changes })
    return { ok: true }
  })
  route('POST', '/api/projects/:id/ai/session/reset', (_req, { id }) => {
    const s = fresh()
    sessions.set(id, s)
    return s
  })
  route('GET', '/api/projects/:id/ai/conversations', (_req, { id }) => {
    const s = sessionOf(id)
    const first = s.items.find(i => i.kind === 'user')
    return first
      ? [{ id: s.id, title: String(first.text).slice(0, 60), updatedAt: new Date().toISOString(), messages: s.items.filter(i => i.kind === 'user').length, current: true }]
      : []
  })
  route('POST', '/api/projects/:id/ai/session/apply', async (req, { id }) => {
    const { files } = (await req.body()) as { files: { path: string; content: string }[] }
    return applyDraft(id, files)
  })
  route('POST', '/api/projects/:id/ai/session/undo', async (_req, { id }) => {
    const s = sessionOf(id)
    for (const f of undoTo.get(id) ?? []) {
      const doc = docFor(id, f.path)
      if (doc) replaceText(doc.ytext, f.content, 'demo-ai')
    }
    undoTo.delete(id)
    s.lastApplied = null
    send(id, { type: 'snapshot', state: s })
    return { message: 'Undone', compile: await build(id) }
  })
}

// Settings → AI agent: a month of made-up use.
function usage(days: number) {
  const byDay = Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86_400_000)
    const requests = Math.max(0, Math.round(9 + 6 * Math.sin(i / 2.3) + (d.getDay() === 0 || d.getDay() === 6 ? -7 : 2)))
    return { date: d.toISOString().slice(0, 10), requests, tokens: requests * 5200, cost: +(requests * 0.021).toFixed(3) }
  })
  const requests = byDay.reduce((n, d) => n + d.requests, 0)
  const tokens = byDay.reduce((n, d) => n + d.tokens, 0)
  const cost = +byDay.reduce((n, d) => n + d.cost, 0).toFixed(2)
  const part = (share: number, out: number, money: number) => ({
    requests: Math.round(requests * share),
    inputTokens: Math.round(tokens * share * (1 - out)),
    outputTokens: Math.round(tokens * share * out),
    cost: +(cost * money).toFixed(2),
  })
  return {
    days,
    totals: { requests, inputTokens: Math.round(tokens * 0.82), outputTokens: Math.round(tokens * 0.18), cost },
    byDay,
    byModel: [
      { provider: STRONG.provider, model: STRONG.id, ...part(0.75, 0.18, 1) },
      { provider: LOCAL.provider, model: LOCAL.id, ...part(0.25, 0.2, 0) },
    ],
  }
}
