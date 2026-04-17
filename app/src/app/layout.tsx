import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProviderWrapper } from '@/components/layout/SessionProviderWrapper'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'KitsuneDo — Japanese & Korean Learning',
  description: 'Master Japanese (N5–N2) and Korean (TOPIK 1–4) with structured lessons, SRS, and real content.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  )
}
