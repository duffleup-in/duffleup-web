import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Duffleup — Offbeat Stays You Can Actually Trust',
    template: '%s | Duffleup',
  },
  description:
    'Discover verified offbeat stays across Maharashtra. Every property physically checked before listing. Built by an operator, not a tech company.',
  keywords: [
    'offbeat stays Maharashtra',
    'verified homestays India',
    'nature stays Maharashtra',
    'weekend getaways Pune Mumbai',
    'unique stays India',
    'eco stays Maharashtra',
  ],
  authors: [{ name: 'Duffleup' }],
  creator: 'Duffleup',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://duffleup.in',
    siteName: 'Duffleup',
    title: 'Duffleup — Offbeat Stays You Can Actually Trust',
    description:
      'Discover verified offbeat stays across Maharashtra. Every property physically checked before listing.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Duffleup — Offbeat Stays',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Duffleup — Offbeat Stays You Can Actually Trust',
    description: 'Verified offbeat stays across Maharashtra.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-dm bg-cream text-gray-800 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
