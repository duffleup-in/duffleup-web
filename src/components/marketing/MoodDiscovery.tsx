'use client'

import { useState } from 'react'
import { StickerMoodCard } from '@/components/marketing/StickerMoodCard'
import { IntentCollectorModal } from '@/components/booking/IntentCollectorModal'
import type { Mood } from '@/components/ui/Chip'
import type { MoodKey } from '@/lib/api/types/mood-config'
import { lowerToMoodKey } from '@/lib/moods/normalize'

const moods: { mood: Mood; name: string; description: string; tag?: string }[] = [
  { mood: 'chill', name: 'Chill', description: 'Slow mornings. Quiet evenings. The kind of quiet you forgot existed.' },
  { mood: 'romance', name: 'Romance', description: 'For two. For nothing else. Bring the right person.', tag: 'For two' },
  { mood: 'adventure', name: 'Adventure', description: 'Wake up where the trail starts. Sleep where the campfire ends.' },
  { mood: 'reset', name: 'Reset', description: 'Disappear without explaining. Come back as someone slightly better.', tag: 'Solo OK' },
  { mood: 'bash', name: 'Bash', description: 'Bring everyone. Plan nothing. The place can handle it.' },
  { mood: 'pets', name: 'Pets', description: 'Bring the whole family. Even the loud ones with four legs.', tag: 'Pets welcome' },
]

export function MoodDiscovery() {
  // A tile click opens the collector at Step 2 with that mood chosen, rather
  // than navigating to /properties (SP-F1 A.2 decision 1).
  const [openMood, setOpenMood] = useState<MoodKey | null>(null)

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
          {moods.map((m) => (
            <StickerMoodCard
              key={m.mood}
              {...m}
              onClick={() => setOpenMood(lowerToMoodKey(m.mood))}
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
