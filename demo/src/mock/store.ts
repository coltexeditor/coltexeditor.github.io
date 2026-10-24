// The demo's "server" state, in this tab only: people, projects, their files, and the Yjs
// documents of the open text files (what the real server keeps in Postgres, storage and
// Hocuspocus). Everything starts over when the page loads.
import * as Y from 'yjs'
import { Awareness } from 'y-protocols/awareness'
import mainTex from '../project/main.tex?raw'
import refsBib from '../project/refs.bib?raw'
import architecturePdf from '../project/figures/architecture.pdf?url'

export const DEMO_PROJECT = 'gnn-protein-folding'

export type Person = { id: string; name: string; email: string; role: 'admin' | 'manager' | 'user' }
export const ME: Person = { id: 'demo-alice-anders', name: 'Alice Anders', email: 'alice@lab.example', role: 'admin' }
export const BOB: Person = { id: 'demo-bob-baker', name: 'Bob Baker', email: 'bob@lab.example', role: 'user' }
export const CAROL: Person = { id: 'demo-carol-clarke', name: 'Carol Clarke', email: 'carol@lab.example', role: 'user' }
export const PEOPLE = [ME, BOB, CAROL]
/** What the sign-in form is filled with, and the tour types. */
export const DEMO_EMAIL = ME.email
export const DEMO_PASSWORD = 'demo-1234'

export type DemoFile = { text?: string; asset?: string; size: number; modifiedAt: number }
export type DemoProject = {
  id: string
  name: string
  rootFile: string
  ownerId: string
  createdAt: string
  updatedAt: string
  members: { userId: string; role: 'owner' | 'editor' | 'reviewer' | 'viewer' }[]
  files: Map<string, DemoFile>
  folders: Set<string>
  archived: boolean
  trashed: boolean
  tagIds: string[]
}

const now = Date.now()
const ago = (minutes: number) => new Date(now - minutes * 60_000).toISOString()

function project(id: string, name: string, owner: Person, minutesAgo: number, files: Record<string, string>, extra: Partial<DemoProject> = {}): DemoProject {
  const map = new Map<string, DemoFile>()
  const folders = new Set<string>()
  for (const [path, text] of Object.entries(files)) {
    map.set(path, { text, size: new TextEncoder().encode(text).length, modifiedAt: now - minutesAgo * 60_000 })
    const parts = path.split('/')
    for (let i = 1; i < parts.length; i++) folders.add(parts.slice(0, i).join('/'))
  }
  return {
    id,
    name,
    rootFile: 'main.tex',
    ownerId: owner.id,
    createdAt: ago(minutesAgo + 60 * 24 * 20),
    updatedAt: ago(minutesAgo),
    members: [{ userId: owner.id, role: 'owner' }],
    files: map,
    folders,
    archived: false,
    trashed: false,
    tagIds: [],
    ...extra,
  }
}

const short = (title: string) =>
  `\\documentclass{article}\n\\title{${title}}\n\\author{Alice Anders}\n\\begin{document}\n\\maketitle\n\n\\section{Notes}\nTo be written.\n\n\\end{document}\n`

export const projects = new Map<string, DemoProject>()
for (const p of [
  project(DEMO_PROJECT, 'Graph neural networks for protein folding', ME, 2, { 'main.tex': mainTex, 'refs.bib': refsBib }, {
    members: [
      { userId: ME.id, role: 'owner' },
      { userId: BOB.id, role: 'editor' },
      { userId: CAROL.id, role: 'reviewer' },
    ],
    tagIds: ['tag-papers'],
  }),
  project('thesis-chapter-3', 'Thesis: chapter 3', ME, 75, { 'main.tex': short('Chapter 3: Folding pathways') }, { tagIds: ['tag-thesis'] }),
  project('lab-seminar-notes', 'Lab seminar notes', BOB, 60 * 26, { 'main.tex': short('Lab seminar notes') }, {
    members: [
      { userId: BOB.id, role: 'owner' },
      { userId: ME.id, role: 'editor' },
    ],
  }),
  project('grant-proposal-2027', 'Grant proposal 2027', ME, 60 * 24 * 3, { 'main.tex': short('Grant proposal 2027') }, { tagIds: ['tag-papers'] }),
  project('protein-dynamics-review', 'Review: protein dynamics', CAROL, 60 * 24 * 8, { 'main.tex': short('Protein dynamics: a review') }, {
    members: [
      { userId: CAROL.id, role: 'owner' },
      { userId: ME.id, role: 'reviewer' },
    ],
  }),
]) {
  projects.set(p.id, p)
}
// The figure is a real PDF, fetched from the demo's own files when it is read.
const demo = projects.get(DEMO_PROJECT)!
demo.files.set('figures/architecture.pdf', { asset: architecturePdf, size: 39156, modifiedAt: now - 60 * 60_000 })
demo.folders.add('figures')

