import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PropertyCard } from './PropertyCard'
import { mockProperty, withMoods } from './test-fixtures'

const PHOTOS = [
  'https://images.unsplash.com/a',
  'https://images.unsplash.com/b',
  'https://images.unsplash.com/c',
]

describe('PropertyCard', () => {
  it('renders displayName, location, and a Starts at price', () => {
    render(<PropertyCard property={mockProperty({ area: 'Lonavala', state: 'MH', priceFrom: 8400 })} />)

    expect(screen.getByText('Fog & Pine')).toBeInTheDocument()
    expect(screen.getByText('Lonavala, MH')).toBeInTheDocument()
    expect(screen.getByText(/Starts at ₹8,400/)).toBeInTheDocument()
  })

  it('links to the property detail route', () => {
    render(<PropertyCard property={mockProperty({ slug: 'fog-and-pine' })} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/properties/fog-and-pine')
  })

  it('renders one sticker chip per distinct unit mood, de-duplicated', () => {
    render(<PropertyCard property={withMoods('CHILL', 'FAMILY', 'CHILL')} />)
    expect(screen.getByText('Chill')).toBeInTheDocument()
    expect(screen.getByText('Family')).toBeInTheDocument()
    expect(screen.getAllByText('Chill')).toHaveLength(1)
  })

  it('returns null (renders nothing) when priceFrom is null', () => {
    const { container } = render(<PropertyCard property={mockProperty({ priceFrom: null })} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows a placeholder and no dots when there are no photos', () => {
    render(<PropertyCard property={mockProperty({ photos: [] })} />)
    expect(screen.getByText(/photo coming/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /photo/i })).not.toBeInTheDocument()
  })

  it('advances the carousel with the next arrow', async () => {
    render(<PropertyCard property={mockProperty({ photos: PHOTOS })} />)

    // First photo: only Next is shown (no Previous at index 0).
    expect(screen.queryByRole('button', { name: /previous photo/i })).not.toBeInTheDocument()
    const next = screen.getByRole('button', { name: /next photo/i })

    await userEvent.click(next)

    // After advancing, Previous appears.
    expect(screen.getByRole('button', { name: /previous photo/i })).toBeInTheDocument()
    expect(screen.getByAltText(/photo 2/i)).toBeInTheDocument()
  })

  it('caps the carousel at five photos', () => {
    const many = Array.from({ length: 8 }, (_, i) => `https://images.unsplash.com/${i}`)
    render(<PropertyCard property={mockProperty({ photos: many })} />)
    // One dot per shown photo; capped at 5.
    const dots = document.querySelectorAll('span.rounded-pill')
    expect(dots.length).toBe(5)
  })
})
