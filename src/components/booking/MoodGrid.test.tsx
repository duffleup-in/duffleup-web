import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MoodGrid } from './MoodGrid'
import type { MoodKey, MoodProfileConfig } from '@/lib/api/types/mood-config'

const KEYS: MoodKey[] = ['ROMANCE', 'CHILL', 'BASH', 'PETS', 'FAMILY', 'ADVENTURE', 'WORKATION', 'WELLNESS']

const profiles: MoodProfileConfig[] = KEYS.map((mood, i) => ({
  mood,
  calloutText: `${mood} callout`,
  heroImageUrl: null,
  featuredPropertyId: null,
  tileOrder: i + 1,
  contextCopy: `${mood} context`,
}))

describe('MoodGrid', () => {
  it('renders all eight mood tiles with title-cased names', () => {
    render(<MoodGrid moods={profiles} onSelect={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(8)
    expect(screen.getByText('Romance')).toBeInTheDocument()
    expect(screen.getByText('Chill')).toBeInTheDocument()
    expect(screen.getByText('Bash')).toBeInTheDocument()
    expect(screen.getByText('Pets')).toBeInTheDocument()
    expect(screen.getByText('Family')).toBeInTheDocument()
    expect(screen.getByText('Adventure')).toBeInTheDocument()
    expect(screen.getByText('Workation')).toBeInTheDocument()
    expect(screen.getByText('Wellness')).toBeInTheDocument()
  })

  it('calls onSelect with the backend MoodKey', async () => {
    const onSelect = vi.fn()
    render(<MoodGrid moods={profiles} onSelect={onSelect} />)

    await userEvent.click(screen.getByText('Workation'))

    expect(onSelect).toHaveBeenCalledWith('WORKATION')
  })

  it('orders tiles by tileOrder, not array order', () => {
    // WELLNESS (tileOrder 8), ROMANCE (1), PETS (4) — fed in deliberately out of order.
    const shuffled = [profiles[7], profiles[0], profiles[3]]
    render(<MoodGrid moods={shuffled} onSelect={vi.fn()} />)

    const names = screen.getAllByRole('button').map((b) => b.textContent)
    expect(names[0]).toContain('Romance')
    expect(names[1]).toContain('Pets')
    expect(names[2]).toContain('Wellness')
  })

  it('highlights the selected mood so a back-step shows the prior choice', () => {
    render(<MoodGrid moods={profiles} selected="BASH" onSelect={vi.fn()} />)

    const bash = screen.getByText('Bash').closest('button')
    expect(bash?.firstElementChild).toHaveClass('outline-acid')
  })
})
