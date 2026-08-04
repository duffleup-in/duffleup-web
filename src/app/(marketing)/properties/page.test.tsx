import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { PublicProperty } from '@/lib/api/types/property'

// Stub the data layer so the Server Component test stays a pure render check
// (the real fetch + param mapping is covered in properties.test.ts).
vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/api')>('@/lib/api')
  return { ...actual, getProperties: vi.fn() }
})

import PropertiesPage from './page'
import { getProperties } from '@/lib/api'

function mockProperty(over: Partial<PublicProperty> = {}): PublicProperty {
  return {
    id: 'p1',
    slug: 'fog-and-pine',
    displayName: 'Fog & Pine',
    description: null,
    propertyType: 'VILLA',
    city: 'Lonavala',
    state: 'MH',
    country: 'India',
    area: 'Lonavala',
    photos: [],
    coverPhoto: null,
    amenities: [],
    priceFrom: 8400,
    isPublished: true,
    tier: 'REAL',
    petsAllowed: false,
    featuredRank: null,
    units: [
      {
        id: 'u1',
        name: 'Suite',
        unitType: 'suite',
        description: null,
        baseOccupancy: 2,
        maxOccupancy: 4,
        amenities: [],
        photos: [],
        currentRate: 8400,
        hasActiveRates: true,
        moods: ['CHILL'],
        contextTags: [],
      },
    ],
    totalUnits: 1,
    bookableUnitCount: 1,
    createdAt: '2026-01-01T00:00:00Z',
    ...over,
  }
}

describe('PropertiesPage (B.2 grid)', () => {
  it('renders a card per result from the search', async () => {
    vi.mocked(getProperties).mockResolvedValue({
      data: [
        mockProperty(),
        mockProperty({ id: 'p2', slug: 'twin-villa', displayName: 'Twin Villa' }),
      ],
      meta: { total: 2, page: 1, limit: 20, totalPages: 1 },
    })

    render(await PropertiesPage({ searchParams: { mood: 'chill' } }))

    expect(screen.getByText('Fog & Pine')).toBeInTheDocument()
    expect(screen.getByText('Twin Villa')).toBeInTheDocument()
  })

  it('shows an error message when the search throws', async () => {
    vi.mocked(getProperties).mockRejectedValue(new Error('boom'))

    render(await PropertiesPage({ searchParams: {} }))

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('renders no cards but no error when the result set is empty', async () => {
    vi.mocked(getProperties).mockResolvedValue({
      data: [],
      meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
    })

    render(await PropertiesPage({ searchParams: { mood: 'pets' } }))

    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
  })
})
