import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Пропускаем запросы к API и странице входа
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname === '/'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;
  
  // Если нет токена, перенаправляем на страницу входа
  if (!token && !request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};