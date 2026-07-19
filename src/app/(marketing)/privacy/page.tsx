import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Duffleup privacy policy.',
}

export default function PrivacyPage() {
  return (
    <main className="bg-sterling-warm">
      <section className="mx-auto max-w-[800px] px-6 py-16">
        <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-hyperpurple">
          Legal
        </p>
        <h1 className="mb-6 font-display text-[clamp(40px,6vw,64px)] leading-none">Privacy</h1>
        <p className="max-w-2xl text-subh leading-relaxed text-pitch-soft">
          Our full privacy policy is being finalised and will be published here
          before launch. Until then, the only data we collect is what you hand us
          via the early-access form. Questions? Email hello@duffleup.in.
        </p>
      </section>
    </main>
  )
}
