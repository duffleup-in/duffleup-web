import type { IntentState } from './intent-state'

/**
 * Serializes collected intent into the /properties search URL.
 * `mood` and `sub` are lowercased (URL convention); dates are ISO 8601 date
 * strings (YYYY-MM-DD); guests are integers. Consumed by SP-F1 Phase B.
 *
 * @example /properties?mood=chill&sub=solo&checkin=2026-08-05&checkout=2026-08-08&adults=2&children=0
 */
export function buildSearchUrl(state: IntentState): string {
  const params = new URLSearchParams()
  if (state.mood) params.set('mood', state.mood.toLowerCase())
  if (state.sub) params.set('sub', state.sub.toLowerCase())
  if (state.checkin) params.set('checkin', state.checkin.toISOString().split('T')[0])
  if (state.checkout) params.set('checkout', state.checkout.toISOString().split('T')[0])
  params.set('adults', state.adults.toString())
  params.set('children', state.children.toString())
  return `/properties?${params.toString()}`
}
