import { PropertyGrid } from '@/components/property/PropertyGrid'
import { PageHero } from '@/components/marketing/PageHero'

// Rendered by Next while the page's server-side search is pending — this is what
// makes the skeleton grid appear on initial load and on every /properties
// navigation (decision 6). Mirrors page.tsx's masthead so there's no shift.
export default function PropertiesLoading() {
  return (
    <>
      <PageHero
        eyebrow="Verified · Mood-first"
        title="Stays"
        subtitle="Every property is visited before it goes live."
      />
      <section className="mx-auto max-w-[1200px] px-6 py-12">
        <PropertyGrid properties={[]} isLoading />
      </section>
    </>
  )
}
