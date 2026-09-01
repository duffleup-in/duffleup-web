import * as React from 'react'
import { cn } from '@/lib/cn'

export type PageHeroProps = {
  /** Small uppercase kicker above the title (acid on pitch). */
  eyebrow?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** Optional action cluster (buttons, links) rendered below the copy. */
  children?: React.ReactNode
  className?: string
}

// Standard dark masthead shared by every marketing sub-page. The tall top
// padding (pt-[120px]) is deliberate: it reserves clearance for SiteNav's
// oversized bleed logo, which overflows ~116px below the nav band on desktop.
// Opening every page on this dark band keeps that flourish consistent and
// stops the logo overlapping light page content (SP layout standardization).
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: PageHeroProps) {
  return (
    <section className={cn('bg-pitch pb-20 pt-[120px] text-white', className)}>
      <div className="mx-auto max-w-[1200px] px-6">
        {eyebrow && (
          <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-acid">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-4xl font-display text-[clamp(48px,8vw,80px)] leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-subh leading-relaxed text-white/80">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
