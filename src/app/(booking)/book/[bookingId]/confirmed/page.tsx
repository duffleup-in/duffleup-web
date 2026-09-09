// Booking confirmation page (DU-8).
//
// Server Component — fetches GET /bookings/:id and renders the receipt.
// Auth token is accepted from `?token=` search-param (passed by the payment
// callback redirect) so the page works even before the client-side auth store
// has hydrated.
//
// Error handling:
//   401 / 403 → "Please sign in to view this booking."
//   404       → "Booking not found" with a link home.
//   Other     → generic error message (still shows a link home).

import Link from 'next/link'
import { CheckCircle2, Calendar, Users, MapPin, Mail, ArrowLeft } from 'lucide-react'
import { getBookingConfirmation } from '@/lib/api/bookings'
import { ApiError } from '@/lib/api/client'
import { formatPrice } from '@/lib/format-price'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a YYYY-MM-DD string to a human-readable date, e.g. "Sat, 14 Jun 2026". */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  // Use UTC to avoid timezone shifts on server-side rendering.
  const d = new Date(Date.UTC(year, month - 1, day))
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Combine a YYYY-MM-DD with an HH:MM time, e.g. "Sat, 14 Jun 2026 at 2:00 PM". */
function formatDateWithTime(iso: string, time?: string): string {
  const base = formatDate(iso)
  if (!time) return base
  // Parse 24-h time to 12-h display.
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  const mins = String(m).padStart(2, '0')
  return `${base} at ${h12}:${mins} ${period}`
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-utility text-caption uppercase tracking-[0.12em] text-pitch/50 mb-1">
      {children}
    </p>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-line last:border-0">
      <span className="text-subtitle text-pitch/60 shrink-0">{label}</span>
      <span className="text-subtitle font-medium text-pitch text-right">{value}</span>
    </div>
  )
}

