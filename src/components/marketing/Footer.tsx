import * as React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/cn'

type FooterColumn = { title: string; links: { label: string; href: string }[] }

export type FooterProps = {
  columns?: FooterColumn[]
  className?: string
}

const defaultColumns: FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Stays', href: '/properties' },
      { label: 'Moods', href: '/#moods' },
      { label: 'How it works', href: '/how-it-works' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'For owners', href: '/list-your-property' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
]

export function Footer({ columns = defaultColumns, className }: FooterProps) {
  return (
    <footer className={cn('bg-pitch pb-6 pt-12 text-white', className)}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center leading-none" aria-label="duffleup home">
              <Logo size="xxs" className="!max-w-[75px]" />
            </Link>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/70">
              Verified stays across Maharashtra. Built by someone who understands the
              real pain — both sides of the WhatsApp thread.
            </p>
            <p className="mt-4 font-utility text-base uppercase tracking-[0.15em] text-white/70">
              Pay. Pack. Go.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 font-utility text-subtitle uppercase tracking-[0.15em] text-acid">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-white/70 no-underline transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-white/10 pt-4 text-[13px] text-white/50 sm:flex-row">
          <span>© 2026 Duffleup</span>
          <span>Maharashtra, India</span>
        </div>
      </div>
    </footer>
  )
}
