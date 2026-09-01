import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPropertyBySlug } from '@/lib/api'
import { ApiError } from '@/lib/api/client'
import type { PropertyDetail } from '@/lib/api/types/property'
import { PageHero } from '@/components/marketing/PageHero'
import { PropertyDetailView } from './PropertyDetailView'

// SP-F1 — property DETAIL. Server Component fetches the property by slug from
// GET /api/v1/properties/slug/:slug and hands it to the client view (gallery,
// unit selection, booking CTA). A 404 from the API maps to Next's notFound();
// any other failure renders a graceful inline error rather than crashing.

type Params = { slug: string }

/**
 * Fetches the property, distinguishing "not found" (→ null, render notFound)
 * from a transport/500 error (→ throw, render the error branch). Returns a
 * discriminated result so the page can tell the two apart.
 */
async function loadProperty(
  slug: string
): Promise<
  | { status: 'ok'; property: PropertyDetail }
  | { status: 'not-found' }
  | { status: 'error' }
> {
  try {
    const property = await getPropertyBySlug(slug, {
      // Detail pages can tolerate short caching; revalidate every 5 min.
      next: { revalidate: 300 },
    })
    return { status: 'ok', property }
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { status: 'not-found' }
    }
    return { status: 'error' }
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  try {
    const property = await getPropertyBySlug(params.slug, {
      next: { revalidate: 300 },
    })
    const location = [property.area, property.state].filter(Boolean).join(', ')
    return {
      title: `${property.displayName} — Duffleup`,
      description:
        property.description ??
        `${property.displayName}${location ? ` in ${location}` : ''} on Duffleup.`,
      robots: { index: false, follow: false },
    }
  } catch {
    return { title: 'Stay — Duffleup', robots: { index: false, follow: false } }
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Params
}) {
  const result = await loadProperty(params.slug)

  if (result.status === 'not-found') {
    notFound()
  }

  if (result.status === 'error') {
    return (
      <PageHero
        eyebrow="Stay"
        title="Something went wrong."
        subtitle="We couldn't load this stay right now. Please try again in a moment."
      />
    )
  }

  return <PropertyDetailView property={result.property} />
}
