import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'

const stickers = [
  { label: 'OUT THERE', className: 'top-20 right-[8%] rotate-[8deg] bg-acid text-pitch' },
  { label: 'ZERO APOLOGIES', className: 'bottom-32 right-[12%] -rotate-6 bg-solar text-white' },
  { label: '2 NIGHTS · 1 DUFFLE', className: 'top-1/2 right-[35%] -rotate-12 bg-plasma text-pitch text-subtitle' },
]

export function Hero() {
  return (
    <section className="relative min-h-[700px] overflow-hidden bg-hero-radial pb-16 pt-24 text-white">
      {stickers.map((s) => (
        <span
          key={s.label}
          className={`absolute hidden whitespace-nowrap rounded-xsm px-[18px] py-2.5 font-utility text-subh uppercase tracking-[0.05em] shadow-pop md:inline-block ${s.className}`}
        >
          {s.label}
        </span>
      ))}

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div className="mb-12 block">
          <Logo size="md" priority />
        </div>

        <h1 className="mb-6 max-w-4xl font-display text-[clamp(64px,11vw,96px)] leading-none text-acid [text-shadow:10px_10px_0_#0A0A0A,5px_5px_0_#FF1B8D]">
          Don&apos;t book<br />a room.<br />Book a<br />weekend.
        </h1>

        <p className="mb-12 max-w-xl font-utility text-[clamp(18px,2vw,22px)] uppercase tracking-[0.1em] text-white">
          Verified offbeat stays. Honest economics. Maharashtra-first.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button asChild variant="primary" size="lg">
            <Link href="/properties">Pack my duffle</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/list-your-property">Got a place?</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
