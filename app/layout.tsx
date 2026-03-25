import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Noto_Sans_Devanagari } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const devanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-devanagari',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Śāstra Adhyayana',
  description: 'Learn Sanskrit philosophical texts with AI guidance',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sa" className={`${inter.variable} ${devanagari.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
