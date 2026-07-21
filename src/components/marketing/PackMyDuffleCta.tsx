'use client'

import { useState } from 'react'
import { Button, type ButtonProps } from '@/components/ui/Button'
import { IntentCollectorModal } from '@/components/booking/IntentCollectorModal'

export type PackMyDuffleCtaProps = {
  /** Hero uses `lg`; the nav bar uses `sm`. */
  size?: ButtonProps['size']
  className?: string
}

/**
 * The "Pack my duffle" CTA wherever it appears. Owns the collector's open state
 * so its host stays presentational — and, for Hero, so that host can stay a
 * Server Component.
 */
export function PackMyDuffleCta({ size = 'lg', className }: PackMyDuffleCtaProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="primary"
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        Pack my duffle
      </Button>
      <IntentCollectorModal open={open} onOpenChange={setOpen} />
    </>
  )
}
