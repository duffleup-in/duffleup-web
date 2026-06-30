import Link from 'next/link'
import { PropertyCard, type PropertyCardProps } from '@/components/marketing/PropertyCard'
import { Button } from '@/components/ui/Button'

// Seeded preview data for Phase 2. Phase 3 wires this to
// GET /properties?featured=true once the endpoint exists.
const featured: (PropertyCardProps & { slug: string })[] = [
  {
    slug: 'fog-and-pine',
    name: 'Fog & Pine',
    area: 'Lonavala, MH',
    tier: 'select',
    price: '₹8,400',
    placeholderVariant: 'chill',
    chips: [{ label: 'Chill', mood: 'chill' }, { label: 'Pets', mood: 'pets' }],
  },
  {
    slug: 'riverbend-camp',
    name: 'Riverbend Camp',
    area: 'Kolad, MH',
    tier: 'certified',
    price: '₹6,200',
    placeholderVariant: 'adventure',
    chips: [{ label: 'Adventure', mood: 'adventure' }],
  },
  {
    slug: 'the-quiet-house',
    name: 'The Quiet House',
    area: 'Bhandardara, MH',
    tier: 'standard',
    price: '₹5,000',
    placeholderVariant: 'reset',
    chips: [{ label: 'Reset', mood: 'reset' }],
  },
]

export function PropertyPreview() {
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
          {featured.map(({ slug, ...card }) => (
            <PropertyCard key={slug} {...card} href={`/properties/${slug}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
