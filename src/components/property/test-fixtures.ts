import type { PublicProperty, PublicUnit } from '@/lib/api/types/property'
import type { MoodKey } from '@/lib/api/types/mood-config'

export function mockUnit(over: Partial<PublicUnit> = {}): PublicUnit {
  return {
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
    ...over,
  }
}

export function mockProperty(over: Partial<PublicProperty> = {}): PublicProperty {
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
    units: [mockUnit()],
    totalUnits: 1,
    bookableUnitCount: 1,
    createdAt: '2026-01-01T00:00:00Z',
    ...over,
  }
}

export const withMoods = (...moods: MoodKey[]): PublicProperty =>
  mockProperty({ units: moods.map((m, i) => mockUnit({ id: `u${i}`, moods: [m] })) })
