import { describe, it, expect } from 'vitest'
import { buildSearchUrl } from './build-search-url'
import { initialIntentState } from './intent-state'

describe('buildSearchUrl', () => {
  it('serializes a fully collected intent', () => {
    const url = buildSearchUrl({
      step: 'guests',
      mood: 'CHILL',
      sub: 'SOLO',
      checkin: new Date('2026-08-05T00:00:00Z'),
      checkout: new Date('2026-08-08T00:00:00Z'),
      adults: 2,
      children: 0,
      infants: 0,
    })
    expect(url).toBe(
      '/properties?mood=chill&sub=solo&checkin=2026-08-05&checkout=2026-08-08&adults=2&children=0&infants=0'
    )
  })

  it('formats dates in local time, not UTC', () => {
    // Local-midnight dates are what react-day-picker produces. Under a naive
    // toISOString() these shift back a day in any positive-offset timezone
    // (e.g. IST); local formatting must keep the tapped calendar day.
    const url = buildSearchUrl({
      ...initialIntentState,
      checkin: new Date(2026, 6, 25), // 25 Jul 2026, local midnight
      checkout: new Date(2026, 6, 28),
    })
    expect(url).toContain('checkin=2026-07-25')
    expect(url).toContain('checkout=2026-07-28')
  })

  it('omits mood, sub, and dates when unset but always includes guests', () => {
    expect(buildSearchUrl(initialIntentState)).toBe(
      '/properties?adults=1&children=0&infants=0'
    )
  })
})
