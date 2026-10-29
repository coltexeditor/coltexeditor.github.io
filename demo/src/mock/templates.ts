// Templates for new projects: ColTex's built-in ones (listed from the checkout when the demo is
// built, see scripts/demo.mjs) and two the lab shares. Making a project from one isn't part of
// the demo (nothing but the sample paper can be compiled here).
import builtins from '../templates.json'
import { DEMO_ONLY, HttpError, type Req } from './http.ts'
import { BOB, ME } from './store.ts'

type Route = (method: string, path: string, handler: (req: Req, params: Record<string, string>) => unknown) => void

const builtin = (builtins as { id: string; name: string; description: string; field: string | null; target: string | null }[]).map(b => ({
  id: b.id,
  kind: 'builtin' as const,
  name: b.name,
  description: b.description,
  field: b.field,
  sharing: 'builtin' as const,
  groups: [],
  bySystemAdmin: false,
  publishedBy: null,
  canRemove: false,
  projectId: null,
  target: b.target,
  templateOnly: false,
}))

const SHARED = [
  {
    id: 'demo-template-lab-report',
    kind: 'shared' as const,
    name: 'Lab report',
    description: 'The lab’s report layout: logo, project number, methods and data appendix',
    field: 'biology',
    sharing: 'server' as const,
    groups: [],
    bySystemAdmin: true,
    publishedBy: ME.name,
    canRemove: true,
    projectId: null,
    target: null,
    templateOnly: true,
  },
  {
    id: 'demo-template-thesis',
    kind: 'shared' as const,
    name: 'Thesis chapter',
    description: 'The university’s thesis class, one chapter with its own bibliography',
    field: 'general',
    sharing: 'groups' as const,
    groups: ['Structural Biology Lab'],
    bySystemAdmin: false,
    publishedBy: BOB.name,
    canRemove: true,
    projectId: null,
    target: null,
    templateOnly: true,
  },
]

const refuse = () => {
  throw new HttpError(403, DEMO_ONLY)
}

export function register(route: Route) {
  route('GET', '/api/templates', () => [...SHARED, ...builtin])
  route('POST', '/api/templates/import', refuse)
  route('DELETE', '/api/templates/:id', refuse)
  route('GET', '/api/projects/:id/template', () => null)
  route('PUT', '/api/projects/:id/template', refuse)
  route('DELETE', '/api/projects/:id/template', refuse)
  route('POST', '/api/projects/:id/export/word', refuse)
}
