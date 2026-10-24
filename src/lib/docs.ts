// The documentation pages' data: ColTex's help sections (order and titles from its
// nav.ts and locales) and their Markdown in each language, as synced from the latest release.
import { getCollection, render } from 'astro:content'
import sections from '../generated/sections.json'
import { LANGUAGES, type Lang } from '../i18n/index.ts'

export type Section = { id: string; title: string; admin: boolean; titles: Record<string, string> }
export const SECTIONS = sections as Section[]

const base = (lang: Lang) => {
  const path = LANGUAGES.find(l => l.id === lang)!.path
  return path ? `/${path}` : ''
}
export const docsHref = (lang: Lang, id?: string) => `${base(lang)}/docs/${id ? `${id}/` : ''}`

/** A section's page in `lang` (English when that language lacks the file). */
export async function docPage(lang: Lang, id: string) {
  const entries = await getCollection('docs')
  const of = (l: string) => entries.find(e => e.filePath?.endsWith(`/docs/${l}/${id}.md`))
  const entry = of(lang) ?? of('en')
  if (!entry) throw new Error(`docs: no ${id}.md`)
  return render(entry)
}
