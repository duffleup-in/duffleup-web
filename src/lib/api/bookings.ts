// Booking API client. Follows the same pattern as properties.ts — apiFetch /
// apiMutate over resource-relative paths under the /api/v1 base.
//
// Authenticated calls (createBooking, getBooking) use the authToken option
// directly. Callers that want automatic token refresh should use authedFetch /
// authedMutate from @/lib/auth/authFetch instead.

import { apiFetch, apiMutate } from './client'

// ---------------------------------------------------------------------------
// Quote
// ---------------------------------------------------------------------------

export interface QuoteRequest {
  unitId: string
  checkIn: string  // YYYY-MM-DD
  checkOut: string
  adults: number
  children?: number
}

export interface QuoteResponse {
  baseAmount: number
  numNights: number
  nightlyRate: number
  gstAmount: number
  customerFee: number
  totalAmount: number
  currency: string
}

export function getQuote(params: QuoteRequest): Promise<QuoteResponse> {
  const qs = new URLSearchParams({
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    adults: String(params.adults),
    ...(params.children ? { children: String(params.children) } : {}),
  })
  return apiFetch<QuoteResponse>(`/units/${params.unitId}/quote?${qs}`, {
    cache: 'no-store',
  })
}

// ---------------------------------------------------------------------------
// Create & fetch booking
// ---------------------------------------------------------------------------

export interface CreateBookingRequest {
  propertyId: string
  unitId: string
  checkIn: string
  checkOut: string
  adults: number
  children?: number
  infants?: number
  guestName: string
  guestEmail: string
  guestPhone: string
  specialRequests?: string
}

export interface BookingResponse {
  id: string
  ref: string
  status: string
  totalAmount: number
  checkIn: string
  checkOut: string
}

/** Full booking detail returned by GET /bookings/:id — used on the confirmation page. */
export interface BookingConfirmation {
  id: string
  ref: string
  status: string
  propertyId: string
  unitId: string
  /** Property display name */
  propertyName?: string
  /** Unit display name */
  unitName?: string
  /** Property check-in time, e.g. "14:00" */
  checkInTime?: string
  /** Property check-out time, e.g. "11:00" */
  checkOutTime?: string
  guestName: string
  checkIn: string
  checkOut: string
  numNights: number
  numGuests?: number
  /** Base amount in paise */
  baseAmount: number
  /** GST in paise */
  gstAmount: number
  /** Platform/customer fee in paise */
  customerFee: number
  /** Total charged in paise */
  amount: number
  currency?: string
}


export function createBooking(
  data: CreateBookingRequest,
  authToken: string
): Promise<BookingResponse> {
  return apiMutate<BookingResponse>('/bookings', { body: data, authToken })
}

export function getBooking(id: string, authToken: string): Promise<BookingResponse> {
  return apiFetch<BookingResponse>(`/bookings/${id}`, { authToken })
}

/**
 * GET /bookings/:id — fetch a booking's full detail for the confirmation page.
 * `authToken` is optional; if omitted the request is unauthenticated (the
 * server will 401 for private bookings).
 */
export function getBookingConfirmation(
  id: string,
  authToken?: string
): Promise<BookingConfirmation> {
  return apiFetch<BookingConfirmation>(
    `/bookings/${encodeURIComponent(id)}`,
    authToken ? { authToken, cache: 'no-store' } : { cache: 'no-store' }
  )
}

// ---------------------------------------------------------------------------
// Initiate payment
// ---------------------------------------------------------------------------

export interface InitiatePaymentResponse {
  redirectUrl: string
  transactionId: string
}

export function initiatePayment(
  bookingId: string,
  authToken: string
): Promise<InitiatePaymentResponse> {
  return apiMutate<InitiatePaymentResponse>(
    `/bookings/${bookingId}/payment/initiate`,
    { authToken, body: {} }
  )
}

// ---------------------------------------------------------------------------
// Guest booking history
// ---------------------------------------------------------------------------

export interface GuestBooking {
  id: string
  ref: string
  status: string
  propertyName?: string
  unitName?: string
  checkIn: string
  checkOut: string
  numNights: number
  numGuests?: number
  amount: number
  currency?: string
  createdAt: string
  cancellationPolicy?: string
}

export interface GuestBookingsResponse {
  results: GuestBooking[]
  count: number
}

export function getMyBookings(authToken: string): Promise<GuestBookingsResponse> {
  return apiFetch<GuestBookingsResponse>('/bookings/my-bookings', {
    authToken,
    cache: 'no-store',
  })
}

export function cancelGuestBooking(
  bookingId: string,
  reason: string,
  authToken: string
): Promise<{ status: string; message: string }> {
  return apiMutate('/bookings/' + bookingId + '/cancel', {
    authToken,
    body: { reason },
  })
}

export function retryPayment(
  bookingId: string,
  authToken: string
): Promise<InitiatePaymentResponse> {
  return apiMutate<InitiatePaymentResponse>(
    `/bookings/${bookingId}/payment/initiate`,
    { authToken, body: {} }
  )
}
