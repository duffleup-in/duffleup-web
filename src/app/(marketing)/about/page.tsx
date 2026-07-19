import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Built by an operator, not a tech company. Verified stays. Honest economics. Mood-first.',
}

const values = [
  {
    title: 'Honesty over hype',
    desc: "What's in the photos is what's on the ground. No touch-ups. No stretched descriptions.",
  },
  {
    title: 'Owners first',
    desc: 'We think like owners, not investors. Every feature gets built around the people who actually run the place.',
  },
  {
    title: 'Maharashtra at heart',
    desc: "We start here because we know this land. The Sahyadris, the plateaus, the coast — we know its corners.",
  },
  {
    title: 'Long-term relationships',
    desc: 'We want owners who stay for years, not list-and-leave. A community, not a directory.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-pitch pb-20 pt-[120px] text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-acid">
            Our story
          </p>
          <h1 className="max-w-3xl font-display text-[clamp(48px,8vw,80px)] leading-none">
            Built by an operator,
            <br />
            <span className="text-acid">not a tech company</span>
          </h1>
          <p className="mt-6 max-w-xl text-subh leading-relaxed text-white/80">
            Duffleup exists because someone has been on both ends of the same
            WhatsApp thread. The one asking if the place is really like the
            photos. And the one answering.
          </p>
        </div>
      </section>

      {/* Founder narrative */}
      <section className="border-b border-line bg-sterling-warm py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-3xl">
            <Quote size={36} className="mb-6 text-hyperpurple" aria-hidden="true" />
            <h2 className="mb-8 font-display text-[clamp(40px,6vw,64px)] leading-none">
              Both sides of the WhatsApp thread.
            </h2>

            <div className="space-y-5 text-subh leading-relaxed text-pitch-soft">
              <p>
                I have been on both ends of the same thread. The one asking
                whether the photos are real. And the one typing back — yes,
                promise, it&apos;s exactly like that.
              </p>
              <p>
                The platforms didn&apos;t help either side. They showed average
                ratings, not real pictures. They rewarded properties that gamed
                reviews over properties that actually cared. Owners became
                inventory. Guests became transactions.
              </p>
              <p>
                So Duffleup got built the other way round. Verified stays.
                Honest economics. Mood-first.
              </p>
              <p>
                Every property is visited before it goes live. Every owner gets
                talked to properly. Every tier — Raw, Real, Rare — means
                something.
              </p>
            </div>

            <p className="mt-8 border-t border-line pt-8 font-utility text-h6 uppercase tracking-[0.05em]">
              Founder, Duffleup
            </p>
          </div>
        </div>
      </section>

      {/* Both sides */}
      <section className="border-b border-white/10 bg-pitch py-16 text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-acid">
                For guests
              </p>
              <h2 className="mb-6 font-display text-[clamp(32px,4vw,48px)] leading-none">
                Know what you&apos;re walking into.
              </h2>
              <p className="text-subh leading-relaxed text-white/70">
                Verified stays only. When you pack, you know exactly what
                you&apos;re getting. No catfishing. No surprises at the gate.
              </p>
            </div>
            <div>
              <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-acid">
                For owners
              </p>
              <h2 className="mb-6 font-display text-[clamp(32px,4vw,48px)] leading-none">
                Built by someone who&apos;s run the place.
              </h2>
              <p className="text-subh leading-relaxed text-white/70">
                The seasons. The 2am generator failure. The guests who get it
                and the ones who don&apos;t. Verified properties only. Honest
                commissions. You set the rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-hyperpurple">
            What we stand for
          </p>
          <h2 className="mb-10 max-w-2xl font-display text-[clamp(40px,6vw,64px)] leading-none">
            Four things we don&apos;t bend on.
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-md border border-line p-8 transition-colors hover:border-hyperpurple"
              >
                <h3 className="font-utility text-h6 uppercase tracking-[0.05em]">
                  {v.title}
                </h3>
                <p className="mt-3 text-subh leading-relaxed text-pitch-soft">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-hyperpurple py-16 text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="max-w-2xl font-display text-[clamp(40px,6vw,64px)] leading-none">
            Not live yet. Get in early.
          </h2>
          <p className="mt-4 max-w-xl text-subh leading-relaxed text-white/80">
            Whether you&apos;re packing a duffle or you&apos;ve got a place
            worth showing — Duffleup is for you.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="primary" size="lg">
              <Link href="/">
                Browse Stays <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/#early-access">Put me on the list</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
