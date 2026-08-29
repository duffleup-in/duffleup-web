import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the low-level client so we can assert the exact path getProperties builds.
const apiFetch = vi.fn()
vi.mock('./client', () => ({ apiFetch: (...args: unknown[]) => apiFetch(...args) }))

import { getProperties, getPropertyBySlug, mapIntentParamsToSearch } from './properties'

describe('mapIntentParamsToSearch', () => {
  it('maps mood (singular, lowercase) to moods[] (uppercase)', () => {
    expect(mapIntentParamsToSearch({ mood: 'chill' }).moods).toEqual(['CHILL'])
  })

  it('renames checkin/checkout to checkIn/checkOut and passes sub through', () => {
    const out = mapIntentParamsToSearch({
      mood: 'romance',
      sub: 'anniversary',
      checkin: '2026-08-05',
      checkout: '2026-08-08',
    })
    expect(out).toMatchObject({
      moods: ['ROMANCE'],
      sub: 'anniversary',
      checkIn: '2026-08-05',
      checkOut: '2026-08-08',
    })
  })

  it('counts adults + children as guests but treats infants as free', () => {
    expect(
      mapIntentParamsToSearch({ adults: 2, children: 1, infants: 1 }).guests
    ).toBe(3)
  })

  it('omits guests when the total is zero', () => {
    expect(mapIntentParamsToSearch({}).guests).toBeUndefined()
  })
})

describe('getProperties', () => {
  beforeEach(() => {
    apiFetch.mockReset()
    apiFetch.mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } })
  })

  it('hits the /search endpoint, not /properties', async () => {
    await getProperties({})
    expect(apiFetch).toHaveBeenCalledWith('/search', undefined)
  })

  it('serializes moods as a comma list and renames guest/date params', async () => {
    await getProperties({ moods: ['CHILL', 'FAMILY'], guests: 3, checkIn: '2026-08-05', limit: 3 })
    const [path] = apiFetch.mock.calls[0]
    expect(path).toContain('moods=CHILL%2CFAMILY')
    expect(path).toContain('guests=3')
    expect(path).toContain('checkIn=2026-08-05')
    expect(path).toContain('limit=3')
  })

  it('returns the backend list envelope unchanged', async () => {
    apiFetch.mockResolvedValue({
      data: [{ displayName: 'Waterrock' }],
      meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
    })
    const res = await getProperties({ moods: ['CHILL'] })
    expect(res.meta.total).toBe(1)
    expect(res.data[0].displayName).toBe('Waterrock')
  })
})

describe('getPropertyBySlug', () => {
  beforeEach(() => {
    apiFetch.mockReset()
    apiFetch.mockResolvedValue({ slug: 'fog-and-pine', displayName: 'Fog & Pine' })
  })

  it('hits the /properties/slug/:slug detail endpoint', async () => {
    await getPropertyBySlug('fog-and-pine')
    expect(apiFetch).toHaveBeenCalledWith('/properties/slug/fog-and-pine', undefined)
  })

  it('URL-encodes the slug', async () => {
    await getPropertyBySlug('a b/c')
    const [path] = apiFetch.mock.calls[0]
    expect(path).toBe('/properties/slug/a%20b%2Fc')
  })

  it('returns the backend detail payload', async () => {
    const res = await getPropertyBySlug('fog-and-pine')
    expect(res.displayName).toBe('Fog & Pine')
  })
})
