import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Shield, Star, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Learn how Duffleup physically verifies every property before listing. Understand our badge tiers — Listed, Verified, Certified, and Select.',
}

const badges = [
  {
    tier: 'Listed',
    color: 'bg-gray-100',
    border: 'border-gray-200',
    textColor: 'text-gray-700',
    dotColor: 'bg-gray-400',
    desc: 'Property has submitted all required details and documentation. Host has agreed to Duffleup standards.',
    includes: [
      'Host identity verified',
      'Property documents checked',
      'Basic amenity checklist submitted',
    ],
  },
  {
    tier: 'Verified',
    color: 'bg-sand/20',
    border: 'border-sand/40',
    textColor: 'text-stone',
    dotColor: 'bg-sand',
    desc: 'Our team has physically visited the property and confirmed it matches the listing. The basics check out.',
    includes: [
      'On-site physical inspection',
      'Photos independently taken by our team',
      'Access & road conditions documented',
      'Host responsiveness tested',
    ],
  },
  {
    tier: 'Certified',
    color: 'bg-forest/5',
    border: 'border-forest/20',
    textColor: 'text-forest',
    dotColor: 'bg-forest',
    desc: 'Exceeds baseline standards. Multi-visit assessment. Consistent guest experience over multiple stays.',
    includes: [
      'Multiple visits across seasons',
      'Guest feedback analysis',
      'Cleanliness & comfort rating ≥ 4.5',
      'Host training completed',
      'Emergency protocols in place',
    ],
  },
  {
    tier: 'Select',
    color: 'bg-terracotta/5',
    border: 'border-terracotta/20',
    textColor: 'text-terracotta',
    dotColor: 'bg-terracotta',
    desc: 'The best of the best. Exceptional stays that consistently deliver extraordinary experiences.',
    includes: [
      'All Certified criteria met',
      'Overall rating ≥ 4.8 across 20+ stays',
      'Unique experience or character',
      'Featured in editorial content',
      'Dedicated host support',
    ],
  },
]

const verificationSteps = [
  {
    num: '01',
    title: 'Application & Documentation',
    desc: 'Owner submits property details, photos, legal documents, and agrees to our hosting standards. We do a preliminary background check.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80',
  },
  {
    num: '02',
    title: 'Physical Site Visit',
    desc: 'A member of our team visits the property in person. We check everything — road access, room quality, hygiene, views, amenities, and whether the host is genuinely welcoming.',
    img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=700&q=80',
  },
  {
    num: '03',
    title: 'Independent Photography',
    desc: 'We either take photos ourselves or supervise a shoot. No editing beyond color correction. What guests see is what the property actually looks like.',
    img: 'https://images.unsplash.com/photo-1471896594686-0abafc855b3b?auto=format&fit=crop&w=700&q=80',
  },
  {
    num: '04',
    title: 'Listing & Ongoing Monitoring',
    desc: "Once listed, we keep watching. Guest reviews are read carefully, not just aggregated. Issues are investigated, not ignored. Badges can go up — or come down.",
    img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=700&q=80',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-forest">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sand/70 text-sm font-dm tracking-widest uppercase mb-4">
            Transparent by Design
          </p>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-cream leading-tight mb-6">
            How Duffleup verifies every stay
          </h1>
          <p className="text-cream/70 text-lg font-dm max-w-2xl mx-auto">
            We don't rely on guest reviews alone. Before any property goes
            live, someone from our team visits it. Here's exactly what that
            process looks like.
          </p>
        </div>
      </section>

      {/* Verification Steps */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-forest">
              The verification process
            </h2>
          </div>

          <div className="space-y-20">
            {verificationSteps.map((step, i) => (
              <div
                key={step.num}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  i % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                  <span className="font-playfair text-6xl font-bold text-sand/40">
                    {step.num}
                  </span>
                  <h3 className="font-playfair text-3xl font-bold text-forest mt-2 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-stone text-lg leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className={`relative h-72 rounded-2xl overflow-hidden shadow-lg ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                  <Image
                    src={step.img}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Badge Tiers */}
      <section className="py-24 bg-forest/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-terracotta text-sm font-dm tracking-widest uppercase mb-3">
              Trust Levels
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-forest">
              Our badge tiers explained
            </h2>
            <p className="text-stone text-lg font-dm mt-4 max-w-2xl mx-auto">
              Every badge means something specific. Here's what each one tells
              you about a property.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((badge) => (
              <div
                key={badge.tier}
                className={`${badge.color} border ${badge.border} rounded-2xl p-6 flex flex-col`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-3 h-3 rounded-full ${badge.dotColor}`} />
                  <span className={`font-playfair text-xl font-bold ${badge.textColor}`}>
                    {badge.tier}
                  </span>
                </div>
                <p className="text-stone text-sm leading-relaxed mb-5">
                  {badge.desc}
                </p>
                <ul className="space-y-2 mt-auto">
                  {badge.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle
                        size={14}
                        className="text-forest flex-shrink-0 mt-0.5"
                      />
                      <span className="text-stone text-xs font-dm">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Promise */}
      <section className="py-24 bg-forest text-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield size={48} className="text-sand mx-auto mb-6" />
          <h2 className="font-playfair text-4xl font-bold mb-6">
            Our trust promise
          </h2>
          <p className="text-cream/70 text-lg font-dm leading-relaxed mb-8">
            If you arrive at a Duffleup property and find it significantly
            different from what was listed, we'll make it right. No runarounds.
            That's what it means to be built by operators, not algorithms.
          </p>
          <Link
            href="/list-your-property"
            className="inline-flex items-center gap-2 bg-sand text-forest font-dm font-semibold px-8 py-4 rounded-full hover:bg-sand-light transition-colors"
          >
            List your property <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
