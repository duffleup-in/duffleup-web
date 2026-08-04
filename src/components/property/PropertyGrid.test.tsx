import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PropertyGrid } from './PropertyGrid'
import { mockProperty } from './test-fixtures'

describe('PropertyGrid', () => {
  it('renders skeletons (no cards) while loading', () => {
    const { container } = render(
      <PropertyGrid properties={[mockProperty()]} isLoading />
    )
    // Skeleton pulse blocks are present; no real card (no link) is rendered.
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders four skeletons (two hidden below md) when loading', () => {
    const { container } = render(<PropertyGrid properties={[]} isLoading />)
    // Four skeleton wrappers; the last two are md-only.
    expect(container.querySelectorAll('.hidden.md\\:block').length).toBe(2)
  })

  it('renders a card per property when not loading', () => {
    render(
      <PropertyGrid
        properties={[
          mockProperty({ id: 'a', slug: 'a', displayName: 'Alpha' }),
          mockProperty({ id: 'b', slug: 'b', displayName: 'Beta' }),
        ]}
      />
    )
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('drops null-price properties defensively', () => {
    render(
      <PropertyGrid
        properties={[
          mockProperty({ id: 'a', slug: 'a', displayName: 'Priced' }),
          mockProperty({ id: 'b', slug: 'b', displayName: 'Unpriced', priceFrom: null }),
        ]}
      />
    )
    expect(screen.getByText('Priced')).toBeInTheDocument()
    expect(screen.queryByText('Unpriced')).not.toBeInTheDocument()
  })
})
