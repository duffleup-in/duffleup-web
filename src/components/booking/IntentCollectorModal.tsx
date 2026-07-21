'use client'

import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { getMoodConfig } from '@/lib/api'
import type { MoodConfigResponse, MoodKey } from '@/lib/api/types/mood-config'
import { IntentCollector } from '@/app/(booking)/collect/IntentCollector'

/**
 * Module-level cache (A.2 R3). The home page stays a static Server Component,
 * so the collector fetches its own config the first time it opens; every later
 * open in the same session reuses this.
 */
let cachedConfig: MoodConfigResponse | null = null

async function loadConfig(): Promise<MoodConfigResponse> {
  if (cachedConfig) return cachedConfig
  const config = await getMoodConfig()
  cachedConfig = config
  return config
}

export type IntentCollectorModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Opens at Step 2 with this mood already chosen (home-page mood tiles). */
  preselectedMood?: MoodKey
  /** Server-fetched config, when the host route already has it (/collect). */
  initialConfig?: MoodConfigResponse
}

export function IntentCollectorModal({
  open,
  onOpenChange,
  preselectedMood,
  initialConfig,
}: IntentCollectorModalProps) {
  const [config, setConfig] = useState<MoodConfigResponse | null>(
    initialConfig ?? cachedConfig
  )
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (initialConfig) {
      cachedConfig ??= initialConfig
      return
    }
    if (!open || config) return

    let active = true
    loadConfig()
      .then((loaded) => active && setConfig(loaded))
      .catch(() => active && setFailed(true))
    return () => {
      active = false
    }
  }, [open, config, initialConfig])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 data-[state=open]:animate-fade-in" />

        {/* Mobile: full-screen sheet sliding up. Desktop (sm+): centered dialog,
            ~640px wide — the mood grid is unusable at A.1's max-w-md. */}
        <Dialog.Content
          className="
            fixed inset-0 z-50 h-screen w-screen max-w-none overflow-y-auto bg-pitch p-5 text-white
            data-[state=open]:animate-sheet-up
            sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[85vh] sm:w-[90vw]
            sm:max-w-[640px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg
            sm:border sm:border-white/15 sm:p-6 sm:data-[state=open]:animate-none
          "
        >
          {config ? (
            <IntentCollector
              moods={config.moodProfiles}
              contexts={config.moodContexts}
              preselectedMood={preselectedMood}
              onClose={() => onOpenChange(false)}
            />
          ) : (
            <>
              <Dialog.Title className="font-display text-h6">
                {failed ? 'Something went sideways' : 'Getting your moods…'}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-subtitle text-white/60">
                {failed
                  ? 'We could not load moods right now. Close this and try again.'
                  : 'One moment.'}
              </Dialog.Description>
              {!failed && (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/5] animate-pulse rounded-lg bg-white/10"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
