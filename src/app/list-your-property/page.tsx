import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, TrendingUp, Shield, Users, ArrowRight, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'List Your Property',
  description:
    'Join Duffleup and list your offbeat property in Maharashtra. 12% commission only on bookings — no monthly fees. Founding Partner offer available.',
}

const benefits = [
  {
    icon: <TrendingUp size={24} className="text-terracotta" />,
    title: '12% only on bookings',
    desc: 'We earn when you earn. No monthly fees, no listing charges, no hidden costs. Simple.',
  },
  {
    icon: <Shield size={24} className="text-terracotta" />,
    title: 'Verified badge = more trust',
    desc: 'Our verification process signals quality to discerning travellers who pay a premium for genuine experiences.',
  },
  {
    icon: <Users size={24} className="text-terracotta" />,
    title: 'Curated, not mass-market',
    desc: "Your property won't be buried next to 10,000 listings. We curate. Your guests are the right guests.",
  },
  {
    icon: <Star size={24} className="text-terracotta" />,
    title: 'Operator-backed support',
    desc: 'Our founder ran a resort for 4 years. We give advice that actually works, not generic tips from a tech team.',
  },
]

const steps = [
  { num: '01', label: 'Submit your details', desc: 'Fill out the form below. Tell us about your property, location, and capacity.' },
  { num: '02', label: 'We visit in person', desc: 'Our team schedules a site visit at your convenience. No forms replace this step.' },
  { num: '03', label: 'Photos & listing', desc: 'We help create an honest, compelling listing. You approve everything before it goes live.' },
  { num: '04', label: 'Start getting bookings', desc: 'Go live. Guests book. You host. We handle payments and support. You get paid every 15 days.' },
]

