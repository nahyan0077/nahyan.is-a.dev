import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1').replace(
  'localhost',
  '127.0.0.1',
)

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  try {
    const upstream = await fetch(`${API_URL}/auth/verify?token=${encodeURIComponent(token ?? '')}`)

    const response = new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    })

    const setCookies = upstream.headers.getSetCookie?.() ?? []
    for (const cookie of setCookies) {
      response.headers.append('Set-Cookie', cookie)
    }

    return response
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
