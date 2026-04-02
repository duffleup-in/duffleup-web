'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-playfair text-2xl font-bold text-forest">
              duffleup
            </span>
            <span className="text-xs text-terracotta font-dm font-medium tracking-widest uppercase">
              Maharashtra
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-forest hover:text-terracotta transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/list-your-property"
              className="bg-forest text-cream text-sm font-medium px-5 py-2.5 rounded-full hover:bg-forest-light transition-colors"
            >
              List Your Property
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-forest p-2"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-sand/40">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-forest hover:text-terracotta transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/list-your-property"
              onClick={() => setMenuOpen(false)}
              className="bg-forest text-cream text-sm font-medium px-5 py-3 rounded-full text-center hover:bg-forest-light transition-colors"
            >
              List Your Property
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
