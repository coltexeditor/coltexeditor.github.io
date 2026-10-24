// The states of the demo project that have a real build (made by scripts/demo-compile.mjs in
// ColTex's compiler image): the project as it opens, then each change the tour makes. A
// compile in the demo looks its sources up here; anything else can't be built without a
// server. Erasable TypeScript only: Node reads this file too.

export type Edit = { file: string; find: string; replace: string }
export type State = { id: string; edits: Edit[] }

/** The tour's changes, in order; each state has all the edits before it. */
export const EDITS: Record<string, Edit> = {
  equation: {
    file: 'main.tex',
    find: 'of its neighbours.\n',
    replace: 'of its neighbours:\n\\begin{equation}\n  h_v^{(k+1)} = \\sigma\\Big(W^{(k)} \\sum_{u \\in N(v)} h_u^{(k)}\\Big)\n\\end{equation}\n',
  },
  colleague: {
    file: 'main.tex',
    find: 'from~\\cite{rao2021}.\n',
    replace: 'from~\\cite{rao2021}.\nThe model improves the Top-$L$ precision by 0.09.\n',
  },
  row: {
    file: 'main.tex',
    find: '    Ours & \\textbf{0.61} & \\textbf{0.82} \\\\\n',
    replace: '    Ours & \\textbf{0.61} & \\textbf{0.82} \\\\\n    Ours + templates & \\textbd{0.66} & \\textbd{0.86} \\\\\n',
  },
  fix: {
    file: 'main.tex',
    find: '    Ours + templates & \\textbd{0.66} & \\textbd{0.86} \\\\\n',
    replace: '    Ours + templates & \\textbf{0.66} & \\textbf{0.86} \\\\\n',
  },
}

export const STATES: State[] = ['opened', 'equation', 'colleague', 'row', 'fix'].map((id, i, all) => ({
  id,
  edits: all.slice(1, i + 1).map(e => EDITS[e]!),
}))

export function applyEdits(files: Record<string, string>, edits: Edit[]): Record<string, string> {
  const out = { ...files }
  for (const e of edits) {
    const text = out[e.file]!
    if (!text.includes(e.find)) throw new Error(`demo scenario: "${e.find.trim()}" not in ${e.file}`)
    out[e.file] = text.replace(e.find, e.replace)
  }
  return out
}

/** What identifies a state: every text file's path and content. */
export function stateText(files: Record<string, string>): string {
  return Object.keys(files)
    .sort()
    .map(p => `${p}\u0000${files[p]}`)
    .join('\u0001')
}
