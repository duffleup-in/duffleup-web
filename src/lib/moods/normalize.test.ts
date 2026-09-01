import { describe, it, expect } from 'vitest'
import { moodKeyToLower, lowerToMoodKey, moodDisplayName, MOOD_KEYS } from './normalize'

describe('moodKeyToLower', () => {
  it('lowercases a backend mood key', () => {
    expect(moodKeyToLower('CHILL')).toBe('chill')
    expect(moodKeyToLower('WORKATION')).toBe('workation')
  })
})

describe('lowerToMoodKey', () => {
  it('uppercases a valid lowercase mood string', () => {
    expect(lowerToMoodKey('chill')).toBe('CHILL')
    expect(lowerToMoodKey('workation')).toBe('WORKATION')
    expect(lowerToMoodKey('romance')).toBe('ROMANCE')
  })

  it('throws on an invalid mood string', () => {
    expect(() => lowerToMoodKey('invalid')).toThrow(/invalid mood key/i)
  })
})

describe('moodDisplayName', () => {
  it('title cases all 8 canonical moods', () => {
    expect(MOOD_KEYS).toHaveLength(8)
    expect(moodDisplayName('ROMANCE')).toBe('Romance')
    expect(moodDisplayName('CHILL')).toBe('Chill')
    expect(moodDisplayName('BASH')).toBe('Bash')
    expect(moodDisplayName('PETS')).toBe('Pets')
    expect(moodDisplayName('FAMILY')).toBe('Family')
    expect(moodDisplayName('ADVENTURE')).toBe('Adventure')
    expect(moodDisplayName('WORKATION')).toBe('Workation')
    expect(moodDisplayName('WELLNESS')).toBe('Wellness')
  })
})
