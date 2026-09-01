'use client'

import { StickerMoodCard } from '@/components/marketing/StickerMoodCard'
import type { Mood } from '@/components/ui/Chip'
import type { MoodKey, MoodProfileConfig } from '@/lib/api/types/mood-config'
import { moodDisplayName, moodKeyToLower } from '@/lib/moods/normalize'

export type MoodGridProps = {
  moods: MoodProfileConfig[]
  /** Highlighted when the user steps back to this screen (design decision 8). */
  selected?: MoodKey | null
  onSelect: (mood: MoodKey) => void
}

// Canonical implementation lives in lib/moods/normalize alongside the label
// overrides; re-exported here so existing call sites keep their import path.
export { moodDisplayName }

/**
 * Step 1 of the intent collector — the eight mood tiles, reusing the home page's
 * StickerMoodCard so the modal and the home grid read as the same surface.
 * 2×4 on mobile, 4×2 from `sm` up.
 */
export function MoodGrid({ moods, selected, onSelect }: MoodGridProps) {
  const ordered = [...moods].sort((a, b) => a.tileOrder - b.tileOrder)

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
