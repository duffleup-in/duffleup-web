'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { IntentCollectorModal } from '@/components/booking/IntentCollectorModal'
import type { MoodConfigResponse } from '@/lib/api/types/mood-config'

/**
 * Standalone harness for the /collect route. The real entry points are the home
 * page hero CTA and mood tiles; this route exists to exercise the collector in
 * isolation, so it hands the modal its server-fetched config directly.
 */
export function CollectLauncher({ config }: { config: MoodConfigResponse }) {
  const [open, setOpen] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Button variant="primary" size="lg" onClick={() => setOpen(true)}>
        Open collector
      </Button>
      <IntentCollectorModal
        open={open}
        onOpenChange={setOpen}
        initialConfig={config}
      />
    </main>
  )
}
