// Frontend mirror of duffleup-api/src/mood/dto/mood-config.dto.ts
// (public mood-config response, Phase 2.5.5). Sync manually when the backend
// DTO changes.
//
// Verified against the live prod response at
// https://api.duffleup.in/api/v1/mood-config on 2026-07-19.

/** Backend `Mood` Prisma enum. Uppercase — distinct from the lowercase UI
 * `Mood` union in components/ui/Chip. */
export type MoodKey =
  | 'CHILL'
  | 'ROMANCE'
  | 'ADVENTURE'
  | 'RESET'
  | 'BASH'
  | 'PETS'

export interface MoodProfileConfig {
  mood: MoodKey
  calloutText: string
  heroImageUrl: string | null
  featuredPropertyId: string | null
  tileOrder: number
  contextCopy: string
}

export interface MoodContextConfig {
  mood: MoodKey
  tagKey: string
  guestLabel: string
  defaultGuests: number | null
  displayOrder: number
}

export interface MoodConfigResponse {
  moodProfiles: MoodProfileConfig[]
  moodContexts: MoodContextConfig[]
}
