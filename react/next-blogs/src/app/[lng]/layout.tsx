import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import ThemeSwitch from '@/components/ThemeSwitch';
import { dir } from 'i18next'
import LangSwitch from '@/components/LangSwitch';
import WebVitals from '@/components/WebVitals'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'zh_CN',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

// 添加静态路由
export async function generateStaticParams() {
  return siteMetadata.languages.map((lng) => ({ lng }))
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{lng: string}>
}>) {
  const { lng } = await params
  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebVitals />
        <ThemeProviders>
          <header className="flex justify-end">
            <ThemeSwitch />
            <LangSwitch />
          </header>
          {children}
        </ThemeProviders>
      </body>
    </html>
  );
}

