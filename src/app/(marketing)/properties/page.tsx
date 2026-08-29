import type { Metadata } from 'next'
import {
  getProperties,
  mapIntentParamsToSearch,
  type IntentSearchParams,
} from '@/lib/api'
import type { PublicProperty } from '@/lib/api/types/property'
import { PropertiesResults } from './PropertiesResults'

export const metadata: Metadata = {
  title: 'Stays — Duffleup',
  robots: { index: false, follow: false },
}

// SP-F1 B.2 — search results. Server Component reads the intent-collector URL
// params, searches /api/v1/search, and hands the list to the client grid.
// Filters (edit dates/guests), URL sync, and empty-state polish are B.3 / B.4.

type RawSearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function toInt(value: string | string[] | undefined): number | undefined {
  const s = first(value)
  if (s == null || s === '') return undefined
  const n = Number.parseInt(s, 10)
  return Number.isNaN(n) ? undefined : n
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: RawSearchParams
}) {
  // Exact keys the intent collector serializes (build-search-url.ts).
  const intent: IntentSearchParams = {
    mood: first(searchParams.mood),
    sub: first(searchParams.sub),
    checkin: first(searchParams.checkin),
    checkout: first(searchParams.checkout),
    adults: toInt(searchParams.adults),
    children: toInt(searchParams.children),
    infants: toInt(searchParams.infants),
  }

  let properties: PublicProperty[] = []
  let error = false
  try {
    const res = await getProperties(mapIntentParamsToSearch(intent))
    // Guard the envelope: an unexpected shape (e.g. a backend still on the old
    // {results} contract) must surface as an error, never crash rendering.
    if (Array.isArray(res?.data)) {
      properties = res.data
    } else {
      error = true
    }
  } catch {
    error = true
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-12">
      <PropertiesResults properties={properties} error={error} />
    </main>
  )
}
