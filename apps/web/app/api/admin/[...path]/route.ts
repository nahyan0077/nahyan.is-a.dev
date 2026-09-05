import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1').replace(
  'localhost',
  '127.0.0.1',
)

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pathStr = path.join('/')
  const qs = req.nextUrl.searchParams.toString()
  const url = `${API_URL}/${pathStr}${qs ? `?${qs}` : ''}`
  const cookie = req.headers.get('cookie') ?? ''

  try {
    const upstream = await fetch(url, {
      headers: { cookie },
    })
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pathStr = path.join('/')
  const url = `${API_URL}/${pathStr}`
  const cookie = req.headers.get('cookie') ?? ''
  const body = await req.text()

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie },
      body,
    })
    const response = new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
    })
    const setCookies = upstream.headers.getSetCookie?.() ?? []
    for (const c of setCookies) response.headers.append('Set-Cookie', c)
    return response
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pathStr = path.join('/')
  const url = `${API_URL}/${pathStr}`
  const cookie = req.headers.get('cookie') ?? ''
  const body = await req.text()

  try {
    const upstream = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', cookie },
      body,
    })
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const pathStr = path.join('/')
  const url = `${API_URL}/${pathStr}`
  const cookie = req.headers.get('cookie') ?? ''

  try {
    const upstream = await fetch(url, {
      method: 'DELETE',
      headers: { cookie },
    })
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
