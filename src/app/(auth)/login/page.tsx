'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useAuth } from '@/lib/auth/AuthProvider'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email: email.trim(), password })
      router.push('/')
    } catch {
      setError('Invalid email or password.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-utility text-subh uppercase tracking-[0.1em] text-pitch">Sign in</h1>

      <GoogleAuthButton onSuccess={() => router.push('/')} onError={setError} />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-line-strong" />
        <span className="font-utility text-[12px] uppercase tracking-[0.1em] text-pitch-soft">
          or with email
        </span>
        <div className="h-px flex-1 bg-line-strong" />
      </div>

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
        <Input
          type="password"
          name="password"
          label="Password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />
        <div className="text-right">
          <Link href="/forgot-password" className="text-[13px] text-hyperpurple no-underline hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="primary" disabled={loading} className="w-full">
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      {error && (
        <Alert variant="danger" title="Couldn't sign in">
          {error}
        </Alert>
      )}

      <p className="text-center text-[14px] text-pitch-soft">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-hyperpurple no-underline hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}
