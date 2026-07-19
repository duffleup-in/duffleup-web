// Shared typed API client for talking to duffleup-api.
//
// Two entry points:
//   - apiFetch<T>(path, options?)  — GET, for Server Component data fetching
//   - apiMutate<T>(path, options)  — POST/PUT/PATCH/DELETE, for Client Component
//     mutations
//
// Both throw `ApiError` on any non-2xx response so callers (and Next.js error
// boundaries) can handle failures with native promise semantics.
//
// Base URL note: NEXT_PUBLIC_API_URL ALREADY includes the `/api/v1` base (see
// .env.example and the existing EarlyAccessForm), so paths passed here are
// resource-relative — `/mood-config`, not `/api/v1/mood-config`. The prod
// fallback carries the same `/api/v1` suffix.

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'https://api.duffleup.in/api/v1'
).replace(/\/$/, '')

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export type ApiRequestOptions = {
  /** Bearer token. Unused in F0.B — SP-F1 phase E populates this. */
  authToken?: string
  /** Next.js fetch cache mode (Server Components). */
  cache?: RequestCache
  /** Next.js fetch revalidation config (Server Components). */
  next?: NextFetchRequestConfig
}

async function request<T>(
  path: string,
  init?: RequestInit,
  options?: ApiRequestOptions
): Promise<T> {
  const url = `${BASE_URL}${path}`
  const headers = new Headers(init?.headers)
  headers.set('Accept', 'application/json')
  if (init?.body) headers.set('Content-Type', 'application/json')
  if (options?.authToken) {
    headers.set('Authorization', `Bearer ${options.authToken}`)
  }

  const res = await fetch(url, {
    ...init,
    headers,
    cache: options?.cache,
    next: options?.next,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({} as Record<string, unknown>))
    throw new ApiError(
      (body.message as string) ?? res.statusText,
      res.status,
      body.code as string | undefined,
      body.details
    )
  }

  // 204 No Content (e.g. DELETE) has no body to parse.
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

/** GET a resource. Throws `ApiError` on non-2xx. */
export function apiFetch<T>(path: string, options?: ApiRequestOptions): Promise<T> {
  return request<T>(path, { method: 'GET' }, options)
}

/** Mutate a resource (POST by default). Throws `ApiError` on non-2xx. */
export function apiMutate<T>(
  path: string,
  options: {
    method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: unknown
  } & ApiRequestOptions = {}
): Promise<T> {
  const { method = 'POST', body, ...rest } = options
  return request<T>(
    path,
    { method, body: body !== undefined ? JSON.stringify(body) : undefined },
    rest
  )
}
