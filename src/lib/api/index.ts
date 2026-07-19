// Public surface of the API client. Import from '@/lib/api'.

export { apiFetch, apiMutate, ApiError } from './client'
export type { ApiRequestOptions } from './client'
export * from './types'

import { apiFetch } from './client'
import type { MoodConfigResponse } from './types'

// Demonstration of the Server Component fetch pattern (SP-F0.B step 6).
//
// This is a ready-to-use, typed fetch — NOT wired into any page yet. The
// existing home page renders hardcoded mood data (MoodDiscovery.tsx), and per
// the F0.B brief we deliberately do NOT convert it to a live fetch, which would
// make SSR depend on a running backend and break local dev for anyone without
// one. SP-F1 will call this from a Server Component when live mood data is
// wanted:
//
//   import { getMoodConfig } from '@/lib/api'
//   const config = await getMoodConfig()          // MoodConfigResponse
//   // config.moodProfiles / config.moodContexts
//
// The endpoint is live and returns 200 at /api/v1/mood-config.
export function getMoodConfig(
  options?: Parameters<typeof apiFetch>[1]
): Promise<MoodConfigResponse> {
  return apiFetch<MoodConfigResponse>('/mood-config', options)
}
