import type { Metadata } from 'next'
import { Mail, MapPin, MessageCircle } from 'lucide-react'
import ContactForm from '@/components/ui/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Duffleup via WhatsApp, email, or our contact form. We read and respond to everything personally.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-forest">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sand/70 text-sm font-dm tracking-widest uppercase mb-4">
            Get In Touch
          </p>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-cream leading-tight mb-6">
            We're real people.
            <br />
            <span className="text-sand">Let's talk.</span>
          </h1>
          <p className="text-cream/70 text-lg font-dm max-w-2xl mx-auto">
            Whether you have a question about a stay, want to list your
            property, or just want to say hello — we're here and we read
            everything.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* WhatsApp */}
            <a
              href="https://wa.me/919876543210?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20Duffleup"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-[#25D366]/20 transition-colors"
            >
              <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle size={24} className="text-white" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-forest mb-2">
                WhatsApp
              </h3>
              <p className="text-stone text-sm font-dm mb-4">
                Quickest way to reach us. We typically respond within a few hours.
              </p>
              <span className="text-[#25D366] font-dm font-medium text-sm">
                Chat on WhatsApp →
              </span>
            </a>

            {/* Email */}
            <a
              href="mailto:hello@duffleup.in"
              className="group bg-white border border-sand/30 rounded-2xl p-8 flex flex-col items-center text-center hover:border-forest/30 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="w-14 h-14 bg-forest rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail size={24} className="text-cream" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-forest mb-2">
                Email Us
              </h3>
              <p className="text-stone text-sm font-dm mb-4">
                For detailed queries, partnership inquiries, or press.
              </p>
              <span className="text-forest font-dm font-medium text-sm">
                hello@duffleup.in
              </span>
            </a>

            {/* Location */}
            <div className="bg-white border border-sand/30 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
              <div className="w-14 h-14 bg-terracotta rounded-full flex items-center justify-center mb-4">
                <MapPin size={24} className="text-cream" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-forest mb-2">
                Based in
              </h3>
              <p className="text-stone text-sm font-dm mb-4">
                We operate across Maharashtra with a focus on the Sahyadri
                belt and Western Ghats.
              </p>
              <span className="text-stone font-dm font-medium text-sm">
                Maharashtra, India
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-playfair text-4xl font-bold text-forest mb-3">
                Send us a message
              </h2>
              <p className="text-stone font-dm">
                We read and respond to every email personally.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
