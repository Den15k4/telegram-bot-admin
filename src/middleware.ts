import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isLoginPage = request.nextUrl.pathname === '/';

  // Пропускаем API маршруты и страницу входа
  if (isApiRoute || isLoginPage) {
    return NextResponse.next();
  }

  // Проверяем наличие токена в cookies
  const authToken = request.cookies.get('auth_token');

  if (!authToken) {
    // Если нет токена, перенаправляем на страницу входа
    const loginUrl = new URL('/', request.url);
    console.log('No auth token found, redirecting to:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};