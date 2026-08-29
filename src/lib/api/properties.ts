// Property search client. Follows the F0.B pattern (apiFetch + resource-relative
// path under the /api/v1 base). Consumed by the /properties search page (B.2+).
//
// The canonical search endpoint is /search, NOT /properties — see
// duffleup-api SearchController. The bare /properties path is not a list
// endpoint (it 404s); property DETAIL is /properties/slug/:slug and
// /properties/:id.

import { apiFetch } from './client'
import type { MoodKey } from './types/mood-config'
import type {
  PropertyDetail,
  PropertyListResponse,
  PropertySearchParams,
} from './types/property'

/** Intent-collector URL params (the shape the collector serializes into the URL). */
export type IntentSearchParams = {
  mood?: string
  sub?: string
  checkin?: string
  checkout?: string
  adults?: number
  children?: number
  infants?: number
}

/**
 * Bridges the intent-collector's URL params to the backend /search DTO. The two
 * vocabularies differ: the collector emits `mood` (singular, lowercase),
 * `checkin`/`checkout`, and separate guest tiers; /search wants `moods[]`
 * (uppercase), `checkIn`/`checkOut`, and a single `guests` total.
 *
 * NOTE — two mapping details:
 *  - guests = adults + children. Infants are free and do NOT count toward
 *    capacity (Phase A hospitality ruling, adjudicated in B.2). The backend has
 *    only a single `guests` filter (≥ Property.maxGuests).
 *  - checkIn/checkOut are forwarded, but /search currently only LOGS them — it
 *    does not filter by availability (see audit). Harmless to pass; no effect yet.
 */
export function mapIntentParamsToSearch(
  intent: IntentSearchParams
): PropertySearchParams {
  const params: PropertySearchParams = {}
  if (intent.mood) params.moods = [intent.mood.toUpperCase() as MoodKey]
  if (intent.sub) params.sub = intent.sub
  if (intent.checkin) params.checkIn = intent.checkin
  if (intent.checkout) params.checkOut = intent.checkout

  const guests = (intent.adults ?? 0) + (intent.children ?? 0)
  if (guests > 0) params.guests = guests

  return params
}

function toQueryString(params: PropertySearchParams): string {
  const q = new URLSearchParams()
  if (params.moods?.length) q.set('moods', params.moods.join(','))
  if (params.sub) q.set('sub', params.sub)
  if (params.checkIn) q.set('checkIn', params.checkIn)
  if (params.checkOut) q.set('checkOut', params.checkOut)
  if (params.guests != null) q.set('guests', String(params.guests))
  if (params.minPrice != null) q.set('minPrice', String(params.minPrice))
  if (params.maxPrice != null) q.set('maxPrice', String(params.maxPrice))
  if (params.propertyType?.length)
    q.set('propertyType', params.propertyType.join(','))
  if (params.petsAllowed) q.set('petsAllowed', 'true')
  if (params.area) q.set('area', params.area)
  if (params.location) q.set('location', params.location)
  if (params.page != null) q.set('page', String(params.page))
  if (params.limit != null) q.set('limit', String(params.limit))
  if (params.sortBy) q.set('sortBy', params.sortBy)
  return q.toString()
}

/** GET /search. Throws `ApiError` on non-2xx. */
export function getProperties(
  params: PropertySearchParams = {},
  options?: Parameters<typeof apiFetch>[1]
): Promise<PropertyListResponse> {
  const qs = toQueryString(params)
  // Search is query-driven and must never be served from Next's Data Cache —
  // a stale body (e.g. one fetched while the backend was on the old shape)
  // would otherwise be replayed on every request. Default to no-store; callers
  // can still override via `options`.
  return apiFetch<PropertyListResponse>(`/search${qs ? `?${qs}` : ''}`, {
    cache: 'no-store',
    ...options,
  })
}

/**
 * GET /properties/slug/:slug — the public property DETAIL endpoint (distinct
 * from /search, which is the list). Returns the full property with its bookable
 * units. Throws `ApiError` on non-2xx (a 404 surfaces as `ApiError.status ===
 * 404`, which the detail page maps to Next's notFound()).
 *
 * The slug is path-encoded so an odd slug can't break the URL.
 */
export function getPropertyBySlug(
  slug: string,
  options?: Parameters<typeof apiFetch>[1]
): Promise<PropertyDetail> {
  return apiFetch<PropertyDetail>(
    `/properties/slug/${encodeURIComponent(slug)}`,
    options
  )
}
