'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Calendar, MapPin, Loader2, AlertCircle,
  Star, X, CheckCircle2, XCircle, ArrowLeft
} from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { authedFetch, authedMutate } from '@/lib/auth/authFetch'
import type { GuestBooking } from '@/lib/api/bookings'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  })
}

function rupees(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: 'Awaiting payment',
  PAYMENT_FAILED: 'Payment failed',
  CONFIRMED: 'Confirmed',
  MODIFIED: 'Modified',
  CHECKED_IN: 'Checked in',
  COMPLETED: 'Completed',
  CANCELLED_GUEST: 'Cancelled',
  CANCELLED_OWNER: 'Cancelled by host',
  DISPUTED: 'Disputed',
}

const STATUS_CLASS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  MODIFIED: 'bg-blue-100 text-blue-800',
  CHECKED_IN: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-gray-100 text-gray-600',
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
  PAYMENT_FAILED: 'bg-red-100 text-red-800',
  CANCELLED_GUEST: 'bg-red-50 text-red-600',
  CANCELLED_OWNER: 'bg-red-50 text-red-600',
  DISPUTED: 'bg-orange-100 text-orange-800',
}

const CANCELLABLE = new Set(['CONFIRMED', 'MODIFIED'])
const REVIEWABLE = new Set(['COMPLETED'])

// ---------------------------------------------------------------------------
// Star Rating Component
// ---------------------------------------------------------------------------

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
          aria-label={`${n} star${n !== 1 ? 's' : ''}`}
        >
          <Star
            size={28}
            className={cn(
              'transition-colors',
              (hovered || value) >= n
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            )}
          />
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Review modal
// ---------------------------------------------------------------------------

