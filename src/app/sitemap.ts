import type { MetadataRoute } from 'next'

// Force ISR — regenerate this route on-demand, not at build time.
// Without this Next.js statically pre-renders it during `next build`,
// before the Railway deploy can reach the live API, so only static pages appear.
export const revalidate = 3600 // re-fetch property slugs at most every hour

const BASE_URL = 'https://duffleup.in'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.duffleup.in/api/v1'

interface PropertyItem {
  slug: string
  updatedAt?: string
}

interface SearchResponse {
  count: number
  results: PropertyItem[]
}

async function getAllPropertySlugs(): Promise<PropertyItem[]> {
  const all: PropertyItem[] = []
  let offset = 0
  const limit = 100

  try {
    while (true) {
      const url = `${API_URL}/search?limit=${limit}&offset=${offset}`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) break

      const data: SearchResponse = await res.json()
      const items: PropertyItem[] = (data.results ?? []).map((p) => ({
        slug: p.slug,
        updatedAt: p.updatedAt,
      }))

      all.push(...items)

      if (all.length >= data.count || items.length < limit) break
      offset += limit
    }
  } catch {
    // Return whatever we've accumulated so far
  }

  return all
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/properties`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/list-your-property`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const slugs = await getAllPropertySlugs()
  const propertyPages: MetadataRoute.Sitemap = slugs
    .filter((p) => Boolean(p.slug))
    .map((p) => ({
      url: `${BASE_URL}/properties/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  return [...staticPages, ...propertyPages]
}
