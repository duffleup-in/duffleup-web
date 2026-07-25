import type { Metadata } from 'next'
import {
  getProperties,
  mapIntentParamsToSearch,
  type IntentSearchParams,
} from '@/lib/api'

export const metadata: Metadata = {
  title: 'Search — Duffleup',
  robots: { index: false, follow: false },
}

// SP-F1 B.1 — DEBUG SCAFFOLD ONLY. This route exists to (a) stop the intent
// collector's submit URL from 404-ing and (b) prove the param + data flow end
// to end. Real search UI (PropertyCard, filters, empty states) is B.2–B.4.
// Intentionally unstyled.

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
  // The intent collector serializes these exact keys (see build-search-url.ts).
  const intent: IntentSearchParams = {
    mood: first(searchParams.mood),
    sub: first(searchParams.sub),
    checkin: first(searchParams.checkin),
    checkout: first(searchParams.checkout),
    adults: toInt(searchParams.adults),
    children: toInt(searchParams.children),
    infants: toInt(searchParams.infants),
  }

  const searchDto = mapIntentParamsToSearch(intent)

  let result:
    | { ok: true; total: number; names: string[]; sortedBy?: string }
    | { ok: false; error: string }
  try {
    const res = await getProperties({ ...searchDto, limit: 3 })
    result = {
      ok: true,
      total: res.meta.total,
      names: res.data.map((p) => p.displayName),
      sortedBy: res.meta.sortedBy,
    }
  } catch (err) {
    result = { ok: false, error: err instanceof Error ? err.message : String(err) }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: 720 }}>
      <h1>/properties — B.1 debug scaffold</h1>
      <p>Real search UI arrives in B.2. This page proves the param + data flow.</p>

      <h2>Parsed intent params</h2>
      <pre>{JSON.stringify(intent, null, 2)}</pre>

      <h2>Mapped /search DTO</h2>
      <pre>{JSON.stringify(searchDto, null, 2)}</pre>

      <h2>Backend /search result</h2>
      {result.ok ? (
        <pre>
          {JSON.stringify(
            {
              total: result.total,
              sortedBy: result.sortedBy ?? null,
              firstThree: result.names,
            },
            null,
            2
          )}
        </pre>
      ) : (
        <pre>Fetch failed: {result.error}</pre>
      )}
    </main>
  )
}
