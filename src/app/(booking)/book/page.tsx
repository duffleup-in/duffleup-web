'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, MapPin } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { getAccessToken } from '@/lib/auth/storage'
import { getPropertyBySlug } from '@/lib/api/properties'
import { getQuote, createBooking, initiatePayment } from '@/lib/api/bookings'
import type { QuoteResponse, BookingResponse } from '@/lib/api/bookings'
import type { PropertyDetail, PublicUnit } from '@/lib/api/types/property'
import { ApiError } from '@/lib/api/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function rupees(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn).getTime()
  const b = new Date(checkOut).getTime()
  return Math.max(0, Math.round((b - a) / 86_400_000))
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PriceLineSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-sterling" />
          <div className="h-4 w-16 rounded bg-sterling" />
        </div>
      ))}
      <div className="mt-3 border-t border-line pt-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-12 rounded bg-sterling" />
          <div className="h-6 w-20 rounded bg-sterling" />
        </div>
      </div>
    </div>
  )
}

function PriceBreakdown({ quote }: { quote: QuoteResponse }) {
  return (
    <div className="space-y-2 text-[14px]">
      <div className="flex items-center justify-between">
        <span className="text-pitch-soft">
          {rupees(quote.nightlyRate)} × {quote.numNights} night{quote.numNights !== 1 ? 's' : ''}
        </span>
        <span>{rupees(quote.baseAmount)}</span>
      </div>
      {quote.customerFee > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-pitch-soft">Platform fee</span>
          <span>{rupees(quote.customerFee)}</span>
        </div>
      )}
      {quote.gstAmount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-pitch-soft">GST</span>
          <span>{rupees(quote.gstAmount)}</span>
        </div>
      )}
      <div className="mt-3 border-t-2 border-pitch pt-3">
        <div className="flex items-center justify-between">
          <span className="font-utility text-subh uppercase tracking-[0.05em]">Total</span>
          <span className="font-utility text-h6">{rupees(quote.totalAmount)}</span>
        </div>
        {quote.currency && quote.currency !== 'INR' && (
          <p className="mt-0.5 text-right text-[12px] text-pitch-soft">{quote.currency}</p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Field-level validation helpers
// ---------------------------------------------------------------------------

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialRequests: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.firstName.trim()) errors.firstName = 'First name is required'
  if (!values.lastName.trim()) errors.lastName = 'Last name is required'
  if (!values.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address'
  }
  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!/^[+\d][\d\s\-()]{7,}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number'
  }
  return errors
}

// ---------------------------------------------------------------------------
// Confirmed / payment-initiating state
// ---------------------------------------------------------------------------

