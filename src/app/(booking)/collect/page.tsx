import { getMoodConfig } from '@/lib/api'
import { CollectLauncher } from './CollectLauncher'

// Intent Collector funnel (SP-F1 Phase A). Server Component fetches live mood
// config and hands both moodProfiles[] and moodContexts[] to the client modal.
// A.2 ships the mood grid and sub-context grid; dates and guests land in A.3.
export default async function CollectPage() {
  try {
    const moodConfig = await getMoodConfig()
    return <CollectLauncher config={moodConfig} />
  } catch {
    // Backend unavailable (e.g. at build time). Do NOT fabricate mood data —
    // render an inert error state so the route still builds.
    return (
      <main className="flex min-h-screen items-center justify-center p-8 text-center">
        <p className="text-body text-white/70">
          Mood configuration is unavailable right now. Please try again shortly.
        </p>
      </main>
    )
  }
}
