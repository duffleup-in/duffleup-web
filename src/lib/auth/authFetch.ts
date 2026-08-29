// Authenticated request helpers for protected endpoints.
//
// These inject the stored access token and, on a 401, perform a single-flight
// refresh against /auth/refresh, then retry the original request once. If the
// refresh fails, the session is cleared and the user is sent to /login. This is
// the web analogue of the dashboard's axios response interceptor.

import { ApiError, apiFetch, apiMutate, type ApiRequestOptions } from '@/lib/api'
import { refreshTokens } from '@/lib/api/auth'
import { clearSession, getAccessToken, getRefreshToken, setTokens } from './storage'

let refreshPromise: Promise<string | null> | null = null

async function doRefresh(): Promise<string | null> {
  const rt = getRefreshToken()
  if (!rt) return null
  try {
    const tokens = await refreshTokens(rt)
    setTokens(tokens.accessToken, tokens.refreshToken)
    return tokens.accessToken
  } catch {
    return null
  }
}

async function withFreshToken<T>(run: (token: string | undefined) => Promise<T>): Promise<T> {
  const token = getAccessToken() ?? undefined
  try {
    return await run(token)
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      refreshPromise = refreshPromise ?? doRefresh()
      const newToken = await refreshPromise.finally(() => {
        refreshPromise = null
      })
      if (newToken) return run(newToken)
      clearSession()
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    throw err
  }
}

/** GET a protected resource with automatic token refresh. */
export function authedFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  return withFreshToken((authToken) => apiFetch<T>(path, { ...options, authToken }))
}

/** Mutate a protected resource with automatic token refresh. */
export function authedMutate<T>(
  path: string,
  options: {
    method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: unknown
  } & ApiRequestOptions = {}
): Promise<T> {
  return withFreshToken((authToken) => apiMutate<T>(path, { ...options, authToken }))
}
