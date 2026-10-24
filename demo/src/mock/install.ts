// Where the web app's requests are answered: window.fetch and EventSource are wrapped before
// the app loads, so every /api request goes to mock/http.ts and every stream to
// mock/streams.ts, in this tab. Nothing leaves the browser.
import { handle, setRealFetch } from './http.ts'
import { openStream } from './streams.ts'

export function installMock() {
  const real = window.fetch.bind(window)
  setRealFetch(real)
  window.fetch = async (input, init) => {
    const request = new Request(input, init)
    const url = new URL(request.url)
    if (url.origin === location.origin && url.pathname.startsWith('/api/')) return handle(request)
    return real(input, init)
  }

  class DemoEventSource extends EventTarget {
    static readonly CONNECTING = 0
    static readonly OPEN = 1
    static readonly CLOSED = 2
    readonly url: string
    readonly withCredentials = false
    readyState = 0
    onopen: ((e: Event) => void) | null = null
    onmessage: ((e: MessageEvent) => void) | null = null
    onerror: ((e: Event) => void) | null = null
    private stop: () => void
    constructor(url: string | URL) {
      super()
      this.url = new URL(url, location.href).href
      this.stop = openStream(new URL(this.url).pathname, data => {
        const e = new MessageEvent('message', { data: JSON.stringify(data) })
        this.onmessage?.(e)
        this.dispatchEvent(e)
      })
      queueMicrotask(() => {
        this.readyState = 1
        const e = new Event('open')
        this.onopen?.(e)
        this.dispatchEvent(e)
      })
    }
    close() {
      this.readyState = 2
      this.stop()
    }
  }
  window.EventSource = DemoEventSource as unknown as typeof EventSource
}
