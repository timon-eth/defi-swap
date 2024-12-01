import type { Metadata } from 'next'
import { Syne } from "@/public/fonts/syne";
import './globals.css'

import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: 'Defi Swap',
  description: 'DeFi Swap Interface - Frontend Technical Assessment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${Syne.className} overflow-hidden dark`}>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  )
}
