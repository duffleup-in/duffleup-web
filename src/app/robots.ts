import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/',
          '/book/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://duffleup.in/sitemap.xml',
    host: 'https://duffleup.in',
  }
}
