import type { Metadata } from 'next'
import { Bungee, Bebas_Neue } from 'next/font/google'
import './globals.css'
import { SiteNav } from '@/components/marketing/SiteNav'
import { Footer } from '@/components/marketing/Footer'

const bungee = Bungee({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bungee',
  display: 'swap',
})

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
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
    <html lang="en" className={`${bungee.variable} ${bebas.variable}`}>
      <body className="font-body bg-sterling-warm text-pitch antialiased">
        <SiteNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
