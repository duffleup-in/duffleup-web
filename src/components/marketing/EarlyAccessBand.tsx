import * as React from 'react'
import EarlyAccessForm from '@/components/ui/EarlyAccessForm'
import { cn } from '@/lib/cn'

export type EarlyAccessBandProps = {
  eyebrow?: string
  heading?: string
  subcopy?: string
  intent?: 'GUEST' | 'OWNER'
  source?: string
  className?: string
}

export function EarlyAccessBand({
  eyebrow = "Not live yet",
  heading = "We're not live yet.",
  subcopy = "Drop your email. We'll tell you the moment verified stays open up in your area.",
  intent = 'GUEST',
  source = 'landing-home',
  className,
}: EarlyAccessBandProps) {
  return (
    <section className={cn('bg-hyperpurple py-16 text-white', className)}>
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 md:grid-cols-2">
        <div>
          <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-acid">
            {eyebrow}
          </p>
          <h2 className="font-display text-[clamp(40px,6vw,64px)] leading-none">{heading}</h2>
          <p className="mt-4 max-w-md text-subh leading-relaxed text-white/80">{subcopy}</p>
        </div>

        <div className="w-full justify-self-end rounded-lg border-[3px] border-pitch bg-white p-8 text-pitch shadow-pop md:max-w-[480px]">
          <EarlyAccessForm intent={intent} source={source} />
        </div>
      </div>
    </section>
  )
}
