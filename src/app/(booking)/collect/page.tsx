import { getMoodConfig } from '@/lib/api'
import { IntentCollector } from './IntentCollector'

// Intent Collector funnel (SP-F1 Phase A). Server Component fetches live mood
// config and hands it to the client modal. A.1 renders placeholder steps only;
// A.2/A.3 build the real mood grid, date picker, and guest counter.
export default async function CollectPage() {
  try {
    const moodConfig = await getMoodConfig()
    return <IntentCollector moods={moodConfig.moodProfiles} />
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
