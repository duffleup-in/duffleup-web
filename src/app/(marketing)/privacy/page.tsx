import type { Metadata } from 'next'
import { PageHero } from '@/components/marketing/PageHero'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Duffleup privacy policy.',
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy" />
      <section className="bg-sterling-warm">
        <div className="mx-auto max-w-[800px] px-6 py-16">
          <p className="max-w-2xl text-subh leading-relaxed text-pitch-soft">
            Our full privacy policy is being finalised and will be published here
            before launch. Until then, the only data we collect is what you hand us
            via the early-access form. Questions? Email hello@duffleup.in.
          </p>
        </div>
      </section>
    </>
  )
}
