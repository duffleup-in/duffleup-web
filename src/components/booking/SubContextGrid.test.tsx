import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SubContextGrid, tagKeyToSub } from './SubContextGrid'
import type { MoodContextConfig } from '@/lib/api/types/mood-config'

const chillContexts: MoodContextConfig[] = [
  { mood: 'CHILL', tagKey: 'chill.solo', guestLabel: 'Solo restore', defaultGuests: 1, displayOrder: 1 },
  { mood: 'CHILL', tagKey: 'chill.couple', guestLabel: 'Couple wind-down', defaultGuests: 2, displayOrder: 2 },
  { mood: 'CHILL', tagKey: 'chill.offgrid', guestLabel: 'Off-grid quiet', defaultGuests: null, displayOrder: 3 },
]

describe('tagKeyToSub', () => {
  it('strips the mood prefix to match the search URL contract', () => {
    expect(tagKeyToSub('chill.solo')).toBe('solo')
    expect(tagKeyToSub('romance.justbecause')).toBe('justbecause')
  })
})

describe('SubContextGrid', () => {
  const renderGrid = (props = {}) =>
    render(
      <SubContextGrid
        contexts={chillContexts}
        moodKey="CHILL"
        onSelect={vi.fn()}
        onSkip={vi.fn()}
        {...props}
      />
    )

  it('renders the three context tiles using backend guestLabel copy', () => {
    renderGrid()
    expect(screen.getByText('Solo restore')).toBeInTheDocument()
    expect(screen.getByText('Couple wind-down')).toBeInTheDocument()
    expect(screen.getByText('Off-grid quiet')).toBeInTheDocument()
  })

  it('calls onSelect with the bare tagKey suffix', async () => {
    const onSelect = vi.fn()
    renderGrid({ onSelect })

    await userEvent.click(screen.getByText('Couple wind-down'))

    expect(onSelect).toHaveBeenCalledWith('couple')
  })

  it('calls onSkip with the mood key from the skip CTA', async () => {
    const onSkip = vi.fn()
    renderGrid({ onSkip })

    await userEvent.click(screen.getByText(/see all chill stays/i))

    expect(onSkip).toHaveBeenCalledWith('CHILL')
  })

  it('orders tiles by displayOrder', () => {
    renderGrid({ contexts: [chillContexts[2], chillContexts[0], chillContexts[1]] })

    const labels = screen
      .getAllByRole('button')
      .slice(0, 3)
      .map((b) => b.textContent)
    expect(labels).toEqual(['Solo restore', 'Couple wind-down', 'Off-grid quiet'])
  })

  it('highlights the selected sub-context', () => {
    renderGrid({ selected: 'offgrid' })
    expect(screen.getByText('Off-grid quiet')).toHaveClass('border-acid')
  })
})
