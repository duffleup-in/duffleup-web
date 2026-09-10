import type { MoodKey } from '@/lib/api/types/mood-config'
import { cn } from '@/lib/cn'

// Per-key colour map — styling, not data. Unknown keys fall back to a neutral style.
const MOOD_STYLES: Record<string, string> = {
  ROMANCE: 'bg-slap-pink text-white',
  CHILL: 'bg-plasma text-pitch',
  BASH: 'bg-acid text-pitch',
  PETS: 'bg-pets text-white',
  FAMILY: 'bg-warning text-pitch',
  ADVENTURE: 'bg-solar text-white',
  WORKATION: 'bg-hyperpurple text-white',
  WELLNESS: 'bg-success text-white',
}

const DEFAULT_STYLE = 'bg-sterling text-pitch'

export function MoodChip({
  mood,
  displayName,
  className,
}: {
  mood: MoodKey
  displayName?: string
  className?: string
}) {
  const label = displayName ?? ''
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xsm border-2 border-pitch px-2 py-0.5',
        'font-utility text-[11px] uppercase leading-none tracking-[0.08em] shadow-[2px_2px_0_#0A0A0A]',
        MOOD_STYLES[mood] ?? DEFAULT_STYLE,
        className
      )}
    >
      {label}
    </span>
  )
}
