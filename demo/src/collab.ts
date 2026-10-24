// The demo's stand-in for src/lib/collab.ts (swapped in by vite.demo.config.ts): the same
// exports, but the documents live in this tab (mock/store.ts) instead of on a server, and the
// other people in a project are the demo's own (mock/people.ts moves them).
import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import type { Awareness } from 'y-protocols/awareness'
import { changesMap } from '@coltex/review'
import type { SessionUser } from '../lib/auth.ts'
import { avatarHue, hueColor } from '../lib/avatar-colors.ts'
import { docById, projectSpace } from './mock/store.ts'

export const TEXT_KEY = 'content'

export type CollabUser = { id: string; name: string; color: string; colorLight: string }

export function userColor(userId: string): string {
  return hueColor(avatarHue(userId))
}

// Unchanged from src/lib/collab.ts.
export function withoutOwnSessions<A extends { clientID: number; getStates(): Map<number, Record<string, any>>; getLocalState(): Record<string, any> | null }>(
  awareness: A,
): A {
  return new Proxy(awareness, {
    get(target, prop) {
      if (prop === 'getStates') {
        return () => {
          const me = (target.getLocalState()?.user as { id?: string } | undefined)?.id
          const states = new Map(target.getStates())
          if (me) {
            for (const [clientId, state] of states) {
              if (clientId !== target.clientID && (state.user as { id?: string } | undefined)?.id === me) states.delete(clientId)
            }
          }
          return states
        }
      }
      const value = Reflect.get(target, prop, target)
      return typeof value === 'function' ? value.bind(target) : value
    },
  })
}

export function collabUser(user: SessionUser): CollabUser {
  const color = userColor(user.id)
  return { id: user.id, name: user.name, color, colorLight: color.replace(')', ' / 0.18)') }
}

/** There is no socket in the demo; a token so the hooks below run. */
export type DemoSocket = { demo: true }
export function useCollabSocket(): DemoSocket | undefined {
  return { demo: true }
}

export type Peer = { clientId: number; user: CollabUser; path?: string }

export function useProjectPresence(_socket: DemoSocket | undefined, projectId: string, me: CollabUser, openPath?: string) {
  const [peers, setPeers] = useState<Peer[]>([])
  const [versions, setVersions] = useState({ treeVersion: 0, reviewVersion: 0, chatVersion: 0 })

  useEffect(() => {
    const space = projectSpace(projectId)
    const { awareness, meta } = space
    const onAwareness = () => {
      const list: Peer[] = []
      awareness.getStates().forEach((state, clientId) => {
        if (clientId !== awareness.clientID && state.user && state.user.id !== me.id) list.push({ clientId, user: state.user, path: state.path })
      })
      setPeers(list)
    }
    const onMeta = () =>
      setVersions({
        treeVersion: (meta.get('treeVersion') as number | undefined) ?? 0,
        reviewVersion: (meta.get('reviewVersion') as number | undefined) ?? 0,
        chatVersion: (meta.get('chatVersion') as number | undefined) ?? 0,
      })
    awareness.on('change', onAwareness)
    meta.observe(onMeta)
    onAwareness()
    onMeta()
    return () => {
      awareness.off('change', onAwareness)
      meta.unobserve(onMeta)
    }
  }, [projectId])

  useEffect(() => {
    projectSpace(projectId).awareness.setLocalState({ user: me, path: openPath })
  }, [projectId, me, openPath])

  return { peers, ...versions, connected: true }
}

export type CollabDoc = {
  ydoc: Y.Doc
  ytext: Y.Text
  /** Only `awareness` is used outside this module. */
  provider: { awareness: Awareness }
  undoManager: Y.UndoManager
}

export function useCollabDoc(_socket: DemoSocket | undefined, _projectId: string, docId: string | undefined, me: CollabUser) {
  const [doc, setDoc] = useState<CollabDoc>()

  useEffect(() => {
    setDoc(undefined)
    if (!docId) return
    const shared = docById(docId)
    if (!shared) return
    // setLocalStateField does nothing on a cleared state, so set the whole state.
    shared.awareness.setLocalState({ ...(shared.awareness.getLocalState() ?? {}), user: me })
    // A fresh undo history each time the file is opened, as after a reconnect.
    const undoManager = new Y.UndoManager([shared.ytext, changesMap(shared.ydoc)])
    setDoc({ ydoc: shared.ydoc, ytext: shared.ytext, provider: { awareness: shared.awareness }, undoManager })
    return () => {
      undoManager.destroy()
      shared.awareness.setLocalState(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId])

  return { doc, unsynced: 0, failed: undefined as string | undefined }
}