function ReviewModal({
  booking,
  onClose,
  onSubmitted,
}: {
  booking: GuestBooking
  onClose: () => void
  onSubmitted: () => void
}) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a star rating'); return }
    if (text.trim().length < 10) { setError('Please write at least 10 characters'); return }
    setLoading(true)
    setError('')
    try {
      await authedMutate('/reviews', {
        body: { propertyId: booking.id, bookingId: booking.id, rating, text: text.trim() },
      })
      onSubmitted()
      onClose()
    } catch {
      setError('Could not submit your review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-utility text-subh uppercase tracking-wider text-pitch">
              Leave a review
            </h2>
            <p className="text-sm text-pitch/60 mt-0.5">{booking.propertyName}</p>
          </div>
          <button onClick={onClose} className="text-pitch/40 hover:text-pitch transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-pitch/70">Overall rating</p>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-pitch/70" htmlFor="review-text">
            Your experience
          </label>
          <textarea
            id="review-text"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell other guests what made your stay special…"
            className="w-full rounded border border-line px-3 py-2 text-sm text-pitch focus:outline-none focus:ring-2 focus:ring-hyperpurple resize-none"
          />
          <p className="text-xs text-pitch/40 text-right">{text.trim().split(/\s+/).filter(Boolean).length} words</p>
        </div>

        {error && <Alert variant="danger" title={error} />}

        <div className="flex gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : 'Submit review'}
          </Button>
          <Button variant="secondary-dark" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Cancel modal
// ---------------------------------------------------------------------------

function CancelModal({
  booking,
  onClose,
  onCancelled,
}: {
  booking: GuestBooking
  onClose: () => void
  onCancelled: () => void
}) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCancel = async () => {
    if (!reason.trim()) { setError('Please provide a reason'); return }
    setLoading(true)
    setError('')
    try {
      await authedMutate(`/bookings/${booking.id}/cancel`, { body: { reason: reason.trim() } })
      onCancelled()
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to cancel'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="font-utility text-subh uppercase tracking-wider text-pitch">
            Cancel booking
          </h2>
          <button onClick={onClose} className="text-pitch/40 hover:text-pitch transition-colors">
            <X size={20} />
          </button>
        </div>

        <Alert variant="warning" title="Cancellation may incur fees">
          Refund amounts depend on the property&apos;s cancellation policy and how close to check-in you cancel.
        </Alert>

        <div className="bg-sterling-warm rounded p-3 text-sm space-y-1">
          <p className="font-medium text-pitch">{booking.propertyName}</p>
          <p className="text-pitch/60">{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</p>
          <p className="font-medium text-pitch">{rupees(booking.amount)}</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-pitch/70" htmlFor="cancel-reason">
            Reason for cancellation
          </label>
          <textarea
            id="cancel-reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please let the host know why you're cancelling…"
            className="w-full rounded border border-line px-3 py-2 text-sm text-pitch focus:outline-none focus:ring-2 focus:ring-hyperpurple resize-none"
          />
        </div>

        {error && <Alert variant="danger" title={error} />}

        <div className="flex gap-3">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Cancelling…</> : 'Confirm cancellation'}
          </Button>
          <Button variant="secondary-dark" size="sm" onClick={onClose}>
            Keep booking
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Booking card
// ---------------------------------------------------------------------------

function BookingCard({
  booking,
  onRefresh,
}: {
  booking: GuestBooking
  onRefresh: () => void
}) {
  const [showReview, setShowReview] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [reviewed, setReviewed] = useState(false)

  const statusClass = STATUS_CLASS[booking.status] ?? 'bg-gray-100 text-gray-600'
  const canCancel = CANCELLABLE.has(booking.status)
  const canReview = REVIEWABLE.has(booking.status) && !reviewed
  const isPendingPayment = booking.status === 'PENDING_PAYMENT'

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-line overflow-hidden">
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', statusClass)}>
                  {STATUS_LABEL[booking.status] ?? booking.status}
                </span>
                <span className="font-utility text-caption uppercase tracking-wider text-pitch/40">
                  {booking.ref}
                </span>
              </div>
              <p className="font-utility text-subh uppercase tracking-wider text-pitch mt-2">
                {booking.propertyName ?? 'Your stay'}
              </p>
              {booking.unitName && (
                <p className="text-sm text-pitch/60">{booking.unitName}</p>
              )}
            </div>
            <p className="font-medium text-pitch shrink-0">{rupees(booking.amount)}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-pitch/60">
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
            </span>
            {booking.numNights && (
              <span>{booking.numNights} night{booking.numNights !== 1 ? 's' : ''}</span>
            )}
          </div>

          <div className="flex gap-2 flex-wrap pt-1">
            {isPendingPayment && (
              <Link href={`/book/${booking.id}/confirmed`}>
                <Button size="sm" variant="primary">
                  Complete payment
                </Button>
              </Link>
            )}
            {canReview && (
              <Button
                size="sm"
                variant="secondary-dark"
                onClick={() => setShowReview(true)}
              >
                <Star size={13} />
                Leave a review
              </Button>
            )}
            {reviewed && (
              <span className="flex items-center gap-1 text-sm text-green-700">
                <CheckCircle2 size={14} /> Review submitted
              </span>
            )}
            {canCancel && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCancel(true)}
                className="text-danger"
              >
                <XCircle size={13} />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {showReview && (
        <ReviewModal
          booking={booking}
          onClose={() => setShowReview(false)}
          onSubmitted={() => setReviewed(true)}
        />
      )}
      {showCancel && (
        <CancelModal
          booking={booking}
          onClose={() => setShowCancel(false)}
          onCancelled={onRefresh}
        />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type BookingsState =
  | { phase: 'loading' }
  | { phase: 'error'; message: string }
  | { phase: 'ready'; bookings: GuestBooking[] }

export default function MyBookingsPage() {
  const router = useRouter()
  const { status } = useAuth()
  const [state, setState] = useState<BookingsState>({ phase: 'loading' })

  const load = useCallback(async () => {
    setState({ phase: 'loading' })
    try {
      const data = await authedFetch<{ results: GuestBooking[]; count: number }>('/bookings/my-bookings')
      setState({ phase: 'ready', bookings: data.results ?? [] })
    } catch {
      setState({ phase: 'error', message: 'Could not load your bookings. Please try again.' })
    }
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?next=/account/bookings')
      return
    }
    if (status === 'authenticated') load()
  }, [status, load, router])

  if (state.phase === 'loading' || status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-hyperpurple" />
      </div>
    )
  }

  if (state.phase === 'error') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center max-w-sm space-y-4">
          <AlertCircle size={40} className="text-danger mx-auto" />
          <p className="font-utility text-subh uppercase text-pitch">{state.message}</p>
          <Button onClick={load} size="sm">Try again</Button>
        </div>
      </div>
    )
  }

  const { bookings } = state

  const upcoming = bookings.filter((b) =>
    ['CONFIRMED', 'MODIFIED', 'CHECKED_IN', 'PENDING_PAYMENT'].includes(b.status)
  )
  const past = bookings.filter((b) =>
    ['COMPLETED', 'CANCELLED_GUEST', 'CANCELLED_OWNER', 'PAYMENT_FAILED'].includes(b.status)
  )

  return (
    <div className="min-h-screen bg-sterling-warm py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-pitch/50 hover:text-pitch transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Home
          </Link>
          <h1 className="font-display text-h5 uppercase text-pitch">My Bookings</h1>
          <p className="text-body text-pitch/60 mt-1">
            {bookings.length === 0 ? 'No bookings yet.' : `${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <MapPin size={40} className="text-pitch/20 mx-auto" />
            <p className="text-body text-pitch/50">You haven&apos;t booked any stays yet.</p>
            <Button asChild size="sm">
              <Link href="/properties">Browse stays</Link>
            </Button>
          </div>
        )}

        {upcoming.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-utility text-caption uppercase tracking-[0.12em] text-pitch/50">
              Upcoming & active
            </h2>
            {upcoming.map((b) => (
              <BookingCard key={b.id} booking={b} onRefresh={load} />
            ))}
          </section>
        )}

        {past.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-utility text-caption uppercase tracking-[0.12em] text-pitch/50">
              Past stays
            </h2>
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} onRefresh={load} />
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