function PriceRow({
  label,
  value,
  bold = false,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-3 border-b border-line last:border-0 ${
        bold ? 'border-t-2 border-t-pitch pt-4' : ''
      }`}
    >
      <span className={`${bold ? 'text-body font-medium text-pitch' : 'text-subtitle text-pitch/60'}`}>
        {label}
      </span>
      <span className={`${bold ? 'text-subh font-medium text-pitch' : 'text-subtitle text-pitch'}`}>
        {value}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Error states
// ---------------------------------------------------------------------------

function AuthError() {
  return (
    <main className="min-h-screen bg-sterling-warm flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <p className="font-utility text-h6 uppercase text-pitch mb-2">Sign in required</p>
        <p className="text-body text-pitch/60 mb-6">
          Please sign in to view this booking.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-subtitle text-hyperpurple hover:text-hyperpurple-90 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>
    </main>
  )
}

function NotFoundError() {
  return (
    <main className="min-h-screen bg-sterling-warm flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <p className="font-utility text-h6 uppercase text-pitch mb-2">Booking not found</p>
        <p className="text-body text-pitch/60 mb-6">
          This booking reference doesn&apos;t exist or may have been cancelled.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-subtitle text-hyperpurple hover:text-hyperpurple-90 transition-colors"
        >
          <ArrowLeft size={16} />
          Browse stays
        </Link>
      </div>
    </main>
  )
}

function GenericError({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-sterling-warm flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <p className="font-utility text-h6 uppercase text-pitch mb-2">Something went wrong</p>
        <p className="text-body text-pitch/60 mb-6">{message}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-subtitle text-hyperpurple hover:text-hyperpurple-90 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>
    </main>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ bookingId: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function BookingConfirmedPage({ params, searchParams }: PageProps) {
  const { bookingId } = await params
  const { token } = await searchParams

  // Fetch booking — token may come from the payment callback URL.
  let booking
  try {
    booking = await getBookingConfirmation(bookingId, token)
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401 || err.status === 403) return <AuthError />
      if (err.status === 404) return <NotFoundError />
      return <GenericError message={err.message || 'Unable to load booking details.'} />
    }
    return <GenericError message="Unable to load booking details. Please try again." />
  }

  const currency = booking.currency ?? 'INR'
  const nightLabel = booking.numNights === 1 ? '1 night' : `${booking.numNights} nights`
  const guestLabel = booking.numGuests
    ? booking.numGuests === 1
      ? '1 guest'
      : `${booking.numGuests} guests`
    : null

  return (
    <main className="min-h-screen bg-sterling-warm py-12 px-4">
      <div className="max-w-lg mx-auto space-y-6">

        {/* ── Success header ── */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-bg">
            <CheckCircle2 size={40} className="text-success" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display text-h5 uppercase text-pitch leading-tight">
              Booking Confirmed!
            </h1>
            <p className="font-utility text-subh uppercase tracking-[0.08em] text-pitch/50 mt-1">
              {booking.ref}
            </p>
          </div>
        </div>

        {/* ── Booking details card ── */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-hyperpurple shrink-0" />
            <div>
              <SectionLabel>Property</SectionLabel>
              <p className="text-body font-medium text-pitch">
                {booking.propertyName ?? 'Your stay'}
              </p>
              {booking.unitName && (
                <p className="text-subtitle text-pitch/60">{booking.unitName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-hyperpurple shrink-0" />
            <div className="flex-1">
              <SectionLabel>Dates</SectionLabel>
            </div>
          </div>

          <DetailRow
            label="Check-in"
            value={formatDateWithTime(booking.checkIn, booking.checkInTime ?? '14:00')}
          />
          <DetailRow
            label="Check-out"
            value={formatDateWithTime(booking.checkOut, booking.checkOutTime ?? '11:00')}
          />
          <DetailRow label="Duration" value={nightLabel} />

          {guestLabel && (
            <div className="flex items-center gap-2 pt-2 pb-1">
              <Users size={16} className="text-hyperpurple shrink-0" />
              <span className="text-subtitle text-pitch/60">{guestLabel}</span>
            </div>
          )}
        </div>

        {/* ── Price breakdown card ── */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="font-utility text-subh uppercase tracking-[0.08em] text-pitch mb-2">
            Price breakdown
          </p>
          <p className="text-caption text-pitch/40 mb-4 uppercase tracking-wider">
            {currency === 'INR' ? 'All amounts in INR (₹)' : currency}
          </p>

          <PriceRow
            label={`Base amount (${nightLabel})`}
            value={formatPrice(booking.baseAmount)}
          />
          <PriceRow label="GST" value={formatPrice(booking.gstAmount)} />
          <PriceRow label="Platform fee" value={formatPrice(booking.customerFee)} />
          <PriceRow
            label="Total paid"
            value={formatPrice(booking.amount)}
            bold
          />
        </div>

        {/* ── What happens next ── */}
        <div className="bg-hyperpurple-5 border border-hyperpurple-25 rounded-lg p-6 space-y-4">
          <p className="font-utility text-subh uppercase tracking-[0.08em] text-hyperpurple">
            What happens next
          </p>
          <ul className="space-y-3">
            {[
              "You'll receive a confirmation email shortly.",
              'The property owner will reach out with check-in instructions.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  size={16}
                  className="text-success mt-0.5 shrink-0"
                  strokeWidth={2}
                />
                <span className="text-subtitle text-pitch/80">{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 pt-2 border-t border-hyperpurple-25">
            <Mail size={14} className="text-pitch/50 shrink-0" />
            <p className="text-subtitle text-pitch/60">
              Need help?{' '}
              <a
                href="mailto:support@duffleup.in"
                className="text-hyperpurple hover:text-hyperpurple-90 underline underline-offset-2 transition-colors"
              >
                support@duffleup.in
              </a>
            </p>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-utility text-subh uppercase tracking-[0.1em] text-pitch hover:text-hyperpurple transition-colors"
          >
            <ArrowLeft size={18} />
            Browse more stays
          </Link>
        </div>

      </div>
    </main>
  )
}
