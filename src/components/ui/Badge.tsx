import * as React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

type Tier = 'raw' | 'real' | 'rare'

export type BadgeProps = {
  tier: Tier
  className?: string
  children?: React.ReactNode
}

const tiers: Record<Tier, string> = {
  raw: 'bg-sterling text-pitch border border-line',
  real: 'bg-plasma text-pitch',
  rare: 'bg-acid text-pitch',
}

const labels: Record<Tier, string> = {
  raw: 'Raw',
  real: 'Real',
  rare: 'Rare',
}

export function Badge({ tier, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill px-3 py-1.5 font-utility text-[13px] uppercase tracking-[0.15em]',
        tiers[tier],
        className
      )}
    >
      {tier === 'rare' && (
        <Star
          size={10}
          className="fill-current"
          aria-hidden="true"
          data-testid="rare-star"
        />
      )}
      {children ?? labels[tier]}
    </span>
  )
}
