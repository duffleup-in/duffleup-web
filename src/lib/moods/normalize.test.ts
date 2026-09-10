import { describe, it, expect } from 'vitest'
import { moodKeyToLower, lowerToMoodKey } from './normalize'

describe('moodKeyToLower', () => {
  it('lowercases a backend mood key', () => {
    expect(moodKeyToLower('CHILL')).toBe('chill')
  })
})

describe('lowerToMoodKey', () => {
  it('uppercases a lowercase mood string', () => {
    expect(lowerToMoodKey('chill')).toBe('CHILL')
  })

  it('returns uppercase for any string — no longer throws on unknown moods', () => {
    expect(lowerToMoodKey('invalid')).toBe('INVALID')
  })
})
