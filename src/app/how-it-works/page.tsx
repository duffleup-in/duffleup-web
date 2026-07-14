import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Mood-first stays across India, verified before they go live. See how Duffleup works.',
}

const tiers = [
  {
    tier: 'raw' as const,
    desc: "We've walked the property. Photos match. Owner is real. Everything advertised exists.",
  },
  {
    tier: 'real' as const,
    desc: 'Guests kept coming back happy. Complaints stayed rare. Real is what a stay earns, not what an owner buys.',
  },
  {
    tier: 'rare' as const,
    desc: 'Reserved for the top 5% of properties on Duffleup. Not for sale. Not for influence. Earned, or not at all.',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-pitch pb-20 pt-[120px] text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-acid">
            How it works
          </p>
          <h1 className="max-w-4xl font-display text-[clamp(48px,8vw,80px)] leading-none">
            We find stays before they find you.
          </h1>
        </div>
      </section>

      {/* Universal promise */}
      <section className="border-b border-line bg-acid py-16 text-pitch">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="max-w-3xl font-display text-[clamp(32px,5vw,56px)] leading-none">
            Every property is visited before it goes live.
          </h2>
        </div>
      </section>

      {/* Tiers */}
      <section className="border-b border-line bg-sterling-warm py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-10 font-utility text-subh uppercase tracking-[0.1em] text-hyperpurple">
            The tiers
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.tier}
                className="flex flex-col rounded-md border border-line bg-white p-8"
              >
                <Badge tier={t.tier} className="self-start" />
                <p className="mt-5 text-subh leading-relaxed text-pitch-soft">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-3xl text-subh leading-relaxed text-pitch-soft">
            Not paid. Not promoted. Not gamed. Every property starts at Raw.
            Real is what enough happy stays earn. Rare stays rare — the top 5%,
            never for sale.
          </p>
        </div>
      </section>

      {/* What you pay */}
      <section className="border-b border-white/10 bg-pitch py-16 text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="max-w-3xl font-display text-[clamp(32px,5vw,56px)] leading-none">
            You pay at booking. You pay the price you see. No surprises.
          </h2>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-hyperpurple py-16 text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="max-w-3xl font-display text-[clamp(40px,6vw,64px)] leading-none">
            We&apos;re still picking our first stays. Want to know when they
            open?
          </h2>

          <div className="mt-8">
            <Button asChild variant="primary" size="lg">
              <Link href="/#early-access">Put me on the list</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
