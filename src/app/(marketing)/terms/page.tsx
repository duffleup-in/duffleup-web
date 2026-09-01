import type { Metadata } from 'next'
import { PageHero } from '@/components/marketing/PageHero'

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Duffleup terms of service.',
}

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms" />
      <section className="bg-sterling-warm">
        <div className="mx-auto max-w-[800px] px-6 py-16">
          <p className="max-w-2xl text-subh leading-relaxed text-pitch-soft">
            The full terms of service are being finalised and will be published here
            before launch. In the meantime, reach us at hello@duffleup.in with any
            questions.
          </p>
        </div>
      </section>
    </>
  )
}
