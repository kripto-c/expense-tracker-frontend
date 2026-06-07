// ──────────────────────────────────────────────
// Proxy — protege rutas del dashboard
// Lee la cookie HttpOnly 'token' que setea el backend
// ──────────────────────────────────────────────

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/auth/login']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Si no hay token y la ruta no es pública → redirect a login
  if (!token && !publicPaths.includes(pathname) && !pathname.startsWith('/_next')) {
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Si hay token y está en login → redirect a dashboard
  if (token && (pathname === '/' || pathname === '/auth/login')) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
