import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Duffleup terms of service.',
}

export default function TermsPage() {
  return (
    <main className="bg-sterling-warm">
      <section className="mx-auto max-w-[800px] px-6 py-16">
        <p className="mb-2 font-utility text-subh uppercase tracking-[0.1em] text-hyperpurple">
          Legal
        </p>
        <h1 className="mb-6 font-display text-[clamp(40px,6vw,64px)] leading-none">Terms</h1>
        <p className="max-w-2xl text-subh leading-relaxed text-pitch-soft">
          The full terms of service are being finalised and will be published here
          before launch. In the meantime, reach us at hello@duffleup.in with any
          questions.
        </p>
      </section>
    </main>
  )
}
