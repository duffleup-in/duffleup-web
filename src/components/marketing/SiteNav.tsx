'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X, User, CalendarDays, LogOut, ChevronDown } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { IntentCollectorModal } from '@/components/booking/IntentCollectorModal'
import { useAuth } from '@/lib/auth/AuthProvider'
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

// ---------------------------------------------------------------------------
// Auth-aware user menu
// ---------------------------------------------------------------------------

function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = user?.firstName?.charAt(0) ?? user?.email?.charAt(0)?.toUpperCase() ?? 'U'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="w-7 h-7 rounded-full bg-acid text-pitch flex items-center justify-center text-xs font-bold uppercase">
          {initials}
        </span>
        <span className="hidden sm:block font-utility text-sm uppercase tracking-wider text-white max-w-[100px] truncate">
          {user?.firstName ?? 'Account'}
        </span>
        <ChevronDown size={14} className={cn('text-white/60 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded shadow-lg border border-line py-1 z-50">
          <Link
            href="/account/bookings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-pitch hover:bg-sterling-warm transition-colors"
          >
            <CalendarDays size={14} />
            My Bookings
          </Link>
          <Link
            href="/properties"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-pitch hover:bg-sterling-warm transition-colors"
          >
            <User size={14} />
            Browse stays
          </Link>
          <hr className="my-1 border-line" />
          <button
            onClick={() => { void logout(); setOpen(false) }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main SiteNav
// ---------------------------------------------------------------------------

export function SiteNav({ links = defaultLinks, actions, className }: SiteNavProps) {
  const { isAuthenticated, status } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [collectorOpen, setCollectorOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  const openCollector = () => {
    setCollectorOpen(true)
    setOpen(false)
  }

  // Build the right-side action cluster based on auth state
  const actionCluster = actions ?? (
    status === 'loading' ? (
      <div className="w-24 h-9 rounded bg-white/10 animate-pulse" />
    ) : isAuthenticated ? (
      <>
        <Button variant="primary" size="sm" onClick={openCollector}>
          Pack my duffle
        </Button>
        <UserMenu />
      </>
    ) : (
      <>
        <Button asChild variant="secondary" size="sm">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button variant="primary" size="sm" onClick={openCollector}>
          Pack my duffle
        </Button>
      </>
    )
  )

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

        <div className="hidden items-center gap-2 md:flex">{actionCluster}</div>

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
            {isAuthenticated && (
              <li>
                <Link
                  href="/account/bookings"
                  onClick={() => setOpen(false)}
                  className="font-utility text-subh uppercase tracking-[0.08em] text-acid no-underline"
                >
                  My Bookings
                </Link>
              </li>
            )}
          </ul>
          <div className="mt-4 flex flex-col gap-2">{actionCluster}</div>
        </div>
      )}

      <IntentCollectorModal open={collectorOpen} onOpenChange={setCollectorOpen} />
    </nav>
  )
}
