import type { Metadata, Viewport } from 'next'
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans_Condensed,
  Rubik_Mono_One,
} from 'next/font/google'
import './globals.css'

const display = Rubik_Mono_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rubik-mono',
})
const body = IBM_Plex_Sans_Condensed({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-plex-condensed',
})
const mono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  title: 'Fio Modular FM-6',
  description:
    'Fio Modular FM-6: seis módulos, nenhuma tela. O som muda conforme você liga os cabos.',
}

export const viewport: Viewport = {
  themeColor: '#101012',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
