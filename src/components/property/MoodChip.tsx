import type { MoodKey } from '@/lib/api/types/mood-config'
import { moodDisplayName } from '@/lib/moods/normalize'
import { cn } from '@/lib/cn'

// Sticker-treated mood pill for PropertyCard. Deliberately NOT the ui/Chip
// component — that pill has a subtle line border and no sticker shadow. This
// carries the StickerMoodCard language (black border + shadow-pop) at chip size.
// Colour map mirrors StickerMoodCard.moodStyles / ui/Chip, keyed by backend MoodKey.
const MOOD_STYLES: Record<MoodKey, string> = {
  ROMANCE: 'bg-slap-pink text-white',
  CHILL: 'bg-plasma text-pitch',
  BASH: 'bg-acid text-pitch',
  PETS: 'bg-pets text-white',
  FAMILY: 'bg-info text-white',
  ADVENTURE: 'bg-solar text-white',
  WORKATION: 'bg-hyperpurple text-white',
  WELLNESS: 'bg-success text-white',
}

export function MoodChip({ mood, className }: { mood: MoodKey; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xsm border-2 border-pitch px-2 py-0.5',
        // 2px sticker shadow — the config's `pop` (6px) is too heavy at chip size.
        'font-utility text-[11px] uppercase leading-none tracking-[0.08em] shadow-[2px_2px_0_#0A0A0A]',
        MOOD_STYLES[mood] ?? MOOD_STYLES.CHILL,
        className
      )}
    >
      {moodDisplayName(mood)}
    </span>
  )
}
