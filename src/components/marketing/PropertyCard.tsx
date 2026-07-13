import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Chip, type Mood } from '@/components/ui/Chip'
import { cn } from '@/lib/cn'
import { HeartButton } from './HeartButton'

type PlaceholderVariant = 'default' | 'chill' | 'adventure' | 'reset'

export type PropertyCardProps = {
  name: string
  area: string
  price: string
  priceUnit?: string
  // TODO: consolidate this union with Badge.tsx's Tier type
  tier?: 'raw' | 'real' | 'rare'
  chips?: { label: string; mood?: Mood }[]
  photoSrc?: string
  photoAlt?: string
  /** Gradient used when no photoSrc is supplied. */
  placeholderVariant?: PlaceholderVariant
  placeholderLabel?: string
  href?: string
  className?: string
}

const placeholders: Record<PlaceholderVariant, string> = {
  default: 'bg-gradient-to-br from-hyperpurple to-slap-pink',
  chill: 'bg-gradient-to-br from-plasma to-hyperpurple',
  adventure: 'bg-gradient-to-br from-solar to-slap-pink',
  reset: 'bg-gradient-to-br from-pitch to-hyperpurple',
}

export function PropertyCard({
  name,
  area,
  price,
  priceUnit = '/ night',
  tier,
  chips,
  photoSrc,
  photoAlt,
  placeholderVariant = 'default',
  placeholderLabel = 'Photo coming',
  href,
  className,
}: PropertyCardProps) {
  const card = (
    <article
      className={cn(
        'group cursor-pointer overflow-hidden rounded-md border border-line bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={photoAlt ?? name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center font-utility text-subtitle uppercase tracking-[0.1em] text-white',
              placeholders[placeholderVariant]
            )}
          >
            {placeholderLabel}
          </div>
        )}
        {tier && (
          <div className="absolute left-3 top-3">
            <Badge tier={tier} />
          </div>
        )}
        <HeartButton className="absolute right-3 top-3" />
      </div>

      <div className="px-6 pb-6 pt-4">
        <h3 className="mb-1 font-utility text-[26px] uppercase leading-tight tracking-[0.01em]">
          {name}
        </h3>
        <p className="mb-4 text-[13px] text-pitch-soft">{area}</p>

        {chips && chips.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <Chip key={c.label} mood={c.mood}>
                {c.label}
              </Chip>
            ))}
          </div>
        )}

        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <span className="font-utility text-h6">{price}</span>
          <span className="font-body text-[13px] text-pitch-soft">{priceUnit}</span>
        </div>
      </div>
    </article>
  )

  return href ? (
    <Link href={href} className="block no-underline">
      {card}
    </Link>
  ) : (
    card
  )
}
