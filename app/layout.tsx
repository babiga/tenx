import type { Metadata } from 'next'
import { Playfair_Display, Montserrat, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tenx Catering | Crafted for Unforgettable Moments',
  description: 'Premium high-end catering for private events, corporate functions, and VIP occasions.',
  openGraph: {
    title: 'Tenx Catering | Crafted for Unforgettable Moments',
    description: 'Premium high-end catering for private events, corporate functions, and VIP occasions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tenx Catering',
    description: 'Premium luxury catering services.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mn">
      <body className={`${playfair.variable} ${montserrat.variable} ${inter.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
