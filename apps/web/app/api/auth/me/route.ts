import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1').replace(
  'localhost',
  '127.0.0.1',
)

export async function GET(req: NextRequest) {
  const cookie = req.headers.get('cookie') ?? ''

  try {
    const upstream = await fetch(`${API_URL}/auth/me`, {
      headers: { cookie },
    })

    return new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
