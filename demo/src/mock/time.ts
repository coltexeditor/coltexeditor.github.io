// How long the made-up server takes to answer (an AI step, a build). While the tour plays
// through to a moment at once, it takes no time.
let fast = () => false

/** The tour says when it is playing through. */
export function fastWhile(check: () => boolean) {
  fast = check
}

export const sleep = (ms: number) => new Promise(r => setTimeout(r, fast() ? 0 : ms))
