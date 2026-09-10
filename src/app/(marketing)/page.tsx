import type { Metadata } from 'next'
import { getMoodConfig } from '@/lib/api'
import { Hero } from '@/components/marketing/Hero'
import { MoodDiscovery } from '@/components/marketing/MoodDiscovery'
import { PropertyPreview } from '@/components/marketing/PropertyPreview'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { ForOwners } from '@/components/marketing/ForOwners'
import { SocialProof } from '@/components/marketing/SocialProof'
import { EarlyAccessBand } from '@/components/marketing/EarlyAccessBand'

export const metadata: Metadata = {
  title: "Duffleup — Don't book a room. Book a weekend.",
  description:
    'Verified offbeat stays across Maharashtra. Honest economics. Filter by mood, not stars.',
}

export default async function Home() {
  const moodConfig = await getMoodConfig({ cache: 'no-store' }).catch(() => ({ moodProfiles: [], moodContexts: [] }))

  return (
    <>
      <Hero />
      <MoodDiscovery moodProfiles={moodConfig.moodProfiles} />
      <PropertyPreview />
      <HowItWorks />
      <ForOwners />
      <SocialProof />
      <EarlyAccessBand />
    </>
  )
}
