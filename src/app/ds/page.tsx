import type { Metadata } from 'next'
import { Compass, MapPin } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Chip } from '@/components/ui/Chip'
import { Avatar, AvatarStack } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { PropertyCard } from '@/components/marketing/PropertyCard'
import { StickerMoodCard } from '@/components/marketing/StickerMoodCard'
import { SocialCard } from '@/components/marketing/SocialCard'
import { SiteNav } from '@/components/marketing/SiteNav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Design System',
  robots: { index: false, follow: false },
}

function Section({
  title,
  eyebrow,
  children,
}: {
  title: string
  eyebrow: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-line py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="mb-1 font-utility text-subh uppercase tracking-[0.1em] text-hyperpurple">
          {eyebrow}
        </p>
        <h2 className="mb-8 font-display text-h5">{title}</h2>
        {children}
      </div>
    </section>
  )
}

const moods = [
  { mood: 'chill' as const, name: 'Chill', description: 'Slow mornings. Quiet evenings. The kind of quiet you forgot existed.' },
  { mood: 'romance' as const, name: 'Romance', description: 'For two. For nothing else. Bring the right person.', tag: 'For two' },
  { mood: 'adventure' as const, name: 'Adventure', description: 'Wake up where the trail starts. Sleep where the campfire ends.' },
  { mood: 'reset' as const, name: 'Reset', description: 'Disappear without explaining. Come back as someone slightly better.', tag: 'Solo OK' },
  { mood: 'bash' as const, name: 'Bash', description: 'Bring everyone. Plan nothing. The place can handle it.' },
  { mood: 'pets' as const, name: 'Pets', description: 'Bring the whole family. Even the loud ones with four legs.', tag: 'Pets welcome' },
]

