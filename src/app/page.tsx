import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Shield, MapPin, Star, ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Duffleup — Offbeat Stays You Can Actually Trust',
  description:
    'Discover verified offbeat stays across Maharashtra. Every property physically checked before listing. Scroll through handpicked nature retreats, forest cottages, and riverside escapes.',
}

const featuredProperties = [
  {
    id: 1,
    name: 'Misty Valley Cottage',
    location: 'Bhimashankar, Maharashtra',
    badge: 'Certified',
    rating: 4.9,
    reviews: 34,
    image:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
    tags: ['Forest', 'Monsoon', 'Pet-friendly'],
  },
  {
    id: 2,
    name: 'The River Nest',
    location: 'Koyna, Maharashtra',
    badge: 'Verified',
    rating: 4.7,
    reviews: 21,
    image:
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=800&q=80',
    tags: ['Riverside', 'Birdwatching', 'Trekking'],
  },
  {
    id: 3,
    name: 'Hilltop Hideout',
    location: 'Bhor, Maharashtra',
    badge: 'Select',
    rating: 5.0,
    reviews: 18,
    image:
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    tags: ['Sunrise views', 'Bonfire', 'Secluded'],
  },
]

const badgeColors: Record<string, string> = {
  Listed: 'bg-gray-100 text-gray-700',
  Verified: 'bg-sand/30 text-stone',
  Certified: 'bg-forest/10 text-forest',
  Select: 'bg-terracotta/10 text-terracotta',
}

