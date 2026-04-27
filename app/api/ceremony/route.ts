import { NextResponse } from 'next/server'

// globalThis survives hot-module reloads in Next.js dev mode;
// a plain module-level Set gets re-instantiated on every reload.
declare global {
  // eslint-disable-next-line no-var
  var _ceremonyClients: Set<(msg: string) => void>
}
globalThis._ceremonyClients ??= new Set()

// Prevent Next.js from statically caching this route
export const dynamic = 'force-dynamic'

export async function GET() {
  const enc = new TextEncoder()
  let push: ((msg: string) => void) | undefined
  let pingTimer: ReturnType<typeof setInterval> | undefined

  const stream = new ReadableStream({
    start(controller) {
      push = (msg: string) => {
        try {
          controller.enqueue(enc.encode(`data: ${msg}\n\n`))
        } catch {
          cleanup()
        }
      }
      globalThis._ceremonyClients.add(push)

      // Keep the connection alive so proxies/browsers don't close it
      pingTimer = setInterval(() => {
        try {
          controller.enqueue(enc.encode(': ping\n\n'))
        } catch {
          cleanup()
        }
      }, 15_000)
    },
    cancel() {
      cleanup()
    },
  })

  function cleanup() {
    if (push) globalThis._ceremonyClients.delete(push)
    if (pingTimer) clearInterval(pingTimer)
    push = undefined
    pingTimer = undefined
  }

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // disable nginx/proxy buffering
    },
  })
}

export async function POST() {
  const count = globalThis._ceremonyClients.size
  globalThis._ceremonyClients.forEach(fn => {
    try { fn('launch') } catch {}
  })
  return NextResponse.json({ ok: true, notified: count })
}
