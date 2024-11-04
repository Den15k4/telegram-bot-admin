// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Игнорируем API маршруты и страницу входа
  if (request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname === '/') {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth-token')?.value

  // Если нет токена, перенаправляем на страницу входа
  if (!token) {
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Указываем маршруты для проверки
export const config = {
  matcher: ['/dashboard/:path*']
}