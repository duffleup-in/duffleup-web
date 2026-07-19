/**
 * Formats a price given in paise into a rupee string with Indian digit grouping.
 * Prices from the API arrive in paise (integer) to avoid float rounding; the UI
 * shows rupees (e.g. booking prices, calculation displays).
 *
 * @example formatPrice(800000) // "₹8,000"
 */
export function formatPrice(paise: number): string {
  const rupees = paise / 100
  return `₹${rupees.toLocaleString('en-IN')}`
}
