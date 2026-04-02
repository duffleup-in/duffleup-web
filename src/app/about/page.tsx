import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Quote } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Duffleup was built by someone who ran Waterrock offbeat resort in Bhor for 4 years. We know what hosts need and what guests deserve.',
}

const values = [
  {
    title: 'Honesty over hype',
    desc: 'Our listings show what properties actually look like. No filtered photos. No misleading descriptions.',
  },
  {
    title: 'Operators first',
    desc: 'We think like hosts, not investors. Every feature we build is designed around what makes hosting easier and more rewarding.',
  },
  {
    title: 'Maharashtra at heart',
    desc: "We're starting here because we know this land. The Sahyadris, the plateaus, the coast — we know its corners.",
  },
  {
    title: 'Long-term relationships',
    desc: 'We want property owners who stay with us for years, not list-and-leave. This is a community, not a directory.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-terracotta text-sm font-dm tracking-widest uppercase mb-4">
            Our Story
          </p>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-forest leading-tight mb-6">
            Built by an operator,
            <br />
            <span className="text-terracotta">not a tech company</span>
          </h1>
          <p className="text-stone text-lg font-dm max-w-2xl mx-auto">
            Duffleup exists because one person lived through the chaos of
            running an offbeat resort and came out the other side with a
            clearer vision of what this space needed.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative h-[520px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
                  alt="Bhor hills, Maharashtra — where Waterrock was"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-terracotta text-cream p-6 rounded-2xl shadow-xl max-w-[220px]">
                <p className="font-playfair text-lg font-bold">
                  Waterrock Resort
                </p>
                <p className="text-cream/70 text-sm mt-1">
                  Bhor, Maharashtra — 4 years of running an offbeat resort
                </p>
              </div>
            </div>

            <div>
              <Quote size={36} className="text-sand mb-6" />
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-forest leading-tight mb-6">
                I spent four years running Waterrock in Bhor. That experience
                became Duffleup.
              </h2>

              <div className="space-y-5 text-stone font-dm leading-relaxed">
                <p>
                  Running Waterrock, an offbeat resort nestled in the hills of
                  Bhor, was one of the most educational experiences of my life.
                  We had guests who loved it completely — and guests who felt
                  let down by what they found online versus what they found in
                  person.
                </p>
                <p>
                  The problem was the platforms. They showed average ratings,
                  not real pictures. They rewarded properties that gamed
                  reviews, not those that genuinely cared. Hosts were just
                  listings. Guests were just transactions.
                </p>
                <p>
                  I wanted to build something that reflected how I thought
                  about hospitality: earned trust, honest representation,
                  and a genuine partnership between hosts and travellers.
                </p>
                <p>
                  That's Duffleup. Every property listed here has been visited
                  in person. Every host has been spoken to properly. Every
                  badge means something.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-sand/30">
                <p className="font-playfair text-xl font-bold text-forest">
                  Founder, Duffleup
                </p>
                <p className="text-stone text-sm font-dm mt-1">
                  Former operator, Waterrock Offbeat Resort, Bhor, Maharashtra
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="py-24 bg-forest">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-sand/70 text-sm font-dm tracking-widest uppercase mb-4">
                For Travellers
              </p>
              <h2 className="font-playfair text-3xl font-bold text-cream mb-6">
                Discover escapes that actually deliver
              </h2>
              <p className="text-cream/70 font-dm leading-relaxed">
                Every property on Duffleup has been physically visited by our
                team. When you book, you know exactly what to expect. No
                catfishing. No disappointing surprises. Just honest,
                wonderful stays.
              </p>
            </div>
            <div>
              <p className="text-sand/70 text-sm font-dm tracking-widest uppercase mb-4">
                For Property Owners
              </p>
              <h2 className="font-playfair text-3xl font-bold text-cream mb-6">
                A platform that actually understands your work
              </h2>
              <p className="text-cream/70 font-dm leading-relaxed">
                We know what it takes to run a hospitality property. The
                seasons, the operational challenges, the guests who get it and
                the ones who don't. We build tools and partnerships that
                respect the work you put in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-forest">
              What we stand for
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="border border-sand/40 rounded-2xl p-8 hover:border-forest/30 transition-colors"
              >
                <h3 className="font-playfair text-xl font-bold text-forest mb-3">
                  {v.title}
                </h3>
                <p className="text-stone text-sm font-dm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scenic Divider */}
      <section className="relative h-72 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1800&q=80"
          alt="Sahyadri hills, Maharashtra"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-forest/50 flex items-center justify-center">
          <p className="font-playfair text-3xl md:text-4xl font-bold text-cream text-center px-4">
            Maharashtra has hidden corners.
            <br />
            <span className="text-sand">We find them first.</span>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-cream text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-4xl font-bold text-forest mb-4">
            Be part of something different
          </h2>
          <p className="text-stone font-dm text-lg mb-10">
            Whether you're a traveller looking for a real escape, or an owner
            who wants your property represented honestly — Duffleup is for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-forest text-cream font-dm font-semibold px-8 py-4 rounded-full hover:bg-forest-light transition-colors inline-flex items-center gap-2 justify-center"
            >
              Browse Stays <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="border-2 border-forest text-forest font-dm font-medium px-8 py-4 rounded-full hover:bg-forest hover:text-cream transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
