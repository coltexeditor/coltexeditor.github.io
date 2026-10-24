// Comments and tracked changes in the demo, kept the way the server keeps them: anchors and
// change records in each document's Yjs maps (through @coltex/review), threads and their
// messages here. The sample paper starts with a comment from Bob Baker.
import { acceptChanges, commentsMap, lineAt, normalizeRelPos, rejectChanges, relPos, resolveReview, undoDecision, type DecisionUndo } from '@coltex/review'
import { bump, DEMO_PROJECT, docById, docFor, ME, BOB, PEOPLE, CAROL } from './store.ts'
import { HttpError, type Req } from './http.ts'

type Route = (method: string, path: string, handler: (req: Req, params: Record<string, string>) => unknown) => void
type Message = { id: string; userId: string; content: string; createdAt: string; editedAt: string | null }
type Thread = { id: string; projectId: string; docId: string; createdBy: string; createdAt: string; resolved: { by: string; at: string } | null; messages: Message[] }

const threads = new Map<string, Thread>()
const trackChanges = new Map<string, { everyone: boolean; users: string[] }>()
const undos = new Map<string, { docId: string; undo: DecisionUndo[] }[]>()
let counter = 0
const id = (prefix: string) => `${prefix}${Date.now().toString(36)}${++counter}`
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()
const nameOf = (userId: string) => PEOPLE.find(p => p.id === userId)?.name ?? 'Deleted user'

/** Bob Baker's comment on the abstract, with Carol's reply, anchored like any other. */
function seed() {
  const doc = docFor(DEMO_PROJECT, 'main.tex')!
  const text = doc.ytext.toString()
  const quote = 'On a standard benchmark'
  const from = text.indexOf(quote)
  const threadId = 'demo-thread-benchmark'
  commentsMap(doc.ydoc).set(threadId, { start: relPos(doc.ytext, from, 0), end: relPos(doc.ytext, from + quote.length, -1) })
  threads.set(threadId, {
    id: threadId,
    projectId: DEMO_PROJECT,
    docId: doc.id,
    createdBy: BOB.id,
    createdAt: minutesAgo(180),
    resolved: null,
    messages: [
      { id: 'demo-m1', userId: BOB.id, content: `Which benchmark? Naming it here (CASP15) would help reviewers. <@${ME.id}>`, createdAt: minutesAgo(180), editedAt: null },
      { id: 'demo-m2', userId: CAROL.id, content: 'Agreed, and the same in the results.', createdAt: minutesAgo(95), editedAt: null },
    ],
  })
}
let seeded = false
const ensure = () => {
  if (!seeded) {
    seeded = true
    seed()
  }
}

function state(projectId: string) {
  ensure()
  const changes: unknown[] = []
  const list = [...threads.values()].filter(t => t.projectId === projectId)
  const docs = new Set(list.map(t => t.docId))
  for (const path of ['main.tex', 'refs.bib']) {
    const d = docFor(projectId, path)
    if (d) docs.add(d.id)
  }
  const resolved = new Map<string, { text: string; review: ReturnType<typeof resolveReview>; path: string }>()
  for (const docId of docs) {
    const d = docById(docId)
    if (!d) continue
    const review = resolveReview(d.ydoc)
    const text = d.ytext.toString()
    resolved.set(docId, { text, review, path: d.path })
    for (const c of review.changes)
      changes.push({
        id: c.id,
        docId,
        path: d.path,
        type: c.type,
        line: lineAt(text, c.type === 'insert' ? c.from + (c.text.match(/^\n*/)?.[0].length ?? 0) : c.from),
        text: c.text,
        userId: c.userId,
        name: nameOf(c.userId),
        at: new Date(c.ts).toISOString(),
      })
  }
  return {
    trackChanges: trackChanges.get(projectId) ?? { everyone: false, users: [] },
    threads: list.map(t => {
      const r = resolved.get(t.docId)
      const anchor = r?.review.comments.find(c => c.id === t.id)
      return {
        id: t.id,
        docId: t.docId,
        path: r?.path ?? '',
        line: anchor && r ? lineAt(r.text, anchor.from) : null,
        quote: anchor && r ? r.text.slice(anchor.from, Math.min(anchor.to, anchor.from + 200)) : '',
        createdBy: t.createdBy,
        createdAt: t.createdAt,
        resolved: t.resolved ? { by: t.resolved.by, name: nameOf(t.resolved.by), at: t.resolved.at } : null,
        messages: t.messages.map(m => ({ ...m, name: nameOf(m.userId) })),
      }
    }),
    changes,
    users: Object.fromEntries(PEOPLE.map(p => [p.id, p.name])),
  }
}

