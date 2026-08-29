import * as React from 'react'
import { cn } from '@/lib/cn'

export type Mood =
  | 'chill'
  | 'party'
  | 'work'
  | 'family'
  | 'romance'
  | 'wellness'
  | 'adventure'

export type ChipProps = {
  mood?: Mood
  className?: string
  children: React.ReactNode
}

const moods: Record<Mood, string> = {
  chill: 'bg-plasma text-pitch border-transparent',
  party: 'bg-acid text-pitch border-transparent',
  work: 'bg-hyperpurple text-white border-transparent',
  family: 'bg-pets text-white border-transparent',
  romance: 'bg-slap-pink text-white border-transparent',
  wellness: 'bg-success text-white border-transparent',
  adventure: 'bg-solar text-white border-transparent',
}

export function Chip({ mood, className, children }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border border-line bg-sterling px-3.5 py-1.5 font-utility text-subtitle uppercase tracking-[0.08em] text-pitch',
        mood && moods[mood],
        className
      )}
    >
      {children}
    </span>
  )
}