function BookingConfirmed({ booking, checkIn, checkOut }: {
  booking: BookingResponse
  checkIn: string
  checkOut: string
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg">
        <CheckCircle2 size={36} className="text-success" />
      </div>
      <h1 className="font-display text-h5">Booking Confirmed</h1>
      <p className="mt-2 text-[16px] text-pitch-soft">
        Ref: <span className="font-utility text-subh tracking-[0.05em]">{booking.ref}</span>
      </p>
      <p className="mt-4 max-w-[380px] text-[15px] text-pitch-soft leading-relaxed">
        {formatDate(checkIn)} → {formatDate(checkOut)} · Proceeding to payment…
      </p>
      <div className="mt-8 flex items-center gap-2 text-[14px] text-pitch-soft">
        <Loader2 size={16} className="animate-spin" />
        <span>Setting up your payment…</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Payment error state
// ---------------------------------------------------------------------------

function PaymentError({
  booking,
  onRetry,
  retrying,
}: {
  booking: BookingResponse
  onRetry: () => void
  retrying: boolean
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-danger-bg">
        <AlertCircle size={36} className="text-danger" />
      </div>
      <h1 className="font-display text-h5">Payment could not be initiated</h1>
      <p className="mt-2 text-[16px] text-pitch-soft">
        Your booking is confirmed — don&apos;t worry, it&apos;s saved.
      </p>
      <p className="mt-1 text-[16px] text-pitch-soft">
        Booking ref:{' '}
        <span className="font-utility text-subh tracking-[0.05em]">{booking.ref}</span>
      </p>
      <p className="mt-6 max-w-[420px] text-[14px] text-pitch-soft leading-relaxed">
        We couldn&apos;t connect to the payment provider. You can retry below, or reach
        out and we&apos;ll sort it out for you.
      </p>
      <Button
        variant="primary"
        size="md"
        className="mt-8"
        onClick={onRetry}
        disabled={retrying}
      >
        {retrying ? (
          <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Retrying…
          </span>
        ) : (
          'Retry Payment'
        )}
      </Button>
      <p className="mt-4 text-[13px] text-pitch-soft">
        Need help?{' '}
        <a
          href="mailto:support@duffleup.in"
          className="underline hover:text-hyperpurple"
        >
          support@duffleup.in
        </a>
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

function BookPageInner() {
  const searchParams = useSearchParams()
  const { status: authStatus, user } = useAuth()

  // URL params
  const propertySlug = searchParams.get('property') ?? ''
  const unitId = searchParams.get('unit') ?? ''
  const checkIn = searchParams.get('checkin') ?? ''
  const checkOut = searchParams.get('checkout') ?? ''
  const adults = parseInt(searchParams.get('adults') ?? '2', 10)
  const children = parseInt(searchParams.get('children') ?? '0', 10)

  // Data state
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [propertyError, setPropertyError] = useState<string | null>(null)
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  })
  const [touched, setTouched] = useState<Record<keyof FormErrors, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmedBooking, setConfirmedBooking] = useState<BookingResponse | null>(null)

  // Payment state
  const [paymentError, setPaymentError] = useState(false)
  const [paymentRetrying, setPaymentRetrying] = useState(false)

  // Prefill form from auth user
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        firstName: prev.firstName || user.firstName || '',
        lastName: prev.lastName || user.lastName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }))
    }
  }, [user])

  // Fetch property
  useEffect(() => {
    if (!propertySlug) return
    getPropertyBySlug(propertySlug)
      .then(setProperty)
      .catch((err) => {
        setPropertyError(
          err instanceof ApiError && err.status === 404
            ? 'Property not found.'
            : 'Could not load property details.'
        )
      })
  }, [propertySlug])

  // Fetch quote
  const fetchQuote = useCallback(() => {
    if (!unitId || !checkIn || !checkOut) return
    setQuoteLoading(true)
    setQuoteError(null)
    getQuote({ unitId, checkIn, checkOut, adults, children: children || undefined })
      .then((q) => {
        setQuote(q)
        setQuoteLoading(false)
      })
      .catch((err) => {
        setQuoteError(
          err instanceof ApiError
            ? (err.message || 'Could not load pricing.')
            : 'Could not load pricing.'
        )
        setQuoteLoading(false)
      })
  }, [unitId, checkIn, checkOut, adults, children])

  useEffect(() => {
    fetchQuote()
  }, [fetchQuote])

  // Trigger payment initiation once booking is confirmed
  const triggerPayment = useCallback(async (booking: BookingResponse) => {
    const token = getAccessToken()
    if (!token) return
    try {
      const result = await initiatePayment(booking.id, token)
      window.location.href = result.redirectUrl
    } catch {
      setPaymentError(true)
      setPaymentRetrying(false)
    }
  }, [])

  useEffect(() => {
    if (!confirmedBooking) return
    triggerPayment(confirmedBooking)
  }, [confirmedBooking, triggerPayment])

  // Derived
  const selectedUnit: PublicUnit | null =
    property?.units.find((u) => u.id === unitId) ?? null

  const fieldErrors = validateForm(form)
  const isFormValid = Object.keys(fieldErrors).length === 0
  const canSubmit = isFormValid && (quote !== null) && !submitLoading

  // --------------------------
  // Handlers
  // --------------------------

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleBlur(field: keyof FormErrors) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Touch all fields to surface errors
    setTouched({ firstName: true, lastName: true, email: true, phone: true })
    if (!isFormValid || !quote || !property) return

    const token = getAccessToken()
    if (!token) {
      setSubmitError('Your session has expired. Please sign in again.')
      return
    }

    setSubmitLoading(true)
    setSubmitError(null)
    try {
      const booking = await createBooking(
        {
          propertyId: property.id,
          unitId,
          checkIn,
          checkOut,
          adults,
          children: children || undefined,
          guestName: `${form.firstName.trim()} ${form.lastName.trim()}`,
          guestEmail: form.email.trim(),
          guestPhone: form.phone.trim(),
          specialRequests: form.specialRequests.trim() || undefined,
        },
        token
      )
      setConfirmedBooking(booking)
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? (err.message || 'Booking failed. Please try again.')
          : 'Booking failed. Please try again.'
      )
    } finally {
      setSubmitLoading(false)
    }
  }

  // --------------------------
  // Missing params guard
  // --------------------------

  const missingParams = !propertySlug || !unitId || !checkIn || !checkOut
  if (missingParams) {
    return (
      <main className="mx-auto max-w-[680px] px-6 py-16 text-center">
        <h1 className="font-display text-h5">Incomplete booking link</h1>
        <p className="mt-3 text-[15px] text-pitch-soft">
          The booking link is missing required details (property, unit, or dates).
          Please start from the property page.
        </p>
        <Button asChild variant="primary" size="md" className="mt-6">
          <Link href="/properties">Browse stays</Link>
        </Button>
      </main>
    )
  }

  // --------------------------
  // Auth guard (after params check so the redirect URL is stable)
  // --------------------------

  if (authStatus === 'loading') {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={24} className="animate-spin text-pitch-soft" />
      </main>
    )
  }

  if (authStatus === 'unauthenticated') {
    const next = encodeURIComponent(`/book?${searchParams.toString()}`)
    return (
      <main className="mx-auto max-w-[680px] px-6 py-16 text-center">
        <h1 className="font-display text-h5">Sign in to complete your booking</h1>
        <p className="mt-3 text-[15px] text-pitch-soft">
          We need to attach the booking to your account so you can manage it later.
        </p>
        <Button asChild variant="primary" size="md" className="mt-6">
          <Link href={`/login?next=${next}`}>Sign in</Link>
        </Button>
        <p className="mt-4 text-[14px] text-pitch-soft">
          New here?{' '}
          <Link
            href={`/register?next=${next}`}
            className="underline hover:text-hyperpurple"
          >
            Create an account
          </Link>
        </p>
      </main>
    )
  }

  // --------------------------
  // Confirmed / payment states
  // --------------------------

  if (confirmedBooking) {
    if (paymentError) {
      return (
        <main className="mx-auto max-w-[900px] px-6 py-8">
          <PaymentError
            booking={confirmedBooking}
            retrying={paymentRetrying}
            onRetry={() => {
              setPaymentError(false)
              setPaymentRetrying(true)
              triggerPayment(confirmedBooking)
            }}
          />
        </main>
      )
    }

    return (
      <main className="mx-auto max-w-[900px] px-6 py-8">
        <BookingConfirmed
          booking={confirmedBooking}
          checkIn={checkIn}
          checkOut={checkOut}
        />
      </main>
    )
  }

  // --------------------------
  // Property error
  // --------------------------

  if (propertyError) {
    return (
      <main className="mx-auto max-w-[680px] px-6 py-16 text-center">
        <Alert variant="danger" title="Could not load property" className="text-left">
          {propertyError}
        </Alert>
        <Button asChild variant="secondary-dark" size="md" className="mt-6">
          <Link href="/properties">Browse stays</Link>
        </Button>
      </main>
    )
  }

  const nights = nightsBetween(checkIn, checkOut)
  const guestCount = adults + (children || 0)

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-10 pt-[88px]">
      {/* Back link */}
      {propertySlug && (
        <Link
          href={`/properties/${propertySlug}`}
          className="mb-6 inline-flex items-center gap-1.5 font-utility text-subtitle uppercase tracking-[0.08em] text-pitch-soft no-underline transition-colors hover:text-pitch"
        >
          <ChevronLeft size={16} />
          Back to property
        </Link>
      )}

      <h1 className="font-display text-h5">Complete your booking</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* ---------------------------------------------------------------- */}
        {/* Left column — stay summary + guest form                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-8">
          {/* Stay summary card */}
          <section className="rounded-md border-2 border-line bg-white p-6">
            <h2 className="font-utility text-subh uppercase tracking-[0.05em]">Your stay</h2>

            {property ? (
              <div className="mt-4 space-y-3">
                <div>
                  <p className="font-utility text-h6">{property.displayName}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[14px] text-pitch-soft">
                    <MapPin size={13} aria-hidden="true" />
                    {[property.area, property.city, property.state]
                      .filter(Boolean)
                      .filter((v, i, arr) => arr.indexOf(v) === i)
                      .join(', ')}
                  </p>
                </div>

                {selectedUnit && (
                  <div className="rounded-sm bg-sterling-warm px-4 py-3">
                    <p className="font-utility text-subtitle uppercase tracking-[0.08em] text-pitch-soft">
                      Unit
                    </p>
                    <p className="mt-0.5 font-utility text-subh">{selectedUnit.name}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-sm bg-sterling-warm px-4 py-3">
                    <p className="font-utility text-caption uppercase tracking-[0.1em] text-pitch-soft">
                      Check-in
                    </p>
                    <p className="mt-0.5 text-[15px] font-medium">{formatDate(checkIn)}</p>
                  </div>
                  <div className="rounded-sm bg-sterling-warm px-4 py-3">
                    <p className="font-utility text-caption uppercase tracking-[0.1em] text-pitch-soft">
                      Check-out
                    </p>
                    <p className="mt-0.5 text-[15px] font-medium">{formatDate(checkOut)}</p>
                  </div>
                </div>

                <div className="rounded-sm bg-sterling-warm px-4 py-3">
                  <p className="font-utility text-caption uppercase tracking-[0.1em] text-pitch-soft">
                    Guests
                  </p>
                  <p className="mt-0.5 text-[15px] font-medium">
                    {adults} adult{adults !== 1 ? 's' : ''}
                    {children > 0 && `, ${children} child${children !== 1 ? 'ren' : ''}`}
                    {' · '}
                    {nights} night{nights !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ) : (
              // Skeleton while property loads
              <div className="mt-4 animate-pulse space-y-3">
                <div className="h-6 w-48 rounded bg-sterling" />
                <div className="h-4 w-32 rounded bg-sterling" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 rounded bg-sterling" />
                  <div className="h-16 rounded bg-sterling" />
                </div>
                <div className="h-14 rounded bg-sterling" />
              </div>
            )}
          </section>

          {/* Guest details form */}
          <section className="rounded-md border-2 border-line bg-white p-6">
            <h2 className="font-utility text-subh uppercase tracking-[0.05em]">Guest details</h2>

            {submitError && (
              <Alert
                variant="danger"
                title="Booking failed"
                dismissable
                onDismiss={() => setSubmitError(null)}
                className="mt-4"
              >
                {submitError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label="First name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('firstName')}
                  state={touched.firstName && fieldErrors.firstName ? 'error' : 'default'}
                  helperText={touched.firstName ? fieldErrors.firstName : undefined}
                  autoComplete="given-name"
                  className="max-w-full"
                />
                <Input
                  label="Last name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('lastName')}
                  state={touched.lastName && fieldErrors.lastName ? 'error' : 'default'}
                  helperText={touched.lastName ? fieldErrors.lastName : undefined}
                  autoComplete="family-name"
                  className="max-w-full"
                />
              </div>

              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                state={touched.email && fieldErrors.email ? 'error' : 'default'}
                helperText={touched.email ? fieldErrors.email : undefined}
                autoComplete="email"
                className="max-w-full"
              />

              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                state={touched.phone && fieldErrors.phone ? 'error' : 'default'}
                helperText={touched.phone ? fieldErrors.phone : undefined}
                autoComplete="tel"
                placeholder="+91 98765 43210"
                className="max-w-full"
              />

              <div className="flex max-w-full flex-col gap-1.5">
                <label
                  htmlFor="specialRequests"
                  className="font-utility text-subtitle uppercase tracking-[0.1em] text-pitch"
                >
                  Special requests{' '}
                  <span className="normal-case tracking-normal text-pitch-soft">(optional)</span>
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={form.specialRequests}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Dietary requirements, accessibility needs, late check-in…"
                  className={cn(
                    'w-full rounded-sm border-2 border-line-strong bg-white px-4 py-3',
                    'font-body text-body text-pitch transition-colors duration-150',
                    'hover:border-hyperpurple-75 focus:border-hyperpurple focus:outline-none',
                    'resize-none placeholder:text-pitch-soft/60'
                  )}
                />
              </div>

              {/* Mobile-only submit (also appears in sidebar on desktop) */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!canSubmit}
                  className="w-full"
                >
                  {submitLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Confirming…
                    </span>
                  ) : (
                    <>
                      Confirm &amp; Pay
                      {quote ? ` — ${rupees(quote.totalAmount)}` : ''}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </section>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right column — price breakdown + sticky CTA                     */}
        {/* ---------------------------------------------------------------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border-2 border-pitch bg-white p-6 shadow-pop">
            <h2 className="font-utility text-subh uppercase tracking-[0.05em]">
              Price breakdown
            </h2>

            <div className="mt-4">
              {quoteLoading && <PriceLineSkeleton />}
              {quoteError && !quoteLoading && (
                <div className="space-y-3">
                  <p className="text-[14px] text-danger">{quoteError}</p>
                  <button
                    type="button"
                    onClick={fetchQuote}
                    className="font-utility text-subtitle uppercase tracking-[0.08em] text-pitch underline hover:text-hyperpurple"
                  >
                    Retry
                  </button>
                </div>
              )}
              {quote && !quoteLoading && <PriceBreakdown quote={quote} />}
            </div>

            {/* Desktop CTA */}
            <div className="mt-6 hidden lg:block">
              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="w-full"
              >
                {submitLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Confirming…
                  </span>
                ) : (
                  <>
                    Confirm &amp; Pay
                    {quote ? ` — ${rupees(quote.totalAmount)}` : ''}
                  </>
                )}
              </Button>

              {!isFormValid && Object.keys(touched).some((k) => touched[k as keyof typeof touched]) && (
                <p className="mt-2 text-center text-[13px] text-danger">
                  Please complete all required fields above.
                </p>
              )}

              {!quote && !quoteLoading && !quoteError && (
                <p className="mt-2 text-center text-[13px] text-pitch-soft">
                  Loading pricing…
                </p>
              )}
            </div>

            <p className="mt-4 text-center text-[12px] text-pitch-soft">
              No hidden fees · Free cancellation varies by property
            </p>
          </div>

          {/* Stay metadata recap (desktop sidebar) */}
          {(checkIn || checkOut || guestCount) && (
            <div className="mt-4 rounded-sm border border-line bg-sterling-warm p-4 text-[13px] text-pitch-soft">
              <p>
                <span className="font-medium text-pitch">{formatDate(checkIn)}</span>
                {' → '}
                <span className="font-medium text-pitch">{formatDate(checkOut)}</span>
              </p>
              <p className="mt-1">
                {guestCount} guest{guestCount !== 1 ? 's' : ''} · {nights} night{nights !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}

// useSearchParams() must be wrapped in a Suspense boundary to allow static
// pre-rendering of the rest of the app.
export default function BookPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center">
          <Loader2 size={24} className="animate-spin text-pitch-soft" />
        </main>
      }
    >
      <BookPageInner />
    </Suspense>
  )
}
