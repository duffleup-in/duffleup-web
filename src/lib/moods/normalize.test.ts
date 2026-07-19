import { describe, it, expect } from 'vitest'
import { moodKeyToLower, lowerToMoodKey } from './normalize'

describe('moodKeyToLower', () => {
  it('lowercases a backend mood key', () => {
    expect(moodKeyToLower('CHILL')).toBe('chill')
  })
})

describe('lowerToMoodKey', () => {
  it('uppercases a valid lowercase mood string', () => {
    expect(lowerToMoodKey('chill')).toBe('CHILL')
  })

  it('throws on an invalid mood string', () => {
    expect(() => lowerToMoodKey('invalid')).toThrow(/invalid mood key/i)
  })
})
