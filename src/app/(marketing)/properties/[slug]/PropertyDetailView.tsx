'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MoodChip } from '@/components/property/MoodChip'
import type { MoodKey } from '@/lib/api/types/mood-config'
import type { PropertyDetail, PublicUnit } from '@/lib/api/types/property'
import { cn } from '@/lib/cn'

/** Stable chip order, mirroring PropertyCard.MOOD_ORDER / the home mood grid. */
const MOOD_ORDER: MoodKey[] = [
  'ROMANCE',
  'CHILL',
  'BASH',
  'PETS',
  'FAMILY',
  'ADVENTURE',
  'WORKATION',
  'WELLNESS',
]

/** Backend tier enum → Badge's lowercase tier. */
function tierProp(tier: string): 'raw' | 'real' | 'rare' | null {
  const t = tier.toLowerCase()
  return t === 'raw' || t === 'real' || t === 'rare' ? t : null
}

/** "BOUTIQUE_HOTEL" → "Boutique Hotel". */
function humanize(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function locationLine(property: PropertyDetail): string {
  return [property.area, property.city, property.state]
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .join(', ')
}

/** Prices arrive in rupees on this surface (matches PropertyCard.priceFrom). */
function rupees(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

/** Union of every unit's moods, in the canonical chip order. */
function unitMoods(units: PublicUnit[]): MoodKey[] {
  const set = new Set<MoodKey>()
  for (const unit of units) for (const m of unit.moods) set.add(m)
  return MOOD_ORDER.filter((m) => set.has(m))
}

/** Gathers property photos first, then each unit's photos, de-duplicated. */
function galleryPhotos(property: PropertyDetail): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  const push = (src: string | null | undefined) => {
    if (src && !seen.has(src)) {
      seen.add(src)
      out.push(src)
    }
  }
  push(property.coverPhoto)
  for (const p of property.photos) push(p)
  for (const unit of property.units) for (const p of unit.photos) push(p)
  return out
}

function Gallery({ photos, name }: { photos: string[]; name: string }) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const clamp = (i: number) => Math.max(0, Math.min(i, photos.length - 1))
  const go = (delta: number) => setIndex((i) => clamp(i + delta))

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchStartX.current = null
  }

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-md bg-gradient-to-br from-hyperpurple to-slap-pink font-utility text-h6 uppercase tracking-[0.1em] text-white">
        Photos coming
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="group relative aspect-[16/9] overflow-hidden rounded-md bg-sterling"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          key={photos[index]}
          src={photos[index]}
          alt={`${name} — photo ${index + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover"
        />

        {photos.length > 1 && (
          <>
            {index > 0 && (
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-pill bg-white/90 p-2 text-pitch shadow-sm transition-opacity md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {index < photos.length - 1 && (
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-pill bg-white/90 p-2 text-pitch shadow-sm transition-opacity md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
            )}

            <div className="absolute right-3 top-3 rounded-pill bg-pitch/70 px-2.5 py-1 font-utility text-[12px] uppercase tracking-[0.08em] text-white">
              {index + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={photo}
              type="button"
              aria-label={`View photo ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                'relative h-16 w-24 flex-none overflow-hidden rounded-sm border-2 bg-sterling transition-colors',
                i === index ? 'border-pitch' : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={photo}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function UnitCard({
  unit,
  selected,
  onSelect,
}: {
  unit: PublicUnit
  selected: boolean
  onSelect: () => void
}) {
  const moods = MOOD_ORDER.filter((m) => unit.moods.includes(m))
  const bookable = unit.hasActiveRates && unit.currentRate !== null

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'block w-full rounded-md border-2 bg-white p-5 text-left transition-all',
        selected
          ? 'border-pitch shadow-pop'
          : 'border-line hover:-translate-y-0.5 hover:border-pitch/40 hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-utility text-h6 uppercase leading-tight tracking-[0.01em]">
            {unit.name}
          </h3>
          <p className="mt-0.5 text-[13px] text-pitch-soft">{humanize(unit.unitType)}</p>
        </div>
        <div className="text-right">
          {bookable ? (
            <>
              <span className="font-utility text-h6">{rupees(unit.currentRate as number)}</span>
              <span className="block text-[12px] text-pitch-soft">/ night</span>
            </>
          ) : (
            <span className="font-utility text-subtitle uppercase tracking-[0.08em] text-pitch-soft">
              Rates soon
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[13px] text-pitch-soft">
        <Users size={14} aria-hidden="true" />
        <span>
          Sleeps {unit.baseOccupancy}
          {unit.maxOccupancy > unit.baseOccupancy ? `–${unit.maxOccupancy}` : ''}
        </span>
      </div>

      {unit.description && (
        <p className="mt-3 text-[14px] leading-relaxed text-pitch-soft">{unit.description}</p>
      )}

      {moods.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {moods.map((mood) => (
            <MoodChip key={mood} mood={mood} />
          ))}
        </div>
      )}

      {unit.amenities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {unit.amenities.map((a) => (
            <span
              key={a}
              className="rounded-pill border border-line bg-sterling-warm px-2.5 py-1 text-[12px] text-pitch-soft"
            >
              {a}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}

export function PropertyDetailView({ property }: { property: PropertyDetail }) {
  const photos = useMemo(() => galleryPhotos(property), [property])
  const moods = useMemo(() => unitMoods(property.units), [property.units])

  // Prefer the first bookable unit as the default selection.
  const bookableUnits = property.units.filter(
    (u) => u.hasActiveRates && u.currentRate !== null
  )
  const defaultUnitId = (bookableUnits[0] ?? property.units[0])?.id ?? null
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(defaultUnitId)

  const selectedUnit =
    property.units.find((u) => u.id === selectedUnitId) ?? null

  const tier = tierProp(String(property.tier))
  const description = property.longDescription ?? property.description

  // CTA carries the property slug + selected unit into the booking collector.
  const bookHref = selectedUnit
    ? `/collect?property=${encodeURIComponent(property.slug)}&unit=${encodeURIComponent(selectedUnit.id)}`
    : `/collect?property=${encodeURIComponent(property.slug)}`

  const canBook =
    !!selectedUnit && selectedUnit.hasActiveRates && selectedUnit.currentRate !== null

  return (
    <>
      {/* Dark masthead — shares the SiteNav bleed-logo clearance (pt-[120px])
          with every other page, so the oversized logo never overlaps content. */}
      <div className="bg-pitch pb-10 pt-[120px] text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <Link
            href="/properties"
            className="mb-6 inline-flex items-center gap-1.5 font-utility text-subtitle uppercase tracking-[0.08em] text-white/60 no-underline transition-colors hover:text-white"
          >
            <ChevronLeft size={16} /> All stays
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {tier && <Badge tier={tier} />}
            <span className="font-utility text-subtitle uppercase tracking-[0.08em] text-white/60">
              {humanize(String(property.propertyType))}
            </span>
          </div>

          <h1 className="mt-3 font-display text-[clamp(36px,6vw,56px)] leading-none">
            {property.displayName}
          </h1>

          <p className="mt-3 inline-flex items-center gap-1.5 text-[15px] text-white/70">
            <MapPin size={16} aria-hidden="true" />
            {locationLine(property)}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <Gallery photos={photos} name={property.displayName} />

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main column */}
          <div>
            {moods.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {moods.map((mood) => (
                  <MoodChip key={mood} mood={mood} />
                ))}
              </div>
            )}

          {description && (
            <section className="mt-8">
              <h2 className="mb-3 font-utility text-h6 uppercase tracking-[0.02em]">
                About this place
              </h2>
              <p className="whitespace-pre-line text-[16px] leading-relaxed text-pitch-soft">
                {description}
              </p>
            </section>
          )}

          {property.amenities.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 font-utility text-h6 uppercase tracking-[0.02em]">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-pill border border-line bg-sterling-warm px-3.5 py-1.5 text-[14px] text-pitch"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="mb-4 font-utility text-h6 uppercase tracking-[0.02em]">
              Choose a unit
            </h2>
            {property.units.length === 0 ? (
              <p className="text-[15px] text-pitch-soft">
                No bookable units are listed for this stay yet.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {property.units.map((unit) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    selected={unit.id === selectedUnitId}
                    onSelect={() => setSelectedUnitId(unit.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sticky booking rail */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border-2 border-pitch bg-white p-6 shadow-pop">
            {selectedUnit && canBook ? (
              <>
                <p className="font-utility text-subtitle uppercase tracking-[0.08em] text-pitch-soft">
                  {selectedUnit.name}
                </p>
                <p className="mt-1">
                  <span className="font-utility text-h4">
                    {rupees(selectedUnit.currentRate as number)}
                  </span>
                  <span className="text-[14px] text-pitch-soft"> / night</span>
                </p>
              </>
            ) : property.priceFrom !== null ? (
              <>
                <p className="font-utility text-subtitle uppercase tracking-[0.08em] text-pitch-soft">
                  From
                </p>
                <p className="mt-1 font-utility text-h4">{rupees(property.priceFrom)}</p>
              </>
            ) : (
              <p className="font-utility text-subh uppercase tracking-[0.08em] text-pitch-soft">
                Rates coming soon
              </p>
            )}

            <Button asChild variant="primary" size="md" className="mt-5 w-full">
              <Link href={bookHref}>Book now</Link>
            </Button>

            <p className="mt-3 text-center text-[12px] text-pitch-soft">
              {property.petsAllowed ? 'Pets welcome · ' : ''}No hidden fees.
            </p>
          </div>
        </aside>
      </div>
      </div>
    </>
  )
}
