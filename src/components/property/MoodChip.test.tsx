import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MoodChip } from './MoodChip'

describe('MoodChip', () => {
  it('renders the mood key in title case', () => {
    render(<MoodChip mood="ROMANCE" />)
    expect(screen.getByText('Romance')).toBeInTheDocument()
  })

  it('applies the mood colour and sticker border', () => {
    render(<MoodChip mood="CHILL" />)
    const chip = screen.getByText('Chill')
    expect(chip).toHaveClass('bg-plasma')
    expect(chip).toHaveClass('border-pitch')
  })
})
