// Client-side auth token + user persistence (localStorage).
//
// The backend issues SimpleJWT access + rotating refresh tokens in the JSON body
// (it also sets an HttpOnly refresh cookie for same-origin web clients, but the
// SPA lives on a different origin, so we persist the refresh token here and send
// it in the request body). All helpers are SSR-safe: they no-op / return null
// when `window` is undefined.

import type { AuthUser } from '@/lib/api/auth'

const ACCESS_KEY = 'du_access_token'
const REFRESH_KEY = 'du_refresh_token'
const USER_KEY = 'du_user'

const hasWindow = () => typeof window !== 'undefined'

export function getAccessToken(): string | null {
  return hasWindow() ? window.localStorage.getItem(ACCESS_KEY) : null
}

export function getRefreshToken(): string | null {
  return hasWindow() ? window.localStorage.getItem(REFRESH_KEY) : null
}

export function getStoredUser(): AuthUser | null {
  if (!hasWindow()) return null
  const raw = window.localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function setSession(accessToken: string, refreshToken: string, user: AuthUser): void {
  if (!hasWindow()) return
  window.localStorage.setItem(ACCESS_KEY, accessToken)
  window.localStorage.setItem(REFRESH_KEY, refreshToken)
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (!hasWindow()) return
  window.localStorage.setItem(ACCESS_KEY, accessToken)
  window.localStorage.setItem(REFRESH_KEY, refreshToken)
}

export function setStoredUser(user: AuthUser): void {
  if (!hasWindow()) return
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession(): void {
  if (!hasWindow()) return
  window.localStorage.removeItem(ACCESS_KEY)
  window.localStorage.removeItem(REFRESH_KEY)
  window.localStorage.removeItem(USER_KEY)
}
