import Link from 'next/link'
import { MapPin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-forest text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-playfair text-3xl font-bold text-sand mb-3">
              duffleup
            </h3>
            <p className="text-cream/70 text-sm leading-relaxed max-w-sm">
              Offbeat stays you can actually trust. Every property physically
              verified before listing. Built by an operator, not a tech company.
            </p>
            <div className="flex items-center gap-2 mt-4 text-cream/60 text-sm">
              <MapPin size={14} />
              <span>Maharashtra, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-sand mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/how-it-works', label: 'How It Works' },
                { href: '/about', label: 'Our Story' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-sand text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-sand mb-4">
              For Property Owners
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/list-your-property"
                  className="text-cream/70 hover:text-sand text-sm transition-colors"
                >
                  List Your Property
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-cream/70 hover:text-sand text-sm transition-colors"
                >
                  Verification Process
                </Link>
              </li>
              <li>
                <Link
                  href="/list-your-property#commission"
                  className="text-cream/70 hover:text-sand text-sm transition-colors"
                >
                  12% Commission Model
                </Link>
              </li>
            </ul>

            <div className="mt-6 space-y-2">
              <a
                href="mailto:hello@duffleup.in"
                className="flex items-center gap-2 text-cream/70 hover:text-sand text-sm transition-colors"
              >
                <Mail size={14} />
                hello@duffleup.in
              </a>
              <a
                href="https://wa.me/919876543210"
                className="flex items-center gap-2 text-cream/70 hover:text-sand text-sm transition-colors"
              >
                <Phone size={14} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/40 text-sm">
            © {new Date().getFullYear()} Duffleup. All rights reserved.
          </p>
          <p className="text-cream/40 text-sm">
            Made with care in Maharashtra, India
          </p>
        </div>
      </div>
    </footer>
  )
}
