import type { MoodKey } from '@/lib/api/types/mood-config'

/** All valid backend mood keys. Mirrors the `MoodKey` union in mood-config.ts. */
export const MOOD_KEYS: MoodKey[] = [
  'CHILL',
  'ROMANCE',
  'ADVENTURE',
  'RESET',
  'BASH',
  'PETS',
]

/**
 * Converts a backend uppercase MoodKey to its lowercase URL/UI form.
 * Case boundary lives here (SP-F1 Phase A design decision 3).
 */
export const moodKeyToLower = (key: MoodKey): string => key.toLowerCase()

/**
 * Converts a lowercase URL/UI mood string back to a backend MoodKey.
 * Throws if the input isn't a valid MoodKey.
 */
export const lowerToMoodKey = (lower: string): MoodKey => {
  const upper = lower.toUpperCase() as MoodKey
  if (!MOOD_KEYS.includes(upper)) {
    throw new Error(`Invalid mood key: ${lower}`)
  }
  return upper
}