const howItWorksSteps = [
  {
    step: '01',
    title: 'Browse curated stays',
    desc: 'Every property on Duffleup has been handpicked and physically visited by our team.',
  },
  {
    step: '02',
    title: 'Check the badge',
    desc: 'Listed → Verified → Certified → Select. Each tier means deeper vetting and more trust.',
  },
  {
    step: '03',
    title: 'Book with confidence',
    desc: 'No surprises. What you see is exactly what you get — we stake our reputation on it.',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1800&q=80"
            alt="Misty mountains of Maharashtra"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/50 to-forest/80" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <p className="text-sand text-sm font-dm tracking-widest uppercase mb-4">
            Maharashtra's Offbeat Stays Platform
          </p>
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-cream leading-tight mb-6">
            Offbeat stays you can{' '}
            <em className="text-sand not-italic">actually</em> trust
          </h1>
          <p className="text-cream/80 text-lg md:text-xl font-dm max-w-2xl mx-auto mb-10">
            Every property on Duffleup is physically verified before listing.
            No algorithms. No shortcuts. Just honest, handpicked escapes.
          </p>

          {/* Search Bar */}
          <div className="bg-cream rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-2xl">
            <div className="flex items-center gap-3 flex-1 px-4 py-2">
              <MapPin size={18} className="text-terracotta flex-shrink-0" />
              <input
                type="text"
                placeholder="Where in Maharashtra?"
                className="bg-transparent text-forest placeholder:text-stone/60 font-dm text-sm w-full outline-none"
              />
            </div>
            <div className="h-px sm:h-auto sm:w-px bg-sand/40 mx-2" />
            <div className="flex items-center gap-3 flex-1 px-4 py-2">
              <Search size={18} className="text-terracotta flex-shrink-0" />
              <input
                type="text"
                placeholder="Forest, Riverside, Hills..."
                className="bg-transparent text-forest placeholder:text-stone/60 font-dm text-sm w-full outline-none"
              />
            </div>
            <button className="bg-terracotta text-cream font-dm font-medium text-sm px-6 py-3 rounded-xl hover:bg-terracotta-dark transition-colors flex-shrink-0">
              Explore Stays
            </button>
          </div>

          <p className="text-cream/50 text-xs font-dm mt-4">
            ✓ Physically verified &nbsp;·&nbsp; ✓ Honest listings &nbsp;·&nbsp; ✓ Operator-backed
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-cream/50 text-xs font-dm tracking-wider">
            SCROLL
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-cream/40 to-transparent" />
        </div>
      </section>

      {/* Trust Story */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-terracotta text-sm font-dm tracking-widest uppercase mb-3">
                Our Promise
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-forest leading-tight mb-6">
                We visit every property. Every single one.
              </h2>
              <p className="text-stone text-lg leading-relaxed mb-6">
                Duffleup was born from frustration. Too many times, a beautiful
                listing turned into a disappointing stay. Photos that lied.
                Hosts who vanished.
              </p>
              <p className="text-stone text-lg leading-relaxed mb-8">
                So we built something different — a platform where our team
                physically visits and verifies every stay before it goes live.
                Not a form. Not a checkbox. A real visit.
              </p>
              <ul className="space-y-4">
                {[
                  'Physical inspection by our team',
                  'Host interview & background check',
                  'Honest photography guidelines',
                  'Ongoing quality monitoring',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-forest flex-shrink-0" />
                    <span className="text-forest font-dm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80"
                  alt="Lush green nature stay in Maharashtra"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-forest text-cream p-6 rounded-2xl shadow-xl max-w-[200px]">
                <p className="font-playfair text-3xl font-bold text-sand">
                  100%
                </p>
                <p className="text-cream/70 text-sm mt-1">
                  Properties physically verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-forest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sand/70 text-sm font-dm tracking-widest uppercase mb-3">
              Simple & Transparent
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-cream">
              How Duffleup works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((item) => (
              <div
                key={item.step}
                className="bg-cream/5 border border-cream/10 rounded-2xl p-8 hover:bg-cream/10 transition-colors"
              >
                <span className="font-playfair text-5xl font-bold text-sand/30">
                  {item.step}
                </span>
                <h3 className="font-playfair text-xl font-bold text-cream mt-4 mb-3">
                  {item.title}
                </h3>
                <p className="text-cream/60 font-dm text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-sand font-dm font-medium hover:gap-3 transition-all"
            >
              Learn about our verification process{' '}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-terracotta text-sm font-dm tracking-widest uppercase mb-2">
                Handpicked
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-forest">
                Featured stays
              </h2>
            </div>
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 text-forest font-dm text-sm font-medium hover:text-terracotta transition-colors"
            >
              View all stays <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs font-dm font-semibold px-3 py-1 rounded-full ${badgeColors[property.badge]}`}
                    >
                      {property.badge}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-playfair text-xl font-bold text-forest">
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star
                        size={14}
                        className="text-sand fill-sand"
                      />
                      <span className="text-sm font-dm font-medium text-stone">
                        {property.rating}
                      </span>
                      <span className="text-xs text-stone/60">
                        ({property.reviews})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    <MapPin size={13} className="text-terracotta" />
                    <span className="text-xs font-dm text-stone">
                      {property.location}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {property.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-dm bg-cream text-stone px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Owners CTA */}
      <section className="py-24 bg-terracotta relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1800&q=80"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-cream/70 text-sm font-dm tracking-widest uppercase mb-4">
            For Property Owners
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-cream leading-tight mb-6">
            Own an offbeat property?
            <br />
            Let's put it on the map.
          </h2>
          <p className="text-cream/80 text-lg font-dm max-w-2xl mx-auto mb-4">
            Join Maharashtra's most trusted offbeat stays network. We charge
            just <strong className="text-cream">12% commission on bookings</strong> —
            no monthly fees, no nonsense.
          </p>
          <p className="text-cream/60 text-sm font-dm mb-10">
            Founding Partner slots are limited. Apply now and get priority listing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/list-your-property"
              className="bg-cream text-terracotta font-dm font-semibold px-8 py-4 rounded-full hover:bg-sand transition-colors text-base"
            >
              List Your Property
            </Link>
            <Link
              href="/how-it-works"
              className="border-2 border-cream/40 text-cream font-dm font-medium px-8 py-4 rounded-full hover:border-cream transition-colors text-base"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-12 bg-forest/5 border-y border-sand/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50+', label: 'Properties Listed' },
              { value: '100%', label: 'Physically Verified' },
              { value: '4.8★', label: 'Average Rating' },
              { value: '12%', label: 'Only On Bookings' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-playfair text-3xl md:text-4xl font-bold text-forest">
                  {stat.value}
                </p>
                <p className="text-stone text-sm font-dm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
