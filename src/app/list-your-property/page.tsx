import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import EarlyAccessForm from '@/components/ui/EarlyAccessForm'

export const metadata: Metadata = {
  title: 'List Your Property',
  description:
    'Own a property in India? Duffleup lists verified stays for 7% commission. No monthly fees. Currently focused on Maharashtra, expanding across India.',
}

const benefits = [
  {
    title: "7% commission, that's it",
    desc: '7% commission only when guests actually book. No monthly fees. No setup costs.',
  },
  {
    title: 'Verified stays only',
    desc: 'Every property is visited before it goes live. Verified stays only. Tiers earned, not sold — Raw, Real, Rare.',
  },
  {
    title: 'Small, on purpose',
    desc: 'A small, verified marketplace. Not a directory.',
  },
  {
    title: "Built from the owner's side",
    desc: 'Built by someone who took a small property from concept to multi-crore revenue in under 4 years. Real operational knowledge. Real marketing playbooks. Real tech systems. Not generic tips from a tech team.',
  },
]

const steps = [
  {
    num: '01',
    label: 'Tell us about your place',
    desc: 'Fill out the form. Tell us about yourself, where the property is, and how to reach you. Property name, capacity, and other details we cover on the call.',
  },
  {
    num: '02',
    label: 'We visit in person',
    desc: 'Site visits happen before anything goes live. No forms replace this step.',
  },
  {
    num: '03',
    label: 'No filters. No marketing. Just honest.',
    desc: "We take property photos with phones, no filters. You can add your own too — ours will be tagged as Duffleup shots. We write the property description honestly, no compelling marketing. Nothing goes live until we say it's ready.",
  },
  {
    num: '04',
    label: 'You handle guests. We handle bookings.',
    desc: 'Guests book. You handle them like guests. We handle everything about the booking — payments, booking questions, cancellations. Property-specific questions (menu, local guides, amenities) come to you. Payout hits your account within 24-48 hours of checkout.',
  },
]

export default function ListYourPropertyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-pitch pb-20 pt-[120px] text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-acid">
            For owners
          </p>
          <h1 className="max-w-3xl font-display text-[clamp(48px,8vw,80px)] leading-none">
            Got a place?
          </h1>
          <p className="mt-6 max-w-2xl text-subh leading-relaxed text-white/80">
            We visit every property before it goes live. Simple economics: 7%
            commission, no monthly fees, no lock-in. Currently focused on
            Maharashtra, expanding across India.
          </p>
          <div className="mt-8">
            <Button asChild variant="primary" size="lg">
              <Link href="#apply">Tell us about your place</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-line bg-sterling-warm py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-hyperpurple">
            Why Duffleup
          </p>
          <h2 className="mb-10 max-w-2xl font-display text-[clamp(40px,6vw,64px)] leading-none">
            Built for property owners.
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-lg border border-line bg-white p-8"
              >
                <h3 className="font-utility text-h6 uppercase tracking-[0.05em]">
                  {b.title}
                </h3>
                <p className="mt-3 text-subh leading-relaxed text-pitch-soft">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Card 5 — sticker treatment (StickerMoodCard idiom: bold surface,
              thick pitch border, slight rest tilt, container-query title). */}
          <div className="mt-6 [container-type:inline-size] relative rotate-[-1deg] rounded-lg border-[4px] border-pitch bg-solar p-8 text-white shadow-pop sm:p-12">
            <span className="absolute -top-3 right-6 rotate-[5deg] rounded-xsm bg-pitch px-2.5 py-1 font-utility text-[11px] uppercase tracking-[0.15em] text-acid">
              The real deal
            </span>
            <h3 className="font-display text-[clamp(28px,5cqi,48px)] uppercase leading-[0.95]">
              Not a marketing agency in disguise
            </h3>
            <p className="mt-4 max-w-2xl font-body text-subh leading-relaxed">
              Some platforms take 20%+ to give you marketing and an SOP. You
              still hire the staff. You still handle the guests. You still fix
              the plumbing. We&apos;re 7%. Marketing and honesty. That&apos;s
              the deal.
            </p>
          </div>
        </div>
      </section>

      {/* Commission Model */}
      <section
        id="commission"
        className="border-b border-white/10 bg-pitch py-16 text-white"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-acid">
                Pricing Model
              </p>
              <h2 className="mb-6 font-display text-[clamp(40px,6vw,64px)] leading-none">
                7% and nothing else
              </h2>
              <p className="mb-6 text-subh leading-relaxed text-white/70">
                We charge a 7% commission on each successful booking. That&apos;s
                it. No monthly subscription. No setup fees.
              </p>
              <ul className="space-y-4">
                {[
                  'No booking = No fee',
                  'Payout within 24-48 hours of guest checkout',
                  'You keep 93% of every booking',
                  'No lock-in contracts',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle
                      size={16}
                      className="flex-shrink-0 text-acid"
                      aria-hidden="true"
                    />
                    <span className="text-subh text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/5 p-8">
              <p className="mb-4 font-utility text-subtitle uppercase tracking-[0.1em] text-acid">
                Example Calculation
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-subh text-white/70">Booking value</span>
                  <span className="font-display text-h6">₹8,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-subh text-white/70">
                    Duffleup commission (7%)
                  </span>
                  <span className="text-white/60">₹560</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/20 pt-4">
                  <span className="font-utility uppercase tracking-[0.05em] text-acid">
                    You receive
                  </span>
                  <span className="font-display text-h4 text-acid">
                    ₹7,440<sup className="text-caption">*</sup>
                  </span>
                </div>
              </div>
              <p className="mt-6 text-center text-caption text-white/40">
                *Less PG fees and applicable taxes as per government norms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-hyperpurple">
            The process
          </p>
          <h2 className="mb-10 max-w-2xl font-display text-[clamp(40px,6vw,64px)] leading-none">
            How this works
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.num}
                className="rounded-lg border border-line p-8"
              >
                <span className="font-display text-h3 text-hyperpurple">
                  {s.num}
                </span>
                <h3 className="mt-4 font-utility text-h6 uppercase tracking-[0.05em]">
                  {s.label}
                </h3>
                <p className="mt-3 text-subh leading-relaxed text-pitch-soft">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="bg-sterling-warm py-16">
        <div className="mx-auto max-w-[640px] px-6">
          <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-hyperpurple">
            Get in touch
          </p>
          <h2 className="font-display text-[clamp(40px,6vw,64px)] leading-none">
            Tell us about your property
          </h2>
          <p className="mt-4 text-subh leading-relaxed text-pitch-soft">
            We&apos;ll get back to you within 48 hours to schedule a site visit.
          </p>

          <div className="mt-8 rounded-lg border border-line bg-white p-8">
            <EarlyAccessForm intent="OWNER" source="landing-list-property" />
            <p className="mt-4 text-center text-caption text-pitch-soft">
              By sharing your details, you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-2">
                terms of service
              </Link>
              . We&apos;ll be in touch as we approach launch.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
