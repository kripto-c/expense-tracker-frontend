// ──────────────────────────────────────────────
// Proxy — auth guard + strip Origin en /api
// ──────────────────────────────────────────────

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/auth/login', '/auth/register']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── API calls: sacar Origin para evitar CORS del backend ──
  if (pathname.startsWith('/api')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.delete('origin')
    requestHeaders.delete('sec-fetch-mode')

    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  }

  // ── Pages: auth guard ──
  const token = request.cookies.get('token')?.value

  if (!token && !publicPaths.includes(pathname) && !pathname.startsWith('/_next')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (token && (pathname === '/' || pathname === '/auth/login' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
