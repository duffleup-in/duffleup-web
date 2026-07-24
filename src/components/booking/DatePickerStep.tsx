'use client'

import { useState, type CSSProperties } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { differenceInCalendarDays } from 'date-fns'
import 'react-day-picker/style.css'
import { cn } from '@/lib/cn'

export type DatePickerStepProps = {
  checkin: Date | null
  checkout: Date | null
  /** Commits a complete range and advances to guests (fired from Next). */
  onRangeChange: (range: { checkin: Date; checkout: Date }) => void
  onSkip: () => void
}

/** Soft cap (decision 3): informational only, never blocks. */
const SOFT_CAP_NIGHTS = 7
const SOFT_CAP_WARNING =
  'Weekend app. Longer stays welcome. Options get thinner.'

// Midnight today — past days are disabled, and the min-night check compares
// calendar days so a same-day second tap can't slip through as a 0-night stay.
function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

// Brand theming over rdp v9's CSS custom properties. The modal sits on Pitch,
// so the whole surface runs light-on-dark; Hyperpurple carries the range,
// Acid marks today.
const brandVars = {
  '--rdp-accent-color': '#7B2FFF',
  '--rdp-accent-background-color': 'rgba(123, 47, 255, 0.25)',
  '--rdp-today-color': '#CCFF00',
  '--rdp-day-width': '2.5rem',
  '--rdp-day-height': '2.5rem',
} as CSSProperties

export function DatePickerStep({
  checkin,
  checkout,
  onRangeChange,
  onSkip,
}: DatePickerStepProps) {
  // rdp owns the in-progress range (from-only, before the second tap); the
  // reducer only hears about it once a complete range exists.
  const [range, setRange] = useState<DateRange | undefined>(
    checkin ? { from: checkin, to: checkout ?? undefined } : undefined
  )

  const nights =
    range?.from && range.to
      ? differenceInCalendarDays(range.to, range.from)
      : 0
  // Min stay is 1 night (decision 2): a same-day "range" (0 nights) can't advance.
  const canAdvance = nights >= 1
  const overSoftCap = nights > SOFT_CAP_NIGHTS

  const handleNext = () => {
    if (range?.from && range.to && canAdvance) {
      onRangeChange({ checkin: range.from, checkout: range.to })
    }
  }

  return (
    <div>
      {/* Colour overrides only — rdp v9's own style.css handles layout and nav
          positioning (top-right). Chevrons are SVGs, so tint via fill. */}
      <div
        style={brandVars}
        className="flex justify-center text-white [&_.rdp-chevron]:fill-white [&_.rdp-day_button:hover]:bg-white/10 [&_.rdp-disabled]:opacity-30"
      >
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          disabled={{ before: startOfToday() }}
          showOutsideDays
          classNames={{
            month_caption:
              'flex items-center h-10 px-1 font-utility uppercase tracking-[0.12em] text-white',
            caption_label: 'text-subh',
            weekday: 'font-utility text-caption uppercase text-white/50',
            button_previous:
              'inline-flex h-9 w-9 items-center justify-center rounded-pill hover:bg-white/10',
            button_next:
              'inline-flex h-9 w-9 items-center justify-center rounded-pill hover:bg-white/10',
          }}
        />
      </div>

      <p
        className={cn(
          'mt-3 min-h-[1.25rem] text-center text-subtitle transition-colors',
          overSoftCap ? 'text-acid' : 'text-transparent'
        )}
        aria-live="polite"
      >
        {overSoftCap ? SOFT_CAP_WARNING : ''}
      </p>

      <div className="mt-2 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onSkip}
          className="font-utility text-subtitle uppercase tracking-[0.12em] text-white/60 underline-offset-4 transition-colors hover:text-acid hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
        >
          See stays →
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canAdvance}
          className="rounded-pill bg-acid px-5 py-2 font-utility uppercase tracking-[0.15em] text-pitch transition-opacity disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
