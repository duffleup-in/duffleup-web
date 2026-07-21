'use client'

import { StickerMoodCard } from '@/components/marketing/StickerMoodCard'
import type { Mood } from '@/components/ui/Chip'
import type { MoodKey, MoodProfileConfig } from '@/lib/api/types/mood-config'
import { moodKeyToLower } from '@/lib/moods/normalize'

export type MoodGridProps = {
  moods: MoodProfileConfig[]
  /** Highlighted when the user steps back to this screen (design decision 8). */
  selected?: MoodKey | null
  onSelect: (mood: MoodKey) => void
}

/** "CHILL" → "Chill". The backend sends no display name, only the enum key. */
export const moodDisplayName = (key: MoodKey): string =>
  key.charAt(0) + key.slice(1).toLowerCase()

/**
 * Step 1 of the intent collector — the six mood tiles, reusing the home page's
 * StickerMoodCard so the modal and the home grid read as the same surface.
 * 2×3 on mobile, 3×2 from `sm` up.
 */
export function MoodGrid({ moods, selected, onSelect }: MoodGridProps) {
  const ordered = [...moods].sort((a, b) => a.tileOrder - b.tileOrder)

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {ordered.map((profile) => (
        <StickerMoodCard
          key={profile.mood}
          mood={moodKeyToLower(profile.mood) as Mood}
          name={moodDisplayName(profile.mood)}
          description={profile.calloutText}
          cta="Pick this →"
          onClick={() => onSelect(profile.mood)}
          compact
          className={
            selected === profile.mood
              ? 'rotate-0 -translate-y-1 shadow-pop-lg outline outline-4 outline-offset-4 outline-acid'
              : undefined
          }
        />
      ))}
    </div>
  )
}
