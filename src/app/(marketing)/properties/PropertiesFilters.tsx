'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { IntentSearchParams } from '@/lib/api'
import type { MoodKey, MoodProfileConfig } from '@/lib/api/types/mood-config'
import { moodKeyToLower } from '@/lib/moods/normalize'
import type { Mood } from '@/components/ui/Chip'

// Mood emoji map for compact display — covers the known 8 moods; unknown moods
// from future backend additions fall back to a neutral sparkle.
const MOOD_EMOJI: Record<string, string> = {
  ROMANCE: '💕',
  CHILL: '🌊',
  BASH: '🎉',
  PETS: '🐾',
  FAMILY: '👨‍👩‍👧',
  ADVENTURE: '🏔️',
  WORKATION: '💻',
  WELLNESS: '🧘',
}

// Mood chip colours — mirrors Chip.tsx moods but applied inline so we can
// support active vs inactive states without a separate component.
const MOOD_ACTIVE_CLASS: Record<Mood, string> = {
  romance: 'bg-slap-pink text-white border-slap-pink',
  chill: 'bg-plasma text-pitch border-plasma',
  bash: 'bg-acid text-pitch border-acid',
  pets: 'bg-pets text-white border-pets',
  family: 'bg-warning text-pitch border-warning',
  adventure: 'bg-solar text-white border-solar',
  workation: 'bg-hyperpurple text-white border-hyperpurple',
  wellness: 'bg-success text-white border-success',
}

export type PropertiesFiltersProps = {
  intent: IntentSearchParams
  moodProfiles: MoodProfileConfig[]
}

/**
 * Horizontal filter bar for the search results page. Reads the current URL
 * params from `intent` (passed by the Server Component) and updates params
 * via `router.push` so the page re-renders with fresh results without a full
 * navigation.
 */
export function PropertiesFilters({ intent, moodProfiles }: PropertiesFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pushParams = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined || value === '') {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      }
      router.push(`/properties?${next.toString()}`)
    },
    [router, searchParams]
  )

  const currentMood = intent.mood?.toUpperCase() as MoodKey | undefined
  const adults = intent.adults ?? 1

  const hasFilters =
    !!intent.checkin ||
    !!intent.checkout ||
    !!intent.mood ||
    (intent.adults != null && intent.adults !== 1)

  const clearAll = () => {
    router.push('/properties')
  }

  return (
    <div className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-line bg-white px-4 py-3 shadow-sm">
      {/* Check-in */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-checkin"
          className="font-utility text-caption uppercase tracking-[0.1em] text-pitch-soft"
        >
          Check-in
        </label>
        <input
          id="filter-checkin"
          type="date"
          defaultValue={intent.checkin ?? ''}
          onChange={(e) => pushParams({ checkin: e.target.value || undefined })}
          className={cn(
            'h-9 rounded-sm border border-line-strong bg-white px-3 font-body text-subtitle text-pitch',
            'hover:border-hyperpurple-75 focus:border-hyperpurple focus:outline-none',
            'cursor-pointer'
          )}
        />
      </div>

      {/* Check-out */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-checkout"
          className="font-utility text-caption uppercase tracking-[0.1em] text-pitch-soft"
        >
          Check-out
        </label>
        <input
          id="filter-checkout"
          type="date"
          defaultValue={intent.checkout ?? ''}
          onChange={(e) => pushParams({ checkout: e.target.value || undefined })}
          min={intent.checkin ?? undefined}
          className={cn(
            'h-9 rounded-sm border border-line-strong bg-white px-3 font-body text-subtitle text-pitch',
            'hover:border-hyperpurple-75 focus:border-hyperpurple focus:outline-none',
            'cursor-pointer'
          )}
        />
      </div>

      {/* Divider */}
      <div className="hidden h-9 w-px self-end bg-line sm:block" />

      {/* Adults stepper */}
      <div className="flex flex-col gap-1">
        <span className="font-utility text-caption uppercase tracking-[0.1em] text-pitch-soft">
          Guests
        </span>
        <div className="flex h-9 items-center gap-2 rounded-sm border border-line-strong bg-white px-2">
          <button
            type="button"
            aria-label="Remove one guest"
            onClick={() =>
              pushParams({ adults: String(Math.max(1, adults - 1)) })
            }
            disabled={adults <= 1}
            className="flex h-6 w-6 items-center justify-center rounded-pill border border-line text-pitch transition-colors hover:border-hyperpurple hover:text-hyperpurple disabled:opacity-30"
          >
            <Minus size={12} />
          </button>
          <span className="w-5 text-center font-body text-subtitle text-pitch tabular-nums">
            {adults}
          </span>
          <button
            type="button"
            aria-label="Add one guest"
            onClick={() =>
              pushParams({ adults: String(Math.min(60, adults + 1)) })
            }
            disabled={adults >= 60}
            className="flex h-6 w-6 items-center justify-center rounded-pill border border-line text-pitch transition-colors hover:border-hyperpurple hover:text-hyperpurple disabled:opacity-30"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden h-9 w-px self-end bg-line sm:block" />

      {/* Mood chips */}
      <div className="flex flex-col gap-1">
        <span className="font-utility text-caption uppercase tracking-[0.1em] text-pitch-soft">
          Mood
        </span>
        <div className="flex flex-wrap gap-1.5">
          {moodProfiles.map((p) => {
            const lowerMood = moodKeyToLower(p.mood) as Mood
            const isActive = currentMood === p.mood
            const activeCls = MOOD_ACTIVE_CLASS[lowerMood] ?? 'bg-gray-600 text-white border-gray-600'
            return (
              <button
                key={p.mood}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  pushParams({ mood: isActive ? undefined : lowerMood })
                }
                className={cn(
                  'flex h-9 items-center gap-1 rounded-pill border px-3 font-utility text-caption uppercase tracking-[0.08em] transition-all duration-150',
                  isActive
                    ? activeCls
                    : 'border-line bg-sterling text-pitch hover:border-line-strong'
                )}
              >
                <span aria-hidden="true">{MOOD_EMOJI[p.mood] ?? '✨'}</span>
                {p.mood.charAt(0) + p.mood.slice(1).toLowerCase()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Clear button — only shown when there's something to clear */}
      {hasFilters && (
        <>
          <div className="hidden h-9 w-px self-end bg-line sm:block" />
          <button
            type="button"
            onClick={clearAll}
            className="flex h-9 items-center gap-1.5 rounded-sm px-3 font-utility text-caption uppercase tracking-[0.1em] text-pitch-soft transition-colors hover:text-danger"
          >
            <X size={14} aria-hidden="true" />
            Clear
          </button>
        </>
      )}
    </div>
  )
}
