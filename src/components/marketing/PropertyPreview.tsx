import Link from 'next/link'
import { PropertyCard, type PropertyCardProps } from '@/components/marketing/PropertyCard'
import { Button } from '@/components/ui/Button'
import { getProperties } from '@/lib/api/properties'
import type { MoodKey } from '@/lib/api/types/mood-config'
import type { Mood } from '@/components/ui/Chip'
import type { PublicProperty } from '@/lib/api/types/property'

// The homepage showcase is admin-curated: it renders ONLY properties an admin
// flagged "show on homepage" in the sb-admin dashboard (Property.showOnHomepage),
// surfaced by the public /search endpoint's ?showOnHomepage=true filter.
const MAX_CARDS = 6

/** Stable chip order, mirroring PropertyCard.MOOD_ORDER / the home mood grid. */
const MOOD_ORDER: MoodKey[] = ['ROMANCE', 'CHILL', 'BASH', 'PETS', 'FAMILY', 'ADVENTURE', 'WORKATION', 'WELLNESS']

/** Union all unit-level moods, in canonical order (Phase-2.5.1 moved moods off the property). */
function propertyMoods(property: PublicProperty): MoodKey[] {
  const set = new Set<MoodKey>()
  for (const unit of property.units ?? []) for (const m of unit.moods ?? []) set.add(m)
  return MOOD_ORDER.filter((m) => set.has(m))
}

const titleCase = (key: string): string => key.charAt(0) + key.slice(1).toLowerCase()

/** Map a backend property to the marketing card's props. Returns null when the
 *  property can't render as a card (no price yet). */
function toCard(property: PublicProperty): (PropertyCardProps & { slug: string }) | null {
  if (property.priceFrom == null) return null
  const chips = propertyMoods(property)
    .slice(0, 2)
    .map((m) => ({ label: titleCase(m), mood: m.toLowerCase() as Mood }))
  return {
    slug: property.slug,
    name: property.displayName,
    area: [property.area, property.state].filter(Boolean).join(', '),
    price: `₹${property.priceFrom.toLocaleString('en-IN')}`,
    tier: (property.tier || 'raw').toLowerCase() as PropertyCardProps['tier'],
    photoSrc: property.coverPhoto ?? property.photos?.[0],
    chips,
  }
}

export async function PropertyPreview() {
  let cards: (PropertyCardProps & { slug: string })[] = []
  try {
    // The curated set changes rarely; cache it for a few minutes instead of
    // inheriting getProperties' default no-store (which would force the whole
    // homepage to render dynamically on every request).
    const res = await getProperties(
      { showOnHomepage: true, limit: MAX_CARDS },
      { cache: 'force-cache', next: { revalidate: 300 } }
    )
    cards = res.data.map(toCard).filter((c): c is PropertyCardProps & { slug: string } => c !== null)
  } catch {
    // Never let a backend hiccup break the homepage — just drop the section.
    cards = []
  }

  // Nothing curated (or the fetch failed): omit the section entirely rather
  // than render an empty grid under the heading.
  if (cards.length === 0) return null

  return (
    <section className="border-b border-line bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-hyperpurple">
              Verified stays
            </p>
            <h2 className="max-w-2xl font-display text-[clamp(40px,6vw,64px)] leading-none">
              Places we&apos;ve actually been to.
            </h2>
          </div>
          <Button asChild variant="secondary-dark" size="sm">
            <Link href="/properties">See all stays</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ slug, ...card }) => (
            <PropertyCard key={slug} {...card} href={`/properties/${slug}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
