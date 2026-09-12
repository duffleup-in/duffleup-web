import { apiFetch, apiMutate } from './client'

export interface GuestReview {
  id: string
  propertyId: string
  bookingId?: string
  rating: number
  text: string
  guestFirstName: string
  date: string
  ownerResponse?: string | null
}

export interface SubmitReviewPayload {
  propertyId: string
  bookingId: string
  rating: number
  text: string
}

export function submitReview(
  payload: SubmitReviewPayload,
  authToken: string
): Promise<GuestReview> {
  return apiMutate<GuestReview>('/reviews', { body: payload, authToken })
}

export function getPropertyReviews(propertyId: string): Promise<GuestReview[]> {
  return apiFetch<GuestReview[]>(`/reviews/property/${propertyId}`, {
    next: { revalidate: 300 },
  })
}
