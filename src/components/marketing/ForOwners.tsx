import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function ForOwners() {
  return (
    <section className="border-b border-line bg-acid py-16 text-pitch">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="max-w-2xl font-display text-[clamp(40px,6vw,64px)] leading-none">
            Got a place worth showing?
          </h2>
          <p className="mt-4 max-w-xl font-utility text-[clamp(18px,2vw,22px)] uppercase tracking-[0.05em]">
            Verified properties only. Honest commissions. You set the rules.
          </p>
        </div>
        <Button asChild variant="secondary-dark" size="lg">
          <Link href="/list-your-property">Tell us about it</Link>
        </Button>
      </div>
    </section>
  )
}
