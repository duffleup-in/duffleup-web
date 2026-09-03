'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { MoodKey } from '@/lib/api/types/mood-config'
import type { PublicProperty } from '@/lib/api/types/property'
import { cn } from '@/lib/cn'
import { MoodChip } from './MoodChip'

/** Carousel shows at most this many photos per card (decision 4). */
const MAX_PHOTOS = 5

/** Order moods stably for chip rendering; matches the home mood-tile order. */
const MOOD_ORDER: MoodKey[] = ['ROMANCE', 'CHILL', 'BASH', 'PETS', 'FAMILY', 'ADVENTURE', 'WORKATION', 'WELLNESS']

/** Union all unit-level moods (Phase-2.5.1 moved moods off the property). */
function propertyMoods(property: PublicProperty): MoodKey[] {
  const set = new Set<MoodKey>()
  for (const unit of property.units) for (const m of unit.moods) set.add(m)
  return MOOD_ORDER.filter((m) => set.has(m))
}

function locationLine(property: PublicProperty): string {
  return [property.area, property.state].filter(Boolean).join(', ')
}

export function PropertyCard({ property }: { property: PublicProperty }) {
  // Hooks must run before any early return (Rules of Hooks).
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  // Defense in depth (decision 5): the backend already drops null-price
  // properties, but never render a card without a price. `== null` catches
  // both null and undefined (an older backend may omit the field entirely).
  if (property.priceFrom == null) return null

  const photos = property.photos.slice(0, MAX_PHOTOS)
  const moods = propertyMoods(property)

  const clamp = (i: number) => Math.max(0, Math.min(i, photos.length - 1))
  const go = (delta: number) => setIndex((i) => clamp(i + delta))

  // stopPropagation/preventDefault so arrow taps don't trigger the card link.
  const arrow = (delta: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    go(delta)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchStartX.current = null
  }

  const priceLabel = `Starts at ₹${property.priceFrom.toLocaleString('en-IN')}`

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block no-underline"
    >
      <article className="overflow-hidden rounded-md border border-line bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div
          className="relative aspect-[16/10] overflow-hidden bg-sterling"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {photos.length > 0 ? (
            <Image
              key={photos[index]}
              src={photos[index]}
              alt={`${property.displayName} — photo ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-hyperpurple to-slap-pink font-utility text-subtitle uppercase tracking-[0.1em] text-white">
              Photo coming
            </div>
          )}

          {photos.length > 1 && (
            <>
              {index > 0 && (
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={arrow(-1)}
                  className="absolute left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-pill bg-white/90 p-1.5 text-pitch shadow-sm transition-opacity group-hover:flex md:opacity-0 md:group-hover:opacity-100"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              {index < photos.length - 1 && (
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={arrow(1)}
                  className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-pill bg-white/90 p-1.5 text-pitch shadow-sm transition-opacity group-hover:flex md:opacity-0 md:group-hover:opacity-100"
                >
                  <ChevronRight size={18} />
                </button>
              )}

              <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
                {photos.map((photo, i) => (
                  <span
                    key={photo}
                    className={cn(
                      'h-1.5 w-1.5 rounded-pill transition-colors',
                      i === index ? 'bg-white' : 'bg-white/50'
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-5 pb-5 pt-4">
          <h3 className="mb-1 font-utility text-[22px] uppercase leading-tight tracking-[0.01em]">
            {property.displayName}
          </h3>
          <p className="mb-3 text-[13px] text-pitch-soft">{locationLine(property)}</p>

          {moods.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {moods.map((mood) => (
                <MoodChip key={mood} mood={mood} />
              ))}
            </div>
          )}

          <div className="border-t border-line pt-3">
            <span className="font-utility text-h6">{priceLabel}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
