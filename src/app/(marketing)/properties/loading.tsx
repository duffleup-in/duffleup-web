import { PropertyGrid } from '@/components/property/PropertyGrid'

// Rendered by Next while the page's server-side search is pending — this is what
// makes the skeleton grid appear on initial load and on every /properties
// navigation (decision 6).
export default function PropertiesLoading() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-12">
      <PropertyGrid properties={[]} isLoading />
    </main>
  )
}