const thread = (threadId: string) => {
  ensure()
  const t = threads.get(threadId)
  if (!t) throw new HttpError(404, 'Thread not found')
  return t
}

/** A reply from someone else in a thread, for the tour (as if they wrote it now). */
export function replyAs(userId: string, threadId: string, content: string) {
  thread(threadId).messages.push({ id: id('m'), userId, content, createdAt: new Date().toISOString(), editedAt: null })
  bump(thread(threadId).projectId, 'reviewVersion')
}

export function register(route: Route) {
  route('GET', '/api/projects/:id/review', (_req, { id: projectId }) => state(projectId))
  route('PUT', '/api/projects/:id/review/track-changes', async (req, { id: projectId }) => {
    trackChanges.set(projectId, await req.body())
    bump(projectId, 'reviewVersion')
    return trackChanges.get(projectId)
  })
  route('POST', '/api/projects/:id/review/threads', async (req, { id: projectId }) => {
    ensure()
    const body = await req.body()
    const d = docById(body.docId)
    if (!d) throw new HttpError(404, 'File not found')
    const threadId = id('t')
    commentsMap(d.ydoc).set(threadId, { start: normalizeRelPos(body.start), end: normalizeRelPos(body.end) })
    const at = new Date().toISOString()
    threads.set(threadId, { id: threadId, projectId, docId: d.id, createdBy: ME.id, createdAt: at, resolved: null, messages: [{ id: id('m'), userId: ME.id, content: body.content, createdAt: at, editedAt: null }] })
    bump(projectId, 'reviewVersion')
    return { id: threadId }
  })
  route('POST', '/api/projects/:id/review/threads/:t/messages', async (req, { id: projectId, t }) => {
    thread(t).messages.push({ id: id('m'), userId: ME.id, content: (await req.body()).content, createdAt: new Date().toISOString(), editedAt: null })
    bump(projectId, 'reviewVersion')
    return undefined
  })
  route('PATCH', '/api/projects/:id/review/threads/:t/messages/:m', async (req, { id: projectId, t, m }) => {
    const msg = thread(t).messages.find(x => x.id === m)
    if (!msg || msg.userId !== ME.id) throw new HttpError(404, 'Message not found')
    Object.assign(msg, { content: (await req.body()).content, editedAt: new Date().toISOString() })
    bump(projectId, 'reviewVersion')
    return undefined
  })
  route('DELETE', '/api/projects/:id/review/threads/:t/messages/:m', (_req, { id: projectId, t, m }) => {
    const th = thread(t)
    th.messages = th.messages.filter(x => !(x.id === m && x.userId === ME.id))
    bump(projectId, 'reviewVersion')
    return undefined
  })
  route('POST', '/api/projects/:id/review/threads/:t/resolve', async (req, { id: projectId, t }) => {
    thread(t).resolved = (await req.body()).resolved ? { by: ME.id, at: new Date().toISOString() } : null
    bump(projectId, 'reviewVersion')
    return undefined
  })
  route('DELETE', '/api/projects/:id/review/threads/:t', (_req, { id: projectId, t }) => {
    const th = thread(t)
    const d = docById(th.docId)
    if (d) commentsMap(d.ydoc).delete(t)
    threads.delete(t)
    bump(projectId, 'reviewVersion')
    return undefined
  })
  for (const decision of ['accept', 'reject'] as const) {
    route('POST', `/api/projects/:id/review/changes/${decision}`, async (req, { id: projectId }) => {
      const body = await req.body()
      let count = 0
      const done: { docId: string; undo: DecisionUndo[] }[] = []
      for (const path of ['main.tex', 'refs.bib']) {
        const d = docFor(projectId, path)
        if (!d || (body.docId && body.docId !== d.id)) continue
        const undo: DecisionUndo[] = []
        const ids = body.ids ?? 'all'
        count += (decision === 'accept' ? acceptChanges(d.ydoc, ids, undefined, undo) : rejectChanges(d.ydoc, ids, undefined, undo)).length
        if (undo.length) done.push({ docId: d.id, undo })
      }
      if (count) bump(projectId, 'reviewVersion')
      if (!done.length) return { count, undoId: null }
      const undoId = id('u')
      undos.set(undoId, done)
      return { count, undoId }
    })
  }
  route('POST', '/api/projects/:id/review/changes/undo', async (req, { id: projectId }) => {
    const pending = undos.get((await req.body()).undoId)
    if (!pending) throw new HttpError(404, 'This can no longer be undone')
    undos.delete((await req.body()).undoId)
    let count = 0
    for (const p of pending) {
      const d = docById(p.docId)
      if (d) count += undoDecision(d.ydoc, p.undo)
    }
    if (count) bump(projectId, 'reviewVersion')
    return { count }
  })
}
