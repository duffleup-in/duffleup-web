'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export type NavLink = { label: string; href: string }

export type SiteNavProps = {
  links?: NavLink[]
  /** CTA cluster on the right. Defaults to the two brand CTAs. */
  actions?: React.ReactNode
  className?: string
}

const defaultLinks: NavLink[] = [
  { label: 'Stays', href: '/properties' },
  { label: 'Moods', href: '/#moods' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'For owners', href: '/list-your-property' },
]

const DefaultActions = (
  <>
    <Button asChild variant="ghost" size="sm">
      <Link href="/list-your-property">Got a place?</Link>
    </Button>
    <Button asChild variant="primary" size="sm">
      <Link href="/properties">Pack my duffle</Link>
    </Button>
  </>
)

export function SiteNav({ links = defaultLinks, actions = DefaultActions, className }: SiteNavProps) {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 border-b border-line bg-white py-4 transition-shadow',
        scrolled && 'shadow-sm',
        className
      )}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="inline-flex items-center leading-none" aria-label="duffleup home">
          <Logo size="xs" className="!max-w-[120px]" />
        </Link>

        <ul className="hidden gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-utility text-base uppercase tracking-[0.08em] text-pitch no-underline transition-colors hover:text-hyperpurple"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">{actions}</div>

        <button
          type="button"
          className="flex items-center md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-utility text-subh uppercase tracking-[0.08em] text-pitch no-underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">{actions}</div>
        </div>
      )}
    </nav>
  )
}