export default function DesignSystemPage() {
  return (
    <main className="bg-sterling-warm">
      {/* Header */}
      <div className="bg-pitch py-10 text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <Logo size="sm" />
          <h1 className="mt-4 font-display text-h4">Design System</h1>
          <p className="mt-2 font-utility text-subh uppercase tracking-[0.1em] text-acid">
            SP-14 · Phase 1 foundation
          </p>
        </div>
      </div>

      {/* Logo on surfaces */}
      <Section eyebrow="The wordmark" title="Logo on every surface">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { bg: 'bg-white', label: 'On white', text: 'text-pitch-soft' },
            { bg: 'bg-pitch', label: 'On pitch', text: 'text-white/60' },
            { bg: 'bg-acid', label: 'On acid', text: 'text-pitch-soft' },
            { bg: 'bg-slap-pink', label: 'On slap pink', text: 'text-white/80' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} flex flex-col items-center gap-3 rounded-sm border border-line p-8`}>
              <Logo size="sm" />
              <p className={`font-utility text-subtitle uppercase tracking-[0.1em] ${s.text}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Typography */}
      <Section eyebrow="Typography" title="Three fonts, locked roles">
        <div className="space-y-6">
          <div className="rounded-md border border-line bg-white p-8">
            <p className="mb-2 font-mono text-caption text-pitch-soft">BUNGEE — DISPLAY</p>
            <p className="font-display text-h3">Book a weekend.</p>
          </div>
          <div className="rounded-md border border-line bg-white p-8">
            <p className="mb-2 font-mono text-caption text-pitch-soft">BEBAS NEUE — UTILITY</p>
            <p className="font-utility text-h4 uppercase tracking-[0.02em]">2 nights · 1 duffle · zero apologies</p>
          </div>
          <div className="rounded-md border border-line bg-white p-8">
            <p className="mb-2 font-mono text-caption text-pitch-soft">ARIAL — BODY</p>
            <p className="max-w-2xl text-subh leading-relaxed">
              Duffleup is a marketplace for offbeat properties across Maharashtra. Honest
              pricing. No hidden fees. No fake reviews.
            </p>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section eyebrow="Components" title="Buttons">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 rounded-sm border border-line bg-white p-6">
            <Button variant="primary">Pack my duffle</Button>
            <Button variant="secondary-dark">Got a place?</Button>
            <Button variant="ghost">Learn more</Button>
            <Button variant="destructive">Cancel booking</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-sm bg-pitch p-6">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-sm border border-line bg-white p-6">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </div>
      </Section>

      {/* Inputs */}
      <Section eyebrow="Components" title="Form inputs">
        <div className="grid grid-cols-1 gap-6 rounded-sm border border-line bg-white p-6 sm:grid-cols-2">
          <Input label="Default" name="d1" placeholder="Where to?" helperText="Pick a mood, not a star rating." />
          <Input label="Validating" name="d2" state="validating" defaultValue="Checking…" helperText="Hold tight." />
          <Input label="Success" name="d3" state="success" defaultValue="Lonavala" helperText="Looks good." />
          <Input label="Error" name="d4" state="error" defaultValue="" helperText="Couldn't go through." />
          <Input label="Disabled" name="d5" disabled placeholder="Unavailable" />
        </div>
      </Section>

      {/* Alerts */}
      <Section eyebrow="Components" title="Alerts">
        <div className="space-y-3">
          <Alert variant="success" title="Locked in" dismissable>Pack accordingly. Check your inbox for the details.</Alert>
          <Alert variant="info" title="Heads up" dismissable>Holding your spot. Pay to lock it in.</Alert>
          <Alert variant="warning" title="Needs attention" dismissable>Your payment is still processing.</Alert>
          <Alert variant="danger" title="Couldn't go through" dismissable>The card was declined. Try another.</Alert>
        </div>
      </Section>

      {/* Badges + Chips */}
      <Section eyebrow="Components" title="Badges & chips">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 rounded-sm border border-line bg-white p-6">
            <Badge tier="standard" />
            <Badge tier="certified" />
            <Badge tier="select" />
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-sm border border-line bg-white p-6">
            <Chip mood="chill">Chill</Chip>
            <Chip mood="romance">Romance</Chip>
            <Chip mood="adventure">Adventure</Chip>
            <Chip mood="reset">Reset</Chip>
            <Chip mood="bash">Bash</Chip>
            <Chip mood="pets">Pets</Chip>
            <Chip>Neutral</Chip>
          </div>
        </div>
      </Section>

      {/* Avatars */}
      <Section eyebrow="Components" title="Avatars">
        <div className="flex flex-wrap items-center gap-6 rounded-sm border border-line bg-white p-6">
          <Avatar size={96} initials="GM" />
          <Avatar size={72} initials="AR" status="active" />
          <Avatar size={56} initials="SK" status="inactive" />
          <Avatar size={48} initials="JP" />
          <Avatar size={32} initials="DV" />
          <Avatar size={24} initials="?" />
          <AvatarStack count={3}>
            <Avatar size={48} initials="GM" />
            <Avatar size={48} initials="AR" />
            <Avatar size={48} initials="SK" />
          </AvatarStack>
        </div>
      </Section>

      {/* Property cards */}
      <Section eyebrow="Marketing" title="Property cards">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PropertyCard
            name="Fog & Pine"
            area="Lonavala, MH"
            tier="select"
            price="₹8,400"
            placeholderVariant="chill"
            chips={[{ label: 'Chill', mood: 'chill' }, { label: 'Pets', mood: 'pets' }]}
          />
          <PropertyCard
            name="Riverbend Camp"
            area="Kolad, MH"
            tier="certified"
            price="₹6,200"
            placeholderVariant="adventure"
            chips={[{ label: 'Adventure', mood: 'adventure' }]}
          />
          <PropertyCard
            name="The Quiet House"
            area="Bhandardara, MH"
            tier="standard"
            price="₹5,000"
            placeholderVariant="reset"
            chips={[{ label: 'Reset', mood: 'reset' }]}
          />
        </div>
      </Section>

      {/* Sticker mood cards */}
      <Section eyebrow="Marketing" title="Sticker mood cards">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {moods.map((m) => (
            <StickerMoodCard key={m.mood} {...m} />
          ))}
        </div>
      </Section>

      {/* Social cards */}
      <Section eyebrow="Marketing" title="Social cards">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <SocialCard variant="acid" quote="Don't book a room. Book a weekend." />
          <SocialCard variant="pink" quote="Zero apologies." />
          <SocialCard variant="purple" quote="2 nights. 1 duffle." />
        </div>
      </Section>

      {/* Empty state */}
      <Section eyebrow="Components" title="Empty state">
        <div className="rounded-md border border-line bg-white">
          <EmptyState
            icon={<Compass size={36} aria-hidden="true" />}
            title="Nowhere booked yet."
            body="Pick a mood. Pack a duffle. Go."
            action={
              <Button variant="primary">
                <MapPin size={16} aria-hidden="true" /> Get me out there
              </Button>
            }
          />
        </div>
      </Section>

      {/* Site nav + Footer */}
      <Section eyebrow="Marketing" title="Site nav & footer">
        <div className="overflow-hidden rounded-md border border-line">
          <SiteNav />
          <div className="bg-sterling-warm py-16 text-center font-utility uppercase tracking-[0.1em] text-pitch-soft">
            Scroll the page — the nav sticks to the top.
          </div>
          <Footer />
        </div>
      </Section>
    </main>
  )
}
