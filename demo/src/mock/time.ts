// How long the made-up server takes to answer (an AI step, a build). While the tour plays
// through to a moment at once, it takes no time.
let fast = () => false

/** The tour says when it is playing through. */
export function fastWhile(check: () => boolean) {
  fast = check
}

// While playing through, a message to itself rather than a timer: nested timers wait at least
// 4 ms each, and the AI agent's steps are many.
const channel = new MessageChannel()
const queued: (() => void)[] = []
channel.port1.onmessage = () => queued.shift()?.()

export const sleep = (ms: number) =>
  new Promise<void>(r => {
    if (!fast()) return void setTimeout(r, ms)
    queued.push(r)
    channel.port2.postMessage(null)
  })