export default function ListYourPropertyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1800&q=80"
            alt="Scenic Maharashtra property"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sand/80 text-sm font-dm tracking-widest uppercase mb-4">
            For Property Owners
          </p>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-cream leading-tight mb-6">
            List your offbeat property
            <br />
            <span className="text-sand">the right way</span>
          </h1>
          <p className="text-cream/70 text-lg font-dm max-w-2xl mx-auto mb-10">
            Join Maharashtra's most trusted offbeat stays platform. We don't
            just list you — we verify you, position you, and help you grow.
          </p>
          <a
            href="#apply"
            className="bg-terracotta text-cream font-dm font-semibold px-8 py-4 rounded-full hover:bg-terracotta-dark transition-colors text-base inline-block"
          >
            Apply to List Your Property
          </a>
        </div>
      </section>

      {/* Founding Partner Banner */}
      <section className="bg-sand py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            <span className="bg-terracotta text-cream text-xs font-dm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Limited Offer
            </span>
            <p className="font-dm text-forest font-medium">
              <strong>Founding Partner Slots:</strong> First 25 properties get
              priority listing, featured placement, and dedicated onboarding
              support at no extra cost.
            </p>
            <a
              href="#apply"
              className="text-terracotta font-dm font-semibold text-sm underline underline-offset-4 hover:text-terracotta-dark transition-colors"
            >
              Secure your slot →
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-terracotta text-sm font-dm tracking-widest uppercase mb-3">
              Why Duffleup
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-forest">
              Built for property owners
            </h2>
            <p className="text-stone text-lg font-dm mt-4 max-w-2xl mx-auto">
              We built this from the owner's side of the table. Because our
              founder was on that side for four years.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{b.icon}</div>
                <h3 className="font-playfair text-xl font-bold text-forest mb-3">
                  {b.title}
                </h3>
                <p className="text-stone text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Model */}
      <section id="commission" className="py-24 bg-forest text-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sand/70 text-sm font-dm tracking-widest uppercase mb-4">
                Pricing Model
              </p>
              <h2 className="font-playfair text-4xl font-bold mb-6">
                12% and nothing else
              </h2>
              <p className="text-cream/70 text-lg font-dm leading-relaxed mb-6">
                We charge a 12% commission on each successful booking. That's
                it. No monthly subscription. No setup fees. No listing charges.
              </p>
              <ul className="space-y-4">
                {[
                  'No booking = No fee',
                  'Transparent payout every 15 days',
                  'You keep 88% of every booking',
                  'No lock-in contracts',
                  'Cancel your listing anytime',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-sand flex-shrink-0" />
                    <span className="text-cream/80 font-dm text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-cream/10 border border-cream/20 rounded-2xl p-8">
              <p className="text-sand/70 text-xs font-dm tracking-widest uppercase mb-4">
                Example Calculation
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cream/70 font-dm text-sm">Booking value</span>
                  <span className="text-cream font-playfair text-xl font-bold">₹8,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cream/70 font-dm text-sm">Duffleup commission (12%)</span>
                  <span className="text-cream/60 font-dm">₹960</span>
                </div>
                <div className="border-t border-cream/20 pt-4 flex justify-between items-center">
                  <span className="text-sand font-dm font-semibold">You receive</span>
                  <span className="text-sand font-playfair text-3xl font-bold">₹7,040</span>
                </div>
              </div>
              <p className="text-cream/40 text-xs font-dm mt-6 text-center">
                GST applicable as per government norms
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-forest">
              How to get listed
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-sand/40" />
                )}
                <div className="relative text-center">
                  <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                    <span className="text-sand font-playfair font-bold text-sm">
                      {s.num}
                    </span>
                  </div>
                  <h3 className="font-playfair text-lg font-bold text-forest mb-2">
                    {s.label}
                  </h3>
                  <p className="text-stone text-sm font-dm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-24 bg-forest/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-terracotta text-sm font-dm tracking-widest uppercase mb-3">
              Apply Now
            </p>
            <h2 className="font-playfair text-4xl font-bold text-forest mb-4">
              Tell us about your property
            </h2>
            <p className="text-stone font-dm">
              We'll get back to you within 48 hours to schedule a site visit.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-forest font-dm text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full border border-sand/50 rounded-xl px-4 py-3 font-dm text-sm text-forest placeholder:text-stone/40 focus:outline-none focus:ring-2 focus:ring-forest/30 bg-cream/50"
                  />
                </div>
                <div>
                  <label className="block text-forest font-dm text-sm font-medium mb-2">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full border border-sand/50 rounded-xl px-4 py-3 font-dm text-sm text-forest placeholder:text-stone/40 focus:outline-none focus:ring-2 focus:ring-forest/30 bg-cream/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-forest font-dm text-sm font-medium mb-2">
                  Property Name
                </label>
                <input
                  type="text"
                  placeholder="What is your property called?"
                  className="w-full border border-sand/50 rounded-xl px-4 py-3 font-dm text-sm text-forest placeholder:text-stone/40 focus:outline-none focus:ring-2 focus:ring-forest/30 bg-cream/50"
                />
              </div>

              <div>
                <label className="block text-forest font-dm text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Village, Taluka, District — Maharashtra"
                  className="w-full border border-sand/50 rounded-xl px-4 py-3 font-dm text-sm text-forest placeholder:text-stone/40 focus:outline-none focus:ring-2 focus:ring-forest/30 bg-cream/50"
                />
              </div>

              <div>
                <label className="block text-forest font-dm text-sm font-medium mb-2">
                  Tell us about your property
                </label>
                <textarea
                  rows={4}
                  placeholder="Type of stay, capacity, what makes it special..."
                  className="w-full border border-sand/50 rounded-xl px-4 py-3 font-dm text-sm text-forest placeholder:text-stone/40 focus:outline-none focus:ring-2 focus:ring-forest/30 bg-cream/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-terracotta text-cream font-dm font-semibold py-4 rounded-xl hover:bg-terracotta-dark transition-colors"
              >
                Submit Application
              </button>

              <p className="text-stone/50 text-xs font-dm text-center">
                By submitting, you agree to our terms of service. We'll be in touch within 48 hours.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
