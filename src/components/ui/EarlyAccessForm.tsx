'use client'

import { useState, FormEvent } from 'react'
import { CheckCircle } from 'lucide-react'

type Intent = 'GUEST' | 'OWNER'

interface EarlyAccessFormProps {
  intent: Intent
  source: string
  /** Optional dark-on-light vs light-on-dark styling for different section backgrounds. */
  tone?: 'light' | 'dark'
}

// NEXT_PUBLIC_API_URL already includes the /api/v1 base (see .env.example), so
// the endpoint is `${API_URL}/early-access`. Trailing slash tolerated.
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Sub-prompt-23: landing-page email capture. POSTs to the early-access API with
// the page's intent + source + any UTM params on the URL. Visual styling uses
// the existing Tailwind palette — brand kit redesign is SP-23b.
export default function EarlyAccessForm({ intent, source, tone = 'light' }: EarlyAccessFormProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [propertyLocation, setPropertyLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const isOwner = intent === 'OWNER'
  const onDark = tone === 'dark'

  const inputClass = onDark
    ? 'w-full rounded-full bg-cream/10 border border-cream/30 text-cream placeholder-cream/50 px-5 py-3 font-dm text-sm focus:outline-none focus:border-cream'
    : 'w-full rounded-full bg-white border border-sand/40 text-forest placeholder-stone/50 px-5 py-3 font-dm text-sm focus:outline-none focus:border-terracotta'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setStatus('loading')

    // Capture UTM params from the URL at submit time (no Suspense needed).
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()

    try {
      const res = await fetch(`${API_URL}/early-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          intent,
          source,
          firstName: firstName.trim() || undefined,
          ...(isOwner
            ? {
                phone: phone.trim() || undefined,
                propertyLocation: propertyLocation.trim() || undefined,
                propertyType: propertyType.trim() || undefined,
              }
            : {}),
          utmSource: params.get('utm_source') || undefined,
          utmMedium: params.get('utm_medium') || undefined,
          utmCampaign: params.get('utm_campaign') || undefined,
        }),
      })

      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setStatus('success')
    } catch {
      setError("Couldn't reach our servers. Email hello@duffleup.in and we'll add you to the list manually.")
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-3 rounded-2xl px-6 py-5 font-dm ${onDark ? 'bg-cream/10 text-cream' : 'bg-forest/5 text-forest'}`}>
        <CheckCircle className={onDark ? 'text-cream' : 'text-forest'} size={22} />
        <span>Thanks — check your inbox. We&apos;ll be in touch as we approach launch.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          aria-label="Email address"
        />
        <input
          type="text"
          placeholder="First name (optional)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={inputClass}
          aria-label="First name"
        />
      </div>

      {isOwner && (
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            aria-label="Phone"
          />
          <input
            type="text"
            placeholder="Property location (optional)"
            value={propertyLocation}
            onChange={(e) => setPropertyLocation(e.target.value)}
            className={inputClass}
            aria-label="Property location"
          />
          <input
            type="text"
            placeholder="Property type (optional)"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={`${inputClass} sm:col-span-2`}
            aria-label="Property type"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className={`w-full sm:w-auto font-dm font-semibold px-8 py-3 rounded-full transition-colors disabled:opacity-60 ${
          onDark ? 'bg-cream text-terracotta hover:bg-sand' : 'bg-forest text-cream hover:bg-forest/90'
        }`}
      >
        {status === 'loading' ? 'Submitting…' : isOwner ? 'Request listing info' : 'Notify me at launch'}
      </button>

      {status === 'error' && (
        <p className={`text-sm font-dm ${onDark ? 'text-cream' : 'text-terracotta'}`}>{error}</p>
      )}
    </form>
  )
}
