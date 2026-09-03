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
    expect(screen.getByText('Chill')).toBeInTheDocument()
    expect(screen.getByText('Adventure')).toBeInTheDocument()
  })

  it('calls onSelect with the backend MoodKey', async () => {
    const onSelect = vi.fn()
    render(<MoodGrid moods={profiles} onSelect={onSelect} />)

    await userEvent.click(screen.getByText('Romance'))

    expect(onSelect).toHaveBeenCalledWith('ROMANCE')
  })

  it('orders tiles by tileOrder, not array order', () => {
    // profiles[3]=Pets(order 4), profiles[0]=Romance(1), profiles[5]=Adventure(6)
    const shuffled = [profiles[3], profiles[0], profiles[5]]
    render(<MoodGrid moods={shuffled} onSelect={vi.fn()} />)

    const names = screen.getAllByRole('button').map((b) => b.textContent)
    expect(names[0]).toContain('Romance')
    expect(names[1]).toContain('Pets')
    expect(names[2]).toContain('Adventure')
  })

  it('highlights the selected mood so a back-step shows the prior choice', () => {
    render(<MoodGrid moods={profiles} selected="BASH" onSelect={vi.fn()} />)

    const bash = screen.getByText('Bash').closest('button')
    expect(bash?.firstElementChild).toHaveClass('outline-acid')
  })
})
