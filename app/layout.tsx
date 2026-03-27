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
  title: {
    default: 'Tattvasudhā — तत्त्वसुधा',
    template: '%s | Tattvasudhā',
  },
  description: 'A jñānayajña platform for mastering Veda & śāstra through Dvaita Siddhānta.',
  openGraph: {
    title: 'Tattvasudhā — तत्त्वसुधा',
    description: 'A jñānayajña platform for mastering Veda & śāstra through Dvaita Siddhānta.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sa" className={`${inter.variable} ${devanagari.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
