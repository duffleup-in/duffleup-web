import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import type { Mood } from '@/components/ui/Chip'

export type StickerMoodCardProps = {
  mood: Mood
  name: string
  description: string
  tag?: string
  cta?: string
  href?: string
  /** Renders the card as a <button> instead of a link. Ignored when `href` is set. */
  onClick?: () => void
  /** Scales type down for the ~180px tiles inside the intent collector modal. */
  compact?: boolean
  className?: string
}

// Bungee is caps-only and offers no mid-word break, so a long name like
// "Adventure" cannot wrap and will spill past the card edge. Size the name
// against the card's own inline size (cqi) rather than the viewport, stepping
// down for longer names so every mood fits at every breakpoint.
//
// The clamp *floors* below are what actually bind on narrow cards, so they are
// tuned per scale: the default floors suit the home grid's ~370px tiles, while
// `compact` retunes them for the modal's ~180px tiles — at that width the
// default 30px floor overflows "ADVENTURE" straight past the card edge.
function nameSize(name: string, compact: boolean): string {
  if (compact) {
    if (name.length >= 8) return 'text-[clamp(16px,13cqi,26px)]'
    if (name.length >= 6) return 'text-[clamp(18px,15cqi,30px)]'
    return 'text-[clamp(20px,18cqi,34px)]'
  }
  if (name.length >= 8) return 'text-[clamp(30px,14cqi,46px)]'
  if (name.length >= 6) return 'text-[clamp(36px,17cqi,56px)]'
  return 'text-[clamp(40px,20cqi,64px)]'
}

// bg + text + resting rotation per the v0.4 nth-child spec.
const moodStyles: Record<Mood, { surface: string; rotate: string }> = {
  chill: { surface: 'bg-plasma text-pitch', rotate: '-rotate-2' },
  romance: { surface: 'bg-slap-pink text-white', rotate: 'rotate-2' },
  adventure: { surface: 'bg-solar text-white', rotate: '-rotate-1' },
  reset: { surface: 'bg-hyperpurple text-white', rotate: 'rotate-3' },
  bash: { surface: 'bg-acid text-pitch', rotate: '-rotate-3' },
  pets: { surface: 'bg-pets text-white', rotate: 'rotate-1' },
}

export function StickerMoodCard({
  mood,
  name,
  description,
  tag,
  cta = 'Take me there →',
  href,
  onClick,
  compact = false,
  className,
}: StickerMoodCardProps) {
  const { surface, rotate } = moodStyles[mood]

  const content = (
    <div
      className={cn(
        'relative flex aspect-[4/5] cursor-pointer flex-col justify-between rounded-lg border-[3px] border-pitch p-6 shadow-pop transition-transform duration-200',
        '[container-type:inline-size]',
        compact && 'p-4',
        'hover:-translate-y-1 hover:rotate-0 hover:shadow-pop-lg',
        surface,
        rotate,
        className
      )}
    >
      {tag && (
        <span className="absolute -top-3 right-3 rotate-[5deg] rounded-xsm bg-pitch px-2.5 py-1 font-utility text-[11px] uppercase tracking-[0.15em] text-acid">
          {tag}
        </span>
      )}
      <div>
        {/* leading- must follow the size class: cn()'s tailwind-merge treats a
            font-size as overriding line-height (our fontSize tokens carry one). */}
        <p className={cn('font-display', nameSize(name, compact), 'leading-[0.9]')}>
          {name}
        </p>
        <p
          className={cn(
            'mt-2 font-medium leading-snug',
            compact ? 'text-[12px]' : 'text-[15px]'
          )}
        >
          {description}
        </p>
      </div>
      <span
        className={cn(
          'mt-auto self-start font-utility uppercase tracking-[0.15em]',
          compact ? 'pt-3 text-subtitle' : 'pt-6 text-base'
        )}
      >
        {cta}
      </span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    )
  }

  // Intent-collector entry points select a mood in place rather than navigating.
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-acid focus-visible:ring-offset-2"
      >
        {content}
      </button>
    )
  }

  return content
}
