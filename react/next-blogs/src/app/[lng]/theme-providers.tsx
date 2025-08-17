'use client'

import { ThemeProvider } from 'next-themes'

export function ThemeProviders({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  )
}