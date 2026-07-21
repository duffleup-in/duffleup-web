'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { PackMyDuffleCta } from '@/components/marketing/PackMyDuffleCta'
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
    <Button asChild variant="secondary" size="sm">
      <Link href="/list-your-property">Got a place?</Link>
    </Button>
    <PackMyDuffleCta size="sm" />
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
        'sticky top-0 z-50 border-b border-pitch-soft bg-pitch transition-shadow',
        scrolled && 'shadow-sm',
        className
      )}
    >
      {/* Fixed-height band; the bleed logo overflows below it onto the hero. */}
      <div className="relative mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link
          href="/"
          className={cn(
            'relative z-20 inline-flex self-center leading-none',
            // Top of page on desktop only: pull flush to the container edge
            // (cancels the row's px-6 gutter) and top-align so the oversized
            // mark bleeds downward. Mobile keeps the gutter + contained 48px.
            !scrolled && 'md:-ml-6 md:self-start'
          )}
          aria-label="duffleup home"
        >
          {scrolled ? (
            <Logo size="nav" priority className="h-12 w-auto" />
          ) : (
            <Logo size="bleed-xl" priority className="h-[72px] w-auto md:h-[180px]" />
          )}
        </Link>

        <ul className="hidden gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-utility text-base uppercase tracking-[0.08em] text-white no-underline transition-colors hover:text-acid"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">{actions}</div>

        <button
          type="button"
          className="flex items-center text-white md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-pitch-soft bg-pitch px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-utility text-subh uppercase tracking-[0.08em] text-white no-underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* No dismiss-on-click here: closing the menu unmounts these actions,
              which would tear down the collector's state before it can open. */}
          <div className="mt-4 flex flex-col gap-2">{actions}</div>
        </div>
      )}
    </nav>
  )
}
