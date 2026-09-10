import Link from 'next/link'
import { PropertyCard, type PropertyCardProps } from '@/components/marketing/PropertyCard'
import { Button } from '@/components/ui/Button'
import { getProperties } from '@/lib/api/properties'
import { getMoodConfig } from '@/lib/api'
import type { MoodProfileConfig } from '@/lib/api/types/mood-config'
import type { Mood } from '@/components/ui/Chip'
import type { PublicProperty } from '@/lib/api/types/property'

const MAX_CARDS = 6

function propertyChips(
  property: PublicProperty,
  moodProfiles: MoodProfileConfig[]
): { label: string; mood?: Mood }[] {
  const unitMoods = new Set<string>()
  for (const unit of property.units ?? []) for (const m of unit.moods ?? []) unitMoods.add(m)
  return moodProfiles
    .filter((p) => unitMoods.has(p.mood))
    .sort((a, b) => a.tileOrder - b.tileOrder)
    .slice(0, 2)
    .map((p) => ({
      label: p.displayName,
      mood: p.mood.toLowerCase() as Mood,
    }))
}

function toCard(
  property: PublicProperty,
  moodProfiles: MoodProfileConfig[]
): (PropertyCardProps & { slug: string }) | null {
  if (property.priceFrom == null) return null
  return {
    slug: property.slug,
    name: property.displayName,
    area: [property.area, property.state].filter(Boolean).join(', '),
    price: `₹${property.priceFrom.toLocaleString('en-IN')}`,
    tier: (property.tier || 'raw').toLowerCase() as PropertyCardProps['tier'],
    photoSrc: property.coverPhoto ?? property.photos?.[0],
    chips: propertyChips(property, moodProfiles),
  }
}

export async function PropertyPreview() {
  let cards: (PropertyCardProps & { slug: string })[] = []
  try {
    const [res, moodConfig] = await Promise.all([
      getProperties(
        { showOnHomepage: true, limit: MAX_CARDS },
        { cache: 'force-cache', next: { revalidate: 300 } }
      ),
      getMoodConfig({ cache: 'no-store' }),
    ])
    const moodProfiles = moodConfig.moodProfiles ?? []
    cards = res.data.map((p) => toCard(p, moodProfiles)).filter((c): c is PropertyCardProps & { slug: string } => c !== null)
  } catch {
    cards = []
  }

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
