import { match } from '@formatjs/intl-localematcher'
import type { NextRequest } from 'next/server';
import {NextResponse} from 'next/server'
import Negotiator from 'negotiator'
import { locales, defaultLocale } from './config'
import { auth } from '@/lib/auth'

const publicFile = /\.(.*)$/
const excludeFile = ['logo.svg']

function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = { 'accept-language': request.headers.get('accept-language') || '' };
  const languages: string[] = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // 1. 检查是否需要登录（/note/edit 路径）
  if (pathname.startsWith("/note/edit")) {
    const session = await auth(); // 获取用户会话
    if (!session) {
      // 未登录时重定向到登录页
      const loginUrl = new URL("/api/auth/signin", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname); // 登录后跳回原页面
      return NextResponse.redirect(loginUrl);
    }
  }
  // 判断请求路径中是否已存在语言，已存在语言则跳过
  const pathnameHasLocale: boolean = locales.some(
    (locale: string) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;
  // 如果是 public 文件，不重定向
  if (publicFile.test(pathname) && excludeFile.indexOf(pathname.substr(1)) == -1) return

  // 获取匹配的 locale
  const locale: string = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // 默认语言不重定向
  if (locale == defaultLocale) {
    return NextResponse.rewrite(request.nextUrl)
  }
  // 重定向，如 /products 重定向到 /en-US/products
  return Response.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
