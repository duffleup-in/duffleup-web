'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'

export type GuestStepperProps = {
  adults: number
  /** `children` is React's reserved prop slot, so the count comes in renamed. */
  childrenCount: number
  infants: number
  onAdultsChange: (count: number) => void
  onChildrenChange: (count: number) => void
  onInfantsChange: (count: number) => void
  onSubmit: () => void
  moodName: string
}

/** Combined guest ceiling across all three tiers (decision 4). */
const MAX_TOTAL = 60

type Tier = {
  key: 'adults' | 'children' | 'infants'
  label: string
  descriptor: string
  /** Adults can't go below 1; children/infants floor at 0 (decision 5). */
  min: number
}

const TIERS: Tier[] = [
  { key: 'adults', label: 'Adults', descriptor: 'Ages 12+', min: 1 },
  { key: 'children', label: 'Children', descriptor: 'Ages 2–12', min: 0 },
  { key: 'infants', label: 'Infants', descriptor: 'Under 2', min: 0 },
]

function StepButton({
  icon,
  onClick,
  disabled,
  label,
}: {
  icon: React.ReactNode
  onClick: () => void
  disabled: boolean
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      // 44px tap target (decision: mobile ≥44px).
      className="flex h-11 w-11 items-center justify-center rounded-pill border border-white/25 text-white transition-colors hover:border-acid hover:text-acid disabled:opacity-30 disabled:hover:border-white/25 disabled:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
    >
      {icon}
    </button>
  )
}

/**
 * Step 4 — three-tier guest counter. Counts mutate in place (this is the
 * terminal step); submit serializes the whole intent to the search URL.
 */
export function GuestStepper({
  adults,
  childrenCount,
  infants,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  onSubmit,
  moodName,
}: GuestStepperProps) {
  const counts = { adults, children: childrenCount, infants }
  const handlers = {
    adults: onAdultsChange,
    children: onChildrenChange,
    infants: onInfantsChange,
  }
  const total = adults + childrenCount + infants
  const atMax = total >= MAX_TOTAL

  return (
    <div>
      <div className="divide-y divide-white/10">
        {TIERS.map((tier) => {
          const count = counts[tier.key]
          return (
            <div
              key={tier.key}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="font-utility text-subh uppercase tracking-[0.08em] text-white">
                  {tier.label}
                </p>
                <p className="text-subtitle text-white/50">{tier.descriptor}</p>
              </div>

              <div className="flex items-center gap-3">
                <StepButton
                  icon={<Minus size={18} />}
                  label={`Remove one ${tier.label.toLowerCase()}`}
                  onClick={() => handlers[tier.key](count - 1)}
                  disabled={count <= tier.min}
                />
                <span className="w-6 text-center font-utility text-subh text-white tabular-nums">
                  {count}
                </span>
                <StepButton
                  icon={<Plus size={18} />}
                  label={`Add one ${tier.label.toLowerCase()}`}
                  onClick={() => handlers[tier.key](count + 1)}
                  disabled={atMax}
                />
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className={cn(
          'mt-6 w-full rounded-pill bg-acid px-5 py-3 font-utility uppercase tracking-[0.15em] text-pitch',
          'transition-transform hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2 focus-visible:ring-offset-pitch'
        )}
      >
        See {moodName} stays →
      </button>
    </div>
  )
}
