// middleware.js
import { match } from '@formatjs/intl-localematcher'
import type { NextRequest } from 'next/server';
import Negotiator from 'negotiator'
import { locales, defaultLocale } from './config'

const publicFile = /\.(.*)$/
const excludeFile = ['logo.svg']

function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = { 'accept-language': request.headers.get('accept-language') || '' };
  const languages: string[] = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest): Response | undefined {
  const { pathname } = request.nextUrl;
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
  // 重定向，如 /products 重定向到 /en-US/products
  return Response.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