export const tags = [
  { id: 'tag-papers', name: 'Papers', color: '#3b82f6' },
  { id: 'tag-thesis', name: 'Thesis', color: '#22c55e' },
]

// ---- Documents --------------------------------------------------------------------------

export type SharedDoc = { id: string; projectId: string; path: string; ydoc: Y.Doc; ytext: Y.Text; awareness: Awareness }
const docs = new Map<string, SharedDoc>()

export function docFor(projectId: string, path: string): SharedDoc | undefined {
  const file = projects.get(projectId)?.files.get(path)
  if (!file || file.text === undefined) return undefined
  const id = `${projectId}--${path.replace(/[^A-Za-z0-9]/g, '-')}`
  let doc = docs.get(id)
  if (!doc) {
    const ydoc = new Y.Doc()
    const ytext = ydoc.getText('content')
    ytext.insert(0, file.text)
    doc = { id, projectId, path, ydoc, ytext, awareness: new Awareness(ydoc) }
    docs.set(id, doc)
  }
  return doc
}

export const docById = (id: string) => docs.get(id)

/** A text file's content now: its live document when it has one. */
export function textOf(projectId: string, path: string): string | undefined {
  const file = projects.get(projectId)?.files.get(path)
  if (file?.text === undefined) return undefined
  const id = `${projectId}--${path.replace(/[^A-Za-z0-9]/g, '-')}`
  return docs.get(id)?.ytext.toString() ?? file.text
}

// ---- The project's own space: presence and change counters -------------------------------

type Space = { doc: Y.Doc; awareness: Awareness; meta: Y.Map<unknown> }
const spaces = new Map<string, Space>()

export function projectSpace(projectId: string): Space {
  let space = spaces.get(projectId)
  if (!space) {
    const doc = new Y.Doc()
    space = { doc, awareness: new Awareness(doc), meta: doc.getMap('meta') }
    spaces.set(projectId, space)
  }
  return space
}

/** What the server's collab.bump does: open editors refetch the tree, the review data or the chat. */
export function bump(projectId: string, key: 'treeVersion' | 'reviewVersion' | 'chatVersion') {
  const { meta } = projectSpace(projectId)
  meta.set(key, ((meta.get(key) as number | undefined) ?? 0) + 1)
}

// ---- The other people in a project, moved by the tour ---------------------------------------

/** Puts someone into an awareness as another client would (y-protocols keeps remote states in `states`). */
function setRemote(awareness: Awareness, clientId: number, state: Record<string, unknown> | null) {
  const had = awareness.states.has(clientId)
  if (state) {
    awareness.states.set(clientId, state)
    awareness.meta.set(clientId, { clock: (awareness.meta.get(clientId)?.clock ?? 0) + 1, lastUpdated: Date.now() })
  } else {
    awareness.states.delete(clientId)
    awareness.meta.delete(clientId)
  }
  const change = { added: state && !had ? [clientId] : [], updated: state && had ? [clientId] : [], removed: state ? [] : [clientId] }
  awareness.emit('change', [change, 'demo'])
  awareness.emit('update', [change, 'demo'])
}

export type PeerUser = { id: string; name: string; color: string; colorLight: string }
const peerClient = (userId: string) => 1_000_000 + [...userId].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 900_000, 7)

/** Someone opens the project (and a file): their avatar appears, and their cursor in the file. */
export function peerJoin(projectId: string, user: PeerUser, path: string) {
  setRemote(projectSpace(projectId).awareness, peerClient(user.id), { user, path })
}
export function peerLeave(projectId: string, userId: string) {
  setRemote(projectSpace(projectId).awareness, peerClient(userId), null)
  for (const doc of docs.values()) if (doc.projectId === projectId) setRemote(doc.awareness, peerClient(userId), null)
}

/** Their cursor at `index` in a file (y-codemirror reads `cursor` as relative positions). */
export function peerCursor(doc: SharedDoc, user: PeerUser, index: number) {
  const pos = Y.relativePositionToJSON(Y.createRelativePositionFromTypeIndex(doc.ytext, index))
  setRemote(doc.awareness, peerClient(user.id), { user, cursor: { anchor: pos, head: pos } })
}

/** Their typing: the text arrives as a remote change, the cursor after it. */
export function peerType(doc: SharedDoc, user: PeerUser, index: number, text: string) {
  doc.ydoc.transact(() => doc.ytext.insert(index, text), 'demo-peer')
  peerCursor(doc, user, index + text.length)
}
