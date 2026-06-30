import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/cn'

type SocialVariant = 'acid' | 'pink' | 'purple'

export type SocialCardProps = {
  quote: string
  variant?: SocialVariant
  /** Attribution slot. Defaults to the duffleup wordmark. */
  attribution?: React.ReactNode
  className?: string
}

const variants: Record<SocialVariant, { surface: string; quote: string }> = {
  acid: { surface: 'bg-acid text-pitch', quote: 'text-hyperpurple' },
  pink: { surface: 'bg-slap-pink text-white', quote: 'text-acid' },
  purple: { surface: 'bg-hyperpurple text-white', quote: 'text-acid' },
}

export function SocialCard({ quote, variant = 'acid', attribution, className }: SocialCardProps) {
  const v = variants[variant]
  return (
    <figure
      className={cn(
        'relative aspect-square overflow-hidden rounded-md border-[3px] border-pitch p-8 shadow-[8px_8px_0_#0A0A0A]',
        v.surface,
        className
      )}
    >
      <blockquote
        className={cn(
          'font-display text-[clamp(36px,5vw,56px)] leading-none',
          v.quote
        )}
      >
        {quote}
      </blockquote>
      <figcaption className="absolute bottom-6 left-6 inline-flex items-center leading-none">
        {attribution ?? (
          <Image src="/duffleup-logo.svg" alt="duffleup" width={37} height={28} />
        )}
      </figcaption>
    </figure>
  )
}
