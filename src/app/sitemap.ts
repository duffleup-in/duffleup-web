import type { MetadataRoute } from 'next'

const BASE_URL = 'https://duffleup.in'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.duffleup.in/api/v1'

interface PropertySlug {
  slug: string
  updatedAt?: string
}

interface SearchResponse {
  results: PropertySlug[]
  count: number
}

async function getAllPropertySlugs(): Promise<PropertySlug[]> {
  try {
    const slugs: PropertySlug[] = []
    let offset = 0
    const limit = 100

    while (true) {
      const url = `${API_URL}/search?limit=${limit}&offset=${offset}&fields=slug,updatedAt`
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (!res.ok) break

      const data: SearchResponse = await res.json()
      const items = data.results ?? []
      slugs.push(...items)

      if (slugs.length >= data.count || items.length < limit) break
      offset += limit
    }

    return slugs
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/list-your-property`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const propertySlugs = await getAllPropertySlugs()
  const propertyPages: MetadataRoute.Sitemap = propertySlugs
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE_URL}/properties/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  return [...staticPages, ...propertyPages]
}
