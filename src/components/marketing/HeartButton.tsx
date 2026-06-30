'use client'

import * as React from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/cn'

export type HeartButtonProps = {
  defaultSaved?: boolean
  onToggle?: (saved: boolean) => void
  className?: string
}

export function HeartButton({ defaultSaved = false, onToggle, className }: HeartButtonProps) {
  const [saved, setSaved] = React.useState(defaultSaved)
  return (
    <button
      type="button"
      aria-label={saved ? 'Remove from saved' : 'Save this place'}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const next = !saved
        setSaved(next)
        onToggle?.(next)
      }}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full border-none bg-white/95 transition-transform hover:scale-110 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hyperpurple',
        className
      )}
    >
      <Heart
        size={18}
        className={saved ? 'fill-slap-pink text-slap-pink' : 'text-pitch'}
        aria-hidden="true"
      />
    </button>
  )
}
