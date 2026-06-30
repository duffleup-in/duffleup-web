import { SocialCard } from '@/components/marketing/SocialCard'

// Pre-launch: these are brand statements, not fabricated customer reviews
// (truth-first). Attribution defaults to the duffleup wordmark.
const cards = [
  { variant: 'acid' as const, quote: "Don't book a room. Book a weekend." },
  { variant: 'pink' as const, quote: 'Filter by mood, not stars.' },
  { variant: 'purple' as const, quote: "Verified. Or it's not here." },
]

export function SocialProof() {
  return (
    <section className="border-b border-line bg-sterling-warm py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-hyperpurple">
          The gist
        </p>
        <h2 className="mb-10 max-w-2xl font-display text-[clamp(40px,6vw,64px)] leading-none">
          What we actually stand for.
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {cards.map((c) => (
            <SocialCard key={c.quote} variant={c.variant} quote={c.quote} />
          ))}
        </div>
      </div>
    </section>
  )
}
