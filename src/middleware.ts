// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export function middleware(request: NextRequest) {
  // Пропускаем запросы к API аутентификации
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Пропускаем страницу входа
  if (request.nextUrl.pathname === '/') {
    return NextResponse.next()
  }

  // Проверяем наличие токена
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Указываем, для каких путей применять middleware
export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*'
  ]
}
