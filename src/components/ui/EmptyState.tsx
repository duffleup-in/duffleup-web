import * as React from 'react'
import { cn } from '@/lib/cn'

export type EmptyStateProps = {
  /** Sticker-style icon — a lucide icon node or a short glyph/letter. */
  icon?: React.ReactNode
  title: string
  body?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, body, action, className }: EmptyStateProps) {
  return (
    <div className={cn('mx-auto max-w-[480px] px-6 py-16 text-center', className)}>
      {icon != null && (
        <div className="mx-auto mb-6 flex h-20 w-20 -rotate-[5deg] items-center justify-center rounded-full border-[3px] border-pitch bg-acid font-display text-[40px] text-pitch shadow-[4px_4px_0_#0A0A0A]">
          {icon}
        </div>
      )}
      <h3 className="mb-2 font-utility text-h6 uppercase tracking-[0.05em]">{title}</h3>
      {body && <p className="mb-6 text-[15px] text-pitch-soft">{body}</p>}
      {action}
    </div>
  )
}
