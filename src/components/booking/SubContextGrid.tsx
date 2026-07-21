'use client'

import { cn } from '@/lib/cn'
import type { MoodContextConfig, MoodKey } from '@/lib/api/types/mood-config'
import { moodDisplayName } from './MoodGrid'

export type SubContextGridProps = {
  /** Already filtered to a single mood by the caller. */
  contexts: MoodContextConfig[]
  moodKey: MoodKey
  /** Highlighted when the user steps back to this screen (design decision 8). */
  selected?: string | null
  onSelect: (sub: string) => void
  onSkip: (mood: MoodKey) => void
}

/**
 * `tagKey` arrives mood-prefixed ("chill.solo") but the search URL contract is
 * the bare suffix (`?mood=chill&sub=solo`) — see build-search-url.ts. Adjudicated
 * in A.2 R2: state stores the suffix, the tagKey is reconstructible from both.
 */
export const tagKeyToSub = (tagKey: string): string =>
  tagKey.slice(tagKey.indexOf('.') + 1)

/**
 * Step 2 of the intent collector. Deliberately quieter than the mood stickers —
 * these are secondary refinements, so a plain bordered card, not a sticker.
 * 1×3 stacked on mobile, 3×1 from `sm` up.
 */
export function SubContextGrid({
  contexts,
  moodKey,
  selected,
  onSelect,
  onSkip,
}: SubContextGridProps) {
  const ordered = [...contexts].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ordered.map((context) => {
          const sub = tagKeyToSub(context.tagKey)
          return (
            <button
              key={context.tagKey}
              type="button"
              onClick={() => onSelect(sub)}
              className={cn(
                'rounded-md border-2 px-4 py-4 text-left font-utility text-subh uppercase tracking-[0.08em] transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2 focus-visible:ring-offset-pitch',
                selected === sub
                  ? 'border-acid bg-acid/10 text-acid'
                  : 'border-white/25 text-white hover:border-acid hover:text-acid'
              )}
            >
              {context.guestLabel}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => onSkip(moodKey)}
        className="mt-5 font-utility text-subtitle uppercase tracking-[0.12em] text-white/60 underline-offset-4 transition-colors hover:text-acid hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
      >
        See all {moodDisplayName(moodKey)} stays →
      </button>
    </div>
  )
}
