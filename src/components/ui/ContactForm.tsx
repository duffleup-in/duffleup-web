'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-forest/5 border border-forest/20 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={24} className="text-cream" />
        </div>
        <h3 className="font-playfair text-2xl font-bold text-forest mb-3">
          Message sent!
        </h3>
        <p className="text-stone font-dm">
          Thanks for reaching out. We'll get back to you within 24 hours.
          For urgent queries, please WhatsApp us directly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-forest font-dm text-sm font-medium mb-2">
            Your Name
          </label>
          <input
            type="text"
            required
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            placeholder="Full name"
            className="w-full border border-sand/50 rounded-xl px-4 py-3 font-dm text-sm text-forest placeholder:text-stone/40 focus:outline-none focus:ring-2 focus:ring-forest/30 bg-cream/50"
          />
        </div>
        <div>
          <label className="block text-forest font-dm text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full border border-sand/50 rounded-xl px-4 py-3 font-dm text-sm text-forest placeholder:text-stone/40 focus:outline-none focus:ring-2 focus:ring-forest/30 bg-cream/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-forest font-dm text-sm font-medium mb-2">
          Subject
        </label>
        <select
          value={formState.subject}
          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
          className="w-full border border-sand/50 rounded-xl px-4 py-3 font-dm text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 bg-cream/50"
        >
          <option value="">Select a topic...</option>
          <option value="stay-inquiry">Inquiry about a stay</option>
          <option value="list-property">List my property</option>
          <option value="partnership">Partnership / Press</option>
          <option value="feedback">Feedback</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-forest font-dm text-sm font-medium mb-2">
          Your Message
        </label>
        <textarea
          rows={5}
          required
          value={formState.message}
          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
          placeholder="Tell us what's on your mind..."
          className="w-full border border-sand/50 rounded-xl px-4 py-3 font-dm text-sm text-forest placeholder:text-stone/40 focus:outline-none focus:ring-2 focus:ring-forest/30 bg-cream/50 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-forest text-cream font-dm font-semibold py-4 rounded-xl hover:bg-forest-light transition-colors flex items-center justify-center gap-2"
      >
        Send Message <Send size={16} />
      </button>
    </form>
  )
}
