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

  it('keeps the owner CTA pointing at the intake page', () => {
    render(<SiteNav />)
    const owner = screen.getAllByRole('link', { name: /got a place\?/i })[0]
    expect(owner).toHaveAttribute('href', '/list-your-property')
  })
})
