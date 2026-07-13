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
  className?: string
}

// Bungee is caps-only and offers no mid-word break, so a long name like
// "Adventure" cannot wrap and will spill past the card edge. Size the name
// against the card's own inline size (cqi) rather than the viewport, stepping
// down for longer names so every mood fits at every breakpoint.
function nameSize(name: string): string {
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
  className,
}: StickerMoodCardProps) {
  const { surface, rotate } = moodStyles[mood]

  const content = (
    <div
      className={cn(
        'relative flex aspect-[4/5] cursor-pointer flex-col justify-between rounded-lg border-[3px] border-pitch p-6 shadow-pop transition-transform duration-200',
        '[container-type:inline-size]',
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
        <p className={cn('font-display', nameSize(name), 'leading-[0.9]')}>{name}</p>
        <p className="mt-2 text-[15px] font-medium leading-snug">{description}</p>
      </div>
      <span className="mt-auto self-start pt-6 font-utility text-base uppercase tracking-[0.15em]">
        {cta}
      </span>
    </div>
  )

  return href ? (
    <Link href={href} className="block no-underline">
      {content}
    </Link>
  ) : (
    content
  )
}
