'use client'

import * as React from 'react'
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/cn'

type AlertVariant = 'success' | 'info' | 'warning' | 'danger'

export type AlertProps = {
  variant?: AlertVariant
  title: string
  children?: React.ReactNode
  /** Show a close button. Calls onDismiss (if given) then hides the alert. */
  dismissable?: boolean
  onDismiss?: () => void
  className?: string
}

const variants: Record<AlertVariant, string> = {
  success: 'bg-success-bg border-success text-success',
  info: 'bg-info-bg border-info text-info',
  warning: 'bg-warning-bg border-warning text-[#B07A1A]',
  danger: 'bg-danger-bg border-danger text-danger',
}

const icons: Record<AlertVariant, React.ElementType> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  danger: XCircle,
}

export function Alert({
  variant = 'info',
  title,
  children,
  dismissable = false,
  onDismiss,
  className,
}: AlertProps) {
  const [visible, setVisible] = React.useState(true)
  if (!visible) return null

  const Icon = icons[variant]

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start justify-between gap-3 rounded-sm border p-4 px-5',
        variants[variant],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="font-utility text-subh uppercase leading-tight tracking-[0.05em]">
            {title}
          </p>
          {children && <p className="mt-0.5 text-[14px] leading-snug">{children}</p>}
        </div>
      </div>
      {dismissable && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            onDismiss?.()
            setVisible(false)
          }}
          className="flex-shrink-0 opacity-60 transition-opacity hover:opacity-100"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
