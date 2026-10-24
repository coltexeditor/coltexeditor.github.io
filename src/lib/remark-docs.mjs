// Markdown of ColTex's help documentation, as the in-app help shows it (pages/help/doc-view.tsx):
// code spans that are keys become keys (Mod is ⌘ on a Mac, Ctrl elsewhere: the page swaps them
// in the browser, from data-mac), and links between sections (#/help/<id>) point at the site's pages.
const KEY = /^(?:Ctrl|Alt|Shift|Cmd|Mod|Esc|Tab|Enter|F\d{1,2}|[⌘⇧⌥↩])/
const MAC = { Mod: '⌘', Cmd: '⌘', Meta: '⌘', Ctrl: '⌃', Alt: '⌥', Option: '⌥', Shift: '⇧' }
const OTHER = { Mod: 'Ctrl', Cmd: 'Win', Meta: 'Win', Option: 'Alt' }
const escape = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

function keys(text) {
  const parts = text.split(/[-+](?=.)/).map(p => {
    const shown = OTHER[p] ?? (p.length === 1 ? p.toUpperCase() : p)
    const mac = MAC[p] ?? shown
    return `<kbd${mac !== shown ? ` data-mac="${escape(mac)}"` : ''}>${escape(shown)}</kbd>`
  })
  return `<span class="keys">${parts.join('')}</span>`
}

/** The site path of a language's docs: /docs/ for English, /zh-cn/docs/ and so on. */
const docsBase = lang => (lang === 'en' ? '/docs/' : `/${lang.toLowerCase()}/docs/`)

export default function remarkDocs() {
  return (tree, file) => {
    const lang = (file.path ?? '').match(/docs\/([^/]+)\/[^/]+\.md$/)?.[1] ?? 'en'
    const walk = node => {
      for (const [i, child] of (node.children ?? []).entries()) {
        if (child.type === 'inlineCode' && KEY.test(child.value)) node.children[i] = { type: 'html', value: keys(child.value) }
        else if (child.type === 'link' && child.url.startsWith('#/help/')) {
          const [id, hash] = child.url.slice('#/help/'.length).split('#')
          child.url = docsBase(lang) + id + '/' + (hash ? `#${hash}` : '')
        } else walk(child)
      }
    }
    walk(tree)
  }
}
