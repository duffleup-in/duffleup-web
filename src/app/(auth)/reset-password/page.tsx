'use client'

import { Suspense, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { ApiError } from '@/lib/api'
import { resetPassword } from '@/lib/api/auth'

function ResetPasswordForm() {
  const router = useRouter()
  const token = useSearchParams().get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await resetPassword(token, password)
      setDone(true)
    } catch (err) {
      const msg =
        err instanceof ApiError && (err.status === 400 || err.status === 404)
          ? 'This reset link is invalid or has expired. Request a new one.'
          : 'Something went wrong. Please try again.'
      setError(msg)
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-5">
        <Alert variant="success" title="Password updated">
          Your password has been reset. You can now sign in.
        </Alert>
        <Button variant="primary" className="w-full" onClick={() => router.push('/login')}>
          Go to sign in
        </Button>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex flex-col gap-5">
        <Alert variant="danger" title="Missing token">
          This reset link is incomplete. Please use the link from your email, or request a new one.
        </Alert>
        <p className="text-center text-[14px] text-pitch-soft">
          <Link href="/forgot-password" className="text-hyperpurple no-underline hover:underline">
            Request a new link
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-utility text-subh uppercase tracking-[0.1em] text-pitch">
        Choose a new password
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          type="password"
          name="password"
          label="New password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          helperText="At least 8 characters."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />
        <Input
          type="password"
          name="confirm"
          label="Confirm password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full"
        />
        <Button type="submit" variant="primary" disabled={loading} className="w-full">
          {loading ? 'Updating…' : 'Reset password'}
        </Button>
      </form>
      {error && (
        <Alert variant="danger" title="Couldn't reset">
          {error}
        </Alert>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
