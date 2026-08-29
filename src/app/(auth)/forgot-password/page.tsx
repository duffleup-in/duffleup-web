'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { forgotPassword } from '@/lib/api/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    // The endpoint always returns 200 to avoid leaking whether the email exists,
    // so we show the same confirmation regardless of the outcome.
    await forgotPassword(email.trim()).catch(() => {})
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-5">
        <Alert variant="success" title="Check your inbox">
          If an account exists for that email, we&apos;ve sent a reset link. It expires in 1 hour.
        </Alert>
        <p className="text-center text-[14px] text-pitch-soft">
          <Link href="/login" className="text-hyperpurple no-underline hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-utility text-subh uppercase tracking-[0.1em] text-pitch">Reset password</h1>
      <p className="text-[14px] text-pitch-soft">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          type="email"
          name="email"
          label="Email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        <Button type="submit" variant="primary" disabled={loading} className="w-full">
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
      <p className="text-center text-[14px] text-pitch-soft">
        <Link href="/login" className="text-hyperpurple no-underline hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
