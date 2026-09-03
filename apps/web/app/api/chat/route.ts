import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1').replace(
  'localhost',
  '127.0.0.1',
)

export async function POST(req: NextRequest) {
  const body = await req.text()

  try {
    const upstream = await fetch(`${API_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') ?? 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
