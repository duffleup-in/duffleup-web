import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPropertyBySlug, getMoodConfig } from '@/lib/api'
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
    const title = `${property.displayName}${location ? ` in ${location}` : ''} — Duffleup`
    const description =
      property.description ??
      `Stay at ${property.displayName}${location ? ` in ${location}` : ''} — a verified offbeat property on Duffleup.`
    const coverImage = (property as { coverImageUrl?: string }).coverImageUrl
    return {
      title,
      description,
      alternates: { canonical: `https://duffleup.in/properties/${params.slug}` },
      openGraph: {
        title,
        description,
        url: `https://duffleup.in/properties/${params.slug}`,
        type: 'website',
        ...(coverImage && {
          images: [{ url: coverImage, width: 1200, height: 630, alt: property.displayName }],
        }),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(coverImage && { images: [coverImage] }),
      },
    }
  } catch {
    return { title: 'Stay — Duffleup' }
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Params
}) {
  const [result, moodConfig] = await Promise.all([
    loadProperty(params.slug),
    getMoodConfig({ cache: 'no-store' }).catch(() => ({ moodProfiles: [] })),
  ])

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

  return (
    <PropertyDetailView
      property={result.property}
      moodProfiles={moodConfig.moodProfiles ?? []}
    />
  )
}
