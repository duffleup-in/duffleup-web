import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders the tier label', () => {
    render(<Badge tier="raw" />)
    expect(screen.getByText(/raw/i)).toBeInTheDocument()
  })

  it('applies the right color class per tier', () => {
    const { rerender } = render(<Badge tier="real" />)
    expect(screen.getByText(/real/i)).toHaveClass('bg-plasma')

    rerender(<Badge tier="rare" />)
    expect(screen.getByText(/rare/i)).toHaveClass('bg-acid')
  })

  it('shows the star for the rare tier only', () => {
    const { rerender } = render(<Badge tier="raw" />)
    expect(screen.queryByTestId('rare-star')).not.toBeInTheDocument()

    rerender(<Badge tier="rare" />)
    expect(screen.getByTestId('rare-star')).toBeInTheDocument()
  })
})
