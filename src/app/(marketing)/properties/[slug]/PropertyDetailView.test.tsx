import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PropertyDetailView } from './PropertyDetailView'
import { mockProperty, mockUnit } from '@/components/property/test-fixtures'
import type { PropertyDetail } from '@/lib/api/types/property'

const detail = (over: Partial<PropertyDetail> = {}): PropertyDetail =>
  ({ ...mockProperty(), ...over } as PropertyDetail)

describe('PropertyDetailView', () => {
  it('renders the property name, location, and amenities', () => {
    render(
      <PropertyDetailView
        property={detail({ amenities: ['Wifi', 'Pool'], area: 'Lonavala', state: 'MH' })}
      />
    )
    expect(screen.getByRole('heading', { name: 'Fog & Pine', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Lonavala, MH')).toBeInTheDocument()
    expect(screen.getByText('Wifi')).toBeInTheDocument()
    expect(screen.getByText('Pool')).toBeInTheDocument()
  })

  it('lists each unit and lets the user pick one', async () => {
    render(
      <PropertyDetailView
        property={detail({
          units: [
            mockUnit({ id: 'u1', name: 'Garden Suite', currentRate: 8400 }),
            mockUnit({ id: 'u2', name: 'Loft', currentRate: 6200 }),
          ],
        })}
      />
    )

    const loft = screen.getByRole('button', { name: /loft/i })
    expect(loft).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(loft)
    expect(loft).toHaveAttribute('aria-pressed', 'true')
  })

  it('points the Book now CTA at the collector with property + unit params', () => {
    render(
      <PropertyDetailView
        property={detail({ slug: 'fog-and-pine', units: [mockUnit({ id: 'u9' })] })}
      />
    )
    const cta = screen.getByRole('link', { name: /book now/i })
    expect(cta).toHaveAttribute('href', '/collect?property=fog-and-pine&unit=u9')
  })

  it('renders mood chips for the property units', () => {
    render(
      <PropertyDetailView
        property={detail({ units: [mockUnit({ moods: ['CHILL', 'ADVENTURE'] })] })}
      />
    )
    // Chips appear both in the header and on the unit card; assert presence.
    expect(screen.getAllByText('Chill').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Adventure').length).toBeGreaterThan(0)
  })

  it('shows a photos-coming placeholder when there are no images', () => {
    render(<PropertyDetailView property={detail({ photos: [], coverPhoto: null })} />)
    expect(screen.getByText(/photos coming/i)).toBeInTheDocument()
  })
})
