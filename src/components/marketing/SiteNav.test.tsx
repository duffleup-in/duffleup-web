import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { MoodKey } from '@/lib/api/types/mood-config'
import { SiteNav } from './SiteNav'

const KEYS: MoodKey[] = ['CHILL', 'ROMANCE', 'ADVENTURE', 'RESET', 'BASH', 'PETS']

// The collector's skip-to-search calls useRouter, which needs an App Router
// context that jsdom has no way to provide.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}))

// The collector fetches its config client-side (A.2 R3), so stub the boundary
// rather than letting jsdom attempt a real request.
vi.mock('@/lib/api', () => ({
  getMoodConfig: vi.fn(async () => ({
    moodProfiles: KEYS.map((mood, i) => ({
      mood,
      calloutText: `${mood} callout`,
      heroImageUrl: null,
      featuredPropertyId: null,
      tileOrder: i + 1,
      contextCopy: `${mood} context`,
    })),
    moodContexts: KEYS.flatMap((mood) =>
      [1, 2, 3].map((n) => ({
        mood,
        tagKey: `${mood.toLowerCase()}.opt${n}`,
        guestLabel: `${mood} option ${n}`,
        defaultGuests: null,
        displayOrder: n,
      }))
    ),
  })),
}))

describe('SiteNav', () => {
  it('renders the Pack my duffle CTA as a button, not a /properties link', () => {
    render(<SiteNav />)

    // Rendered twice by design — desktop cluster + burger menu — so assert on
    // the set rather than a single node.
    const ctas = screen.getAllByRole('button', { name: /pack my duffle/i })
    expect(ctas.length).toBeGreaterThan(0)
    ctas.forEach((cta) => expect(cta.tagName).toBe('BUTTON'))

    expect(
      screen.queryByRole('link', { name: /pack my duffle/i })
    ).not.toBeInTheDocument()
  })

  it('opens the intent collector at step 1 when the CTA is clicked', async () => {
    render(<SiteNav />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(
      screen.getAllByRole('button', { name: /pack my duffle/i })[0]
    )

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(
      await screen.findByText(/step 1 of 4 · mood/i)
    ).toBeInTheDocument()
    expect(await screen.findByText('Chill')).toBeInTheDocument()
  })

  it('dismisses the burger menu when the collector opens, and leaves it closed', async () => {
    render(<SiteNav />)

    const burger = screen.getByRole('button', { name: /open menu/i })
    await userEvent.click(burger)
    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    )

    // The burger copy of the CTA is the last one in DOM order.
    const ctas = screen.getAllByRole('button', { name: /pack my duffle/i })
    await userEvent.click(ctas[ctas.length - 1])

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    // Radix marks the rest of the page aria-hidden while the dialog is open,
    // so the nav has to be queried with `hidden: true` from here on.
    expect(
      screen.getByRole('button', { name: /open menu/i, hidden: true })
    ).toHaveAttribute('aria-expanded', 'false')

    // Closing the collector must not resurrect the menu.
    await userEvent.click(screen.getByRole('button', { name: /^close$/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /open menu/i, hidden: true })
    ).toHaveAttribute('aria-expanded', 'false')
  })

  it('mounts a single collector instance for the whole nav', async () => {
    render(<SiteNav />)

    await userEvent.click(
      screen.getAllByRole('button', { name: /pack my duffle/i })[0]
    )

    expect(await screen.findAllByRole('dialog')).toHaveLength(1)
  })

  it('keeps the owner CTA pointing at the intake page', () => {
    render(<SiteNav />)
    const owner = screen.getAllByRole('link', { name: /got a place\?/i })[0]
    expect(owner).toHaveAttribute('href', '/list-your-property')
  })
})
