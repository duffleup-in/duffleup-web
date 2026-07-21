'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { IntentCollectorModal } from '@/components/booking/IntentCollectorModal'

/**
 * The hero's primary CTA. Exists so Hero.tsx can stay a Server Component while
 * the button owns the collector's open state.
 */
export function PackMyDuffleCta() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="primary" size="lg" onClick={() => setOpen(true)}>
        Pack my duffle
      </Button>
      <IntentCollectorModal open={open} onOpenChange={setOpen} />
    </>
  )
}
