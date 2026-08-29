'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useAuth } from '@/lib/auth/AuthProvider'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      })
      router.push('/')
    } catch {
      setError('Registration failed. That email or phone may already be in use.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-utility text-subh uppercase tracking-[0.1em] text-pitch">Create account</h1>

      <GoogleAuthButton onSuccess={() => router.push('/')} onError={setError} />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-line-strong" />
        <span className="font-utility text-[12px] uppercase tracking-[0.1em] text-pitch-soft">
          or with email
        </span>
        <div className="h-px flex-1 bg-line-strong" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="text"
            name="firstName"
            label="First name"
            required
            placeholder="Jane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full"
          />
          <Input
            type="text"
            name="lastName"
            label="Last name"
            required
            placeholder="Smith"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full"
          />
        </div>
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
        <Input
          type="tel"
          name="phone"
          label="Phone (optional)"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full"
        />
        <Input
          type="password"
          name="password"
          label="Password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          helperText="At least 8 characters."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />
        <Button type="submit" variant="primary" disabled={loading} className="w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      {error && (
        <Alert variant="danger" title="Couldn't sign up">
          {error}
        </Alert>
      )}

      <p className="text-center text-[14px] text-pitch-soft">
        Already have an account?{' '}
        <Link href="/login" className="text-hyperpurple no-underline hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
