import { NextResponse } from 'next/server'

declare global {
  // eslint-disable-next-line no-var
  var _ceremonyClients: Set<(msg: string) => void>
}
globalThis._ceremonyClients ??= new Set()

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

      // Named 'ping' event every 10 s — client uses this to detect silent drops
      pingTimer = setInterval(() => {
        try {
          controller.enqueue(enc.encode('event: ping\ndata: \n\n'))
        } catch {
          cleanup()
        }
      }, 10_000)
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
      'X-Accel-Buffering': 'no',
    },
  })
}

export async function POST() {
  const count = globalThis._ceremonyClients.size
  globalThis._ceremonyClients.forEach(fn => { try { fn('launch') } catch {} })
  return NextResponse.json({ ok: true, notified: count })
}
