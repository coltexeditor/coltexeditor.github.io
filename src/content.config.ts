// ColTex's help documentation, from its latest release (scripts/sync.mjs).
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

export const collections = {
  docs: defineCollection({ loader: glob({ pattern: '*/*.md', base: './src/generated/docs' }) }),
}
