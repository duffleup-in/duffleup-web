'use client'

import { useState } from 'react'
import { StickerMoodCard } from '@/components/marketing/StickerMoodCard'
import { IntentCollectorModal } from '@/components/booking/IntentCollectorModal'
import type { Mood } from '@/components/ui/Chip'
import type { MoodKey, MoodProfileConfig } from '@/lib/api/types/mood-config'
import { moodKeyToLower } from '@/lib/moods/normalize'

export function MoodDiscovery({ moodProfiles }: { moodProfiles: MoodProfileConfig[] }) {
  const [openMood, setOpenMood] = useState<MoodKey | null>(null)
  const ordered = [...moodProfiles].sort((a, b) => a.tileOrder - b.tileOrder)

  return (
    <section id="moods" className="border-b border-line bg-sterling-warm py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-hyperpurple">
          Pick your mood
        </p>
        <h2 className="mb-10 max-w-2xl font-display text-[clamp(40px,6vw,64px)] leading-none">
          Not by stars. By how you want to feel.
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((p) => (
            <StickerMoodCard
              key={p.mood}
              mood={moodKeyToLower(p.mood) as Mood}
              name={p.displayName}
              description={p.calloutText}
              imageUrl={p.heroImageUrl}
              onClick={() => setOpenMood(p.mood)}
            />
          ))}
        </div>
      </div>

      <IntentCollectorModal
        open={openMood !== null}
        onOpenChange={(next) => {
          if (!next) setOpenMood(null)
        }}
        preselectedMood={openMood ?? undefined}
      />
    </section>
  )
}
