import type { PublicProperty } from '@/lib/api/types/property'
import { PropertyCard } from './PropertyCard'
import { PropertyCardSkeleton } from './PropertyCardSkeleton'

export type PropertyGridProps = {
  properties: PublicProperty[]
  isLoading?: boolean
}

// Responsive grid: 1 column on mobile, 2 columns from md up (decision 2), 24px
// gap. No 3-col dense layout by design.
const GRID = 'grid grid-cols-1 gap-6 md:grid-cols-2'

// Skeleton counts per decision 6: 2 on mobile, 4 on desktop. We render 4 and
// hide the last two below md so the mobile stack shows exactly two.
const SKELETON_COUNT = 4

export function PropertyGrid({ properties, isLoading = false }: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className={GRID}>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <div key={i} className={i >= 2 ? 'hidden md:block' : undefined}>
            <PropertyCardSkeleton />
          </div>
        ))}
      </div>
    )
  }

  // Defensive filter (decision 5): never render a null-price property.
  const visible = properties.filter((p) => p.priceFrom !== null)

  return (
    <div className={GRID}>
      {visible.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
