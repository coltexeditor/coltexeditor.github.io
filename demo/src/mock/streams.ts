// The server-sent event streams in the demo: notifications and the AI agent's sessions.
type Send = (data: unknown) => void
const listeners = new Map<string, Set<Send>>()

/** What a new stream gets first (the server's streams start with their current state). */
type Starter = (path: string) => unknown[] | undefined
const starters: Starter[] = [path => (path === '/api/me/notifications/events' ? [{ unread: 0 }] : undefined)]
export function onOpen(starter: Starter) {
  starters.push(starter)
}

/** Opens the stream at `path`; returns how to close it. */
export function openStream(path: string, send: Send): () => void {
  let set = listeners.get(path)
  if (!set) listeners.set(path, (set = new Set()))
  set.add(send)
  queueMicrotask(() => {
    for (const starter of starters) {
      const first = starter(path)
      if (first) return first.forEach(send)
    }
  })
  return () => set!.delete(send)
}

export function publish(path: string, data: unknown) {
  for (const send of listeners.get(path) ?? []) send(data)
}
