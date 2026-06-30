import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/cn'

type AvatarSize = 96 | 72 | 56 | 48 | 32 | 24
type AvatarStatus = 'active' | 'inactive'

export type AvatarProps = {
  size?: AvatarSize
  src?: string
  alt?: string
  /** Initials shown when no src is provided (empty state when omitted). */
  initials?: string
  status?: AvatarStatus
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  96: 'w-24 h-24 text-[32px]',
  72: 'w-[72px] h-[72px] text-[24px]',
  56: 'w-14 h-14 text-[20px]',
  48: 'w-12 h-12 text-[18px]',
  32: 'w-8 h-8 text-[14px]',
  24: 'w-6 h-6 text-[11px]',
}

export function Avatar({ size = 48, src, alt = '', initials, status, className }: AvatarProps) {
  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-pill bg-hyperpurple-25 font-utility font-normal tracking-[0.05em] text-hyperpurple',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        initials?.toUpperCase()
      )}
      {status && (
        <span
          className={cn(
            'absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white',
            status === 'active' ? 'bg-success' : 'bg-pitch-soft'
          )}
          aria-label={status === 'active' ? 'Active' : 'Inactive'}
        />
      )}
    </span>
  )
}

export type AvatarStackProps = {
  children: React.ReactNode
  /** Optional "+N" count pill rendered at the end of the stack. */
  count?: number
  className?: string
}

export function AvatarStack({ children, count, className }: AvatarStackProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center [&>*]:border-2 [&>*]:border-white [&>*:not(:first-child)]:-ml-3',
        className
      )}
    >
      {children}
      {count != null && count > 0 && (
        <span className="-ml-3 inline-flex h-12 items-center rounded-pill border-2 border-white bg-sterling px-3 font-utility text-subtitle tracking-[0.05em] text-pitch">
          +{count}
        </span>
      )}
    </div>
  )
}
