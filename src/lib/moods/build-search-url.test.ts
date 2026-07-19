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
    })
    expect(url).toBe(
      '/properties?mood=chill&sub=solo&checkin=2026-08-05&checkout=2026-08-08&adults=2&children=0'
    )
  })

  it('omits mood, sub, and dates when unset but always includes guests', () => {
    expect(buildSearchUrl(initialIntentState)).toBe('/properties?adults=1&children=0')
  })
})
