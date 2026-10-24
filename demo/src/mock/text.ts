import type * as Y from 'yjs'

/**
 * Replaces a Y.Text's content with `next` by changing only the part that differs (the server's
 * applyTextDiff does the same, so cursors and comments elsewhere in the text stay put).
 */
export function replaceText(ytext: Y.Text, next: string, origin: unknown) {
  const prev = ytext.toString()
  if (prev === next) return
  let start = 0
  while (start < prev.length && start < next.length && prev[start] === next[start]) start++
  let end = 0
  while (end < prev.length - start && end < next.length - start && prev[prev.length - 1 - end] === next[next.length - 1 - end]) end++
  ytext.doc!.transact(() => {
    ytext.delete(start, prev.length - start - end)
    ytext.insert(start, next.slice(start, next.length - end))
  }, origin)
}
