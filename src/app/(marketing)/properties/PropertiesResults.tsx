'use client'

import type { PublicProperty } from '@/lib/api/types/property'
import { PropertyGrid } from '@/components/property/PropertyGrid'

export type PropertiesResultsProps = {
  properties: PublicProperty[]
  /** Set when the server-side search threw. Richer error UX is B.4. */
  error?: boolean
}

export function PropertiesResults({ properties, error }: PropertiesResultsProps) {
  if (error) {
    return (
      <p className="text-body text-pitch-soft">
        Something went wrong loading stays. Please try again.
      </p>
    )
  }

  return <PropertyGrid properties={properties} />
}
