import type { MoodKey } from '@/lib/api/types/mood-config'

/**
 * Converts a backend uppercase MoodKey to its lowercase URL/UI form.
 * Case boundary lives here (SP-F1 Phase A design decision 3).
 */
export const moodKeyToLower = (key: MoodKey): string => key.toLowerCase()

/**
 * Converts a lowercase URL/UI mood string back to a backend MoodKey.
 * Validation against known moods belongs at the API/backend level, not here.
 */
export const lowerToMoodKey = (lower: string): MoodKey => lower.toUpperCase()
