import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('token')?.value;
  // 保护需要认证的路由
  const protectedRoutes = ['/home'];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!authToken) {
      // 直接重定向到登录页，不带参数
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const isAuth = await isAuthenticated();
    if (!isAuth) {
       // 直接重定向到登录页，不带参数
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 已认证用户访问登录页时重定向到首页
  if (pathname.startsWith('/login') && authToken) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};