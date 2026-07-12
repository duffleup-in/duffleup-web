import * as React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

type Tier = 'standard' | 'certified' | 'select'

export type BadgeProps = {
  tier: Tier
  className?: string
  children?: React.ReactNode
}

const tiers: Record<Tier, string> = {
  standard: 'bg-sterling text-pitch border border-line',
  certified: 'bg-plasma text-pitch',
  select: 'bg-acid text-pitch',
}

const labels: Record<Tier, string> = {
  standard: 'Standard',
  certified: 'Certified',
  select: 'Select',
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
      {tier === 'select' && (
        <Star size={10} className="fill-current" aria-hidden="true" />
      )}
      {children ?? labels[tier]}
    </span>
  )
}
