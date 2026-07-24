import { format } from 'date-fns'
import type { IntentState } from './intent-state'

/**
 * Serializes collected intent into the /properties search URL.
 * `mood` and `sub` are lowercased (URL convention); dates are ISO 8601 date
 * strings (YYYY-MM-DD); guests are integers. Consumed by SP-F1 Phase B.
 *
 * Dates are formatted in LOCAL time. react-day-picker hands back local-midnight
 * Date objects, so `toISOString()` (UTC) would shift the calendar day backwards
 * in any positive-offset timezone — e.g. IST (+5:30), where local July 25
 * midnight is still July 24 in UTC. That would silently send every Indian user
 * the day before the one they tapped.
 *
 * @example /properties?mood=chill&sub=solo&checkin=2026-08-05&checkout=2026-08-08&adults=2&children=0&infants=0
 */
export function buildSearchUrl(state: IntentState): string {
  const params = new URLSearchParams()
  if (state.mood) params.set('mood', state.mood.toLowerCase())
  if (state.sub) params.set('sub', state.sub.toLowerCase())
  if (state.checkin) params.set('checkin', format(state.checkin, 'yyyy-MM-dd'))
  if (state.checkout) params.set('checkout', format(state.checkout, 'yyyy-MM-dd'))
  params.set('adults', state.adults.toString())
  params.set('children', state.children.toString())
  params.set('infants', state.infants.toString())
  return `/properties?${params.toString()}`
}
