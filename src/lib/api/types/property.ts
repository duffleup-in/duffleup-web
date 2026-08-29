// Frontend mirror of duffleup-api's PublicPropertyDto / PublicUnitDto
// (src/properties/dto/public-property.dto.ts) and the /search response envelope
// (PropertiesService.search). Sync manually when the backend DTO changes.
//
// Verified against the live prod response at
// https://api.duffleup.in/api/v1/search on 2026-07-25 (SP-F1 B.1 audit).
//
// Only the fields B.2+ is likely to consume are typed here; the backend DTO
// carries more (DQI internals stay owner-only and never reach this surface).

import type { MoodKey } from './mood-config'

/** Backend `PropertyTier` enum — the quality badge (matches components/ui/Badge). */
export type PropertyTier = 'RAW' | 'REAL' | 'RARE'

/** Backend `PropertyType` enum (flat taxonomy, sub-prompt-16). */
export type PropertyType =
  | 'VILLA'
  | 'HOMESTAY'
  | 'COTTAGE'
  | 'RESORT'
  | 'BOUTIQUE_HOTEL'
  | 'GLAMPING'
  | 'TREEHOUSE'
  | 'FARMSTAY'
  | 'HERITAGE'

export interface PublicUnit {
  id: string
  name: string
  unitType: string
  description: string | null
  baseOccupancy: number
  maxOccupancy: number
  amenities: string[]
  photos: string[]
  /** Nightly baseline rate for today, or null when the unit has no active rates. */
  currentRate: number | null
  hasActiveRates: boolean
  /** Phase-2.5.1: curated discovery moods for this unit. */
  moods: MoodKey[]
  /** Phase-2.5.5: MoodContext tag keys on this unit (e.g. ["romance.anniversary"]). */
  contextTags: string[]
}

export interface PublicProperty {
  id: string
  slug: string
  /** Public-facing name. Internal `name` is owner-only and never in this DTO. */
  displayName: string
  description: string | null
  propertyType: PropertyType | string
  city: string
  state: string
  country: string
  area: string
  photos: string[]
  coverPhoto: string | null
  amenities: string[]
  /** MIN nightly rate across bookable units; null ⇒ dropped from search results. */
  priceFrom: number | null
  isPublished: boolean
  tier: PropertyTier | string
  petsAllowed: boolean
  featuredRank: number | null
  units: PublicUnit[]
  totalUnits: number
  bookableUnitCount: number
  /** Present on /search only when a mood filter was applied. */
  matchedUnits?: PublicUnit[]
  createdAt: string
}

/**
 * Response of the property DETAIL endpoint (GET /properties/slug/:slug and
 * /properties/:id). It is a superset of the search-list `PublicProperty` DTO —
 * the detail serializer may carry extra descriptive fields the list omits. We
 * type the extras as OPTIONAL so the page degrades gracefully whether or not the
 * backend populates them; everything is read defensively on the render side.
 */
export interface PropertyDetail extends PublicProperty {
  /** Long-form house description, if the detail serializer includes one. */
  longDescription?: string | null
  /** Human-readable full address line, when present. */
  address?: string | null
  /** Free-form location detail (landmarks, directions), when present. */
  locationNote?: string | null
  /** Latitude/longitude, when the backend exposes them publicly. */
  latitude?: number | null
  longitude?: number | null
  /** Check-in / check-out house rules, when present. */
  checkInTime?: string | null
  checkOutTime?: string | null
  /** House rules / policies, when present. */
  houseRules?: string[]
  cancellationPolicy?: string | null
}

export interface PropertyListMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  /** Phase-2.5.5: which discovery sort was applied ('mood' | 'mood+sub'). */
  sortedBy?: string
}

export interface PropertyListResponse {
  data: PublicProperty[]
  meta: PropertyListMeta
}

/**
 * Query params the backend /search endpoint accepts. Note these are the
 * BACKEND's names, which differ from the intent-collector URL params — the
 * mapping (mood→moods, checkin→checkIn, adults+children+infants→guests) is the
 * caller's job. See mapIntentParamsToSearch in properties.ts.
 */
export interface PropertySearchParams {
  moods?: MoodKey[]
  sub?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
  propertyType?: PropertyType[]
  petsAllowed?: boolean
  area?: string
  location?: string
  page?: number
  limit?: number
  sortBy?: string
}
