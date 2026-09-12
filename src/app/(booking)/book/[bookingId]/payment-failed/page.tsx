'use client'

// Payment failure recovery page.
// PhonePe redirects here with ?bookingId=... when payment fails.
// Lets the guest retry payment or cancel the booking.

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { XCircle, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { getAccessToken } from '@/lib/auth/storage'
import { initiatePayment } from '@/lib/api/bookings'
import { ApiError } from '@/lib/api/client'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

export default function PaymentFailedPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const bookingId = Array.isArray(params.bookingId) ? params.bookingId[0] : params.bookingId
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState('')

  const handleRetry = useCallback(async () => {
    if (!bookingId) return
    const token = getAccessToken()
    if (!token) {
      router.push(`/login?next=/book/${bookingId}/payment-failed`)
      return
    }
    setRetrying(true)
    setError('')
    try {
      const { redirectUrl } = await initiatePayment(bookingId, token)
      window.location.href = redirectUrl
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Payment could not be initiated. Please try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
      setRetrying(false)
    }
  }, [bookingId, router])

  return (
    <main className="min-h-screen bg-sterling-warm flex items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50">
          <XCircle size={40} className="text-danger" strokeWidth={1.5} />
        </div>

        <div>
          <h1 className="font-display text-h5 uppercase text-pitch">
            Payment failed
          </h1>
          <p className="text-body text-pitch/60 mt-2">
            Your payment could not be processed. Your booking is still held — you can retry now.
          </p>
          {bookingId && (
            <p className="font-utility text-caption uppercase tracking-wider text-pitch/40 mt-1">
              Booking: {bookingId}
            </p>
          )}
        </div>

        {error && (
          <Alert variant="danger" title={error} dismissable />
        )}

        <div className="space-y-3">
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleRetry}
              disabled={retrying}
              className="w-full"
            >
              {retrying ? (
                <><Loader2 size={16} className="animate-spin" /> Retrying…</>
              ) : (
                <><RefreshCw size={16} /> Retry payment</>
              )}
            </Button>
          ) : (
            <Button asChild variant="primary" size="md" className="w-full">
              <Link href={`/login?next=/book/${bookingId}/payment-failed`}>
                Sign in to retry
              </Link>
            </Button>
          )}

          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/properties">
              <ArrowLeft size={14} />
              Browse other stays
            </Link>
          </Button>

          {isAuthenticated && (
            <p className="text-xs text-pitch/40">
              Need help?{' '}
              <a href="mailto:support@duffleup.in" className="underline hover:text-pitch transition-colors">
                Contact support
              </a>
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
