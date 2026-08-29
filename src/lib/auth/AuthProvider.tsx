'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchMe,
  googleLogin as googleLoginApi,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from '@/lib/api/auth'
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setSession,
  setStoredUser,
} from './storage'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<AuthUser>
  register: (payload: RegisterPayload) => Promise<AuthUser>
  loginWithGoogle: (idToken: string) => Promise<{ user: AuthUser; isNewUser: boolean }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  // Hydrate from localStorage on mount, then validate the session against
  // /auth/me in the background (which refreshes the access token on 401).
  useEffect(() => {
    const stored = getStoredUser()
    const token = getAccessToken()
    if (!stored || !token) {
      setStatus('unauthenticated')
      return
    }
    setUser(stored)
    setStatus('authenticated')

    let active = true
    fetchMe(token)
      .then((fresh) => {
        if (!active) return
        setUser(fresh)
        setStoredUser(fresh)
      })
      .catch(() => {
        // 401 with no valid refresh, or network error — treat as signed out.
        if (!active) return
        clearSession()
        setUser(null)
        setStatus('unauthenticated')
      })
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await loginApi(payload)
    setSession(res.accessToken, res.refreshToken, res.user)
    setUser(res.user)
    setStatus('authenticated')
    return res.user
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await registerApi(payload)
    setSession(res.accessToken, res.refreshToken, res.user)
    setUser(res.user)
    setStatus('authenticated')
    return res.user
  }, [])

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const res = await googleLoginApi(idToken)
    setSession(res.accessToken, res.refreshToken, res.user)
    setUser(res.user)
    setStatus('authenticated')
    return { user: res.user, isNewUser: res.isNewUser }
  }, [])

  const logout = useCallback(async () => {
    const rt = getRefreshToken()
    if (rt) {
      // Best-effort server-side revocation.
      await logoutApi(rt).catch(() => {})
    }
    clearSession()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const refreshUser = useCallback(async () => {
    const token = getAccessToken()
    if (!token) return
    const fresh = await fetchMe(token)
    setUser(fresh)
    setStoredUser(fresh)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      login,
      register,
      loginWithGoogle,
      logout,
      refreshUser,
    }),
    [user, status, login, register, loginWithGoogle, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
