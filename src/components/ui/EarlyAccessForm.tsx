'use client'

import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

type Intent = 'GUEST' | 'OWNER'

interface EarlyAccessFormProps {
  intent: Intent
  source: string
  /** Kept for API compatibility with existing call sites. Inputs render on a
   * white surface regardless, so this no longer drives colour. */
  tone?: 'light' | 'dark'
}

// NEXT_PUBLIC_API_URL already includes the /api/v1 base (see .env.example), so
// the endpoint is `${API_URL}/early-access`. Trailing slash tolerated.
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Landing-page email capture. POSTs to the early-access API with the page's
// intent + source + any UTM params on the URL. Network logic is unchanged from
// SP-23; SP-23b rebuilds the markup on the brand-kit primitives.
export default function EarlyAccessForm({ intent, source }: EarlyAccessFormProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [propertyLocation, setPropertyLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const isOwner = intent === 'OWNER'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!EMAIL_RE.test(email.trim())) {
      setError('That email looks off. Mind checking it?')
      setStatus('error')
      return
    }

    setStatus('loading')

    // Capture UTM params from the URL at submit time (no Suspense needed).
    const params =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams()

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
      setError(
        "Couldn't reach our servers. Email hello@duffleup.in and we'll add you to the list ourselves."
      )
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <Alert variant="success" title="You're on the list">
        We&apos;ll ping you the moment your area goes live.
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        type="email"
        name="email"
        label="Email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        state={status === 'error' && error.startsWith('That email') ? 'error' : 'default'}
        className="w-full"
      />
      <Input
        type="text"
        name="firstName"
        label="First name (optional)"
        placeholder="What do we call you?"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full"
      />

      {isOwner && (
        <>
          <Input
            type="tel"
            name="phone"
            label="Phone (optional)"
            placeholder="So we can reach you"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full"
          />
          <Input
            type="text"
            name="propertyLocation"
            label="Property location (optional)"
            placeholder="Where's the place?"
            value={propertyLocation}
            onChange={(e) => setPropertyLocation(e.target.value)}
            className="w-full"
          />
          <Input
            type="text"
            name="propertyType"
            label="Property type (optional)"
            placeholder="Cottage, villa, farmhouse…"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full"
          />
        </>
      )}

      <Button type="submit" variant="primary" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading'
          ? 'Sending…'
          : isOwner
            ? 'Send me listing info'
            : 'Put me on the list'}
      </Button>

      {status === 'error' && (
        <Alert variant="danger" title="Couldn't go through">
          {error}
        </Alert>
      )}
    </form>
  )
}
