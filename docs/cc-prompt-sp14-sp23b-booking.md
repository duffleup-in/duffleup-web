# SP-14 + SP-23b + Booking UI — Duffleup Frontend Build

> **Run this in:** Claude Code, inside `C:\Code\duffleup\duffleup-web`
> **Scope:** Design system foundation → landing page → booking flow UI
> **Duration estimate:** 3 phases, ~4–6 hours of CC work depending on existing scaffolding
> **Critical rule:** Stop and ask after each phase. Do not chain phases. Do not run away.

---

## Mission

Build the Duffleup design system in code, apply it to the landing page, and ship the booking flow UI in `duffleup-web` (Next.js App Router + Tailwind v3). The brand kit is locked. The voice is locked. The logo is provided as SVG. You're translating a finalized HTML specification into production React.

## Reference materials

You will receive (or already have in repo context):

1. `duffleup-design-system-v0.4.html` — the canonical visual reference. Open it in a browser to see the target. Every component, color, font, and copy line below is consistent with this file. **If anything in this prompt conflicts with v0.4, treat v0.4 as the source of truth and ask before deviating.**
2. `duffleup-logo.svg` — production logo asset. Transparent background, vector, works on any surface.

Copy both into the repo before starting:
- Save `duffleup-logo.svg` to `public/duffleup-logo.svg`
- Keep `duffleup-design-system-v0.4.html` in `docs/design-system-v0.4.html` for ongoing reference

## Backend context (separate repo, do not modify)

- API repo: `duffleup-api` (NestJS + Prisma + Neon)
- 391 tests passing on origin/main at 6d3c72a
- Booking model: instant-book only (PENDING_PAYMENT → CONFIRMED via payment.captured webhook)
- Tier enum: STANDARD / CERTIFIED / SELECT
- Mood enum: CHILL / ROMANCE / ADVENTURE / RESET / BASH / PETS
- API base URL via env: `NEXT_PUBLIC_API_URL` (Gaurav will provide; assume `http://localhost:3001` in dev)

---

## PHASING — DO NOT SKIP

Each phase ends with a **CHECKPOINT**. At every checkpoint:
1. Commit work with a conventional commit message.
2. Summarize what was built (file list + screenshot of key pages if possible).
3. **STOP. Ask Gaurav to review before continuing.**

Do not pre-merge phases. Do not write Phase 3 code while Phase 2 is unreviewed.

---

# PHASE 1 — Foundation (design tokens + component library)

## 1.1 Read first, propose second

Before writing any code:

1. List the current state of `app/`, `components/`, `tailwind.config.*`, `package.json`, `next.config.*`. Tell me what exists and what'll conflict.
2. Check if any pages render currently at `/`. If yes, screenshot what's there so we have a "before."
3. Propose a folder structure for new components. Use one of: `components/ui/` (primitives) + `components/marketing/` (sticker stuff) + `components/booking/`. Confirm before scaffolding.

**Ask before proceeding** if any of these are true:
- A different design system already exists (shadcn, Radix, MUI, etc.)
- Tailwind config has substantial custom theme already
- App Router structure deviates from convention (e.g., uses Pages Router)

## 1.2 Install dependencies

```bash
npm install @next/font  # may already be present in Next 14+
npm install clsx tailwind-merge  # for cn() utility
npm install lucide-react  # icons (optional but recommended)
npm install react-day-picker date-fns  # for booking flow date picker, install now
npm install react-hook-form @hookform/resolvers zod  # forms
```

Skip any already in package.json.

## 1.3 Fonts (next/font)

In `app/layout.tsx`:

```tsx
import { Bungee, Bebas_Neue } from 'next/font/google';

const bungee = Bungee({ weight: '400', subsets: ['latin'], variable: '--font-bungee', display: 'swap' });
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas', display: 'swap' });

// Apply both to <html> as className={`${bungee.variable} ${bebas.variable}`}
// Body uses Arial system stack
```

## 1.4 Tailwind tokens (tailwind.config.ts)

Extend theme with the locked brand kit. Use CSS variables for fonts so next/font integrates cleanly.

```ts
theme: {
  extend: {
    colors: {
      // Brand
      hyperpurple: { DEFAULT: '#7B2FFF', 90: '#8A47FF', 75: '#A876FF', 50: '#BDA0FF', 25: '#DECCFF', 5: '#F4EDFF' },
      'slap-pink':  { DEFAULT: '#FF1B8D', 75: '#FF5BAA', 50: '#FF8BC4', 25: '#FFC5E2' },
      acid:         { DEFAULT: '#CCFF00', 90: '#D2FF1A', 75: '#DBFF5B', dark: '#99CC00' },
      plasma:       { DEFAULT: '#00D0FF' },
      solar:        { DEFAULT: '#FF6B00' },
      sterling:     { DEFAULT: '#DEDED9', warm: '#FAFAF8' },
      pitch:        { DEFAULT: '#0A0A0A', soft: '#2A2A2A' },
      // Alerts
      success: { DEFAULT: '#1FC156', bg: '#E4F8EC' },
      info:    { DEFAULT: '#3266FF', bg: '#E5EBFF' },
      warning: { DEFAULT: '#F5B339', bg: '#FDF1DC' },
      danger:  { DEFAULT: '#FF0000', bg: '#FFE5E5' },
    },
    fontFamily: {
      display: ['var(--font-bungee)', 'Impact', 'sans-serif'],
      utility: ['var(--font-bebas)', 'Impact', 'Arial Narrow Bold', 'sans-serif'],
      body:    ['Arial', 'Helvetica Neue', 'sans-serif'],
    },
    fontSize: {
      h1: ['96px', { lineHeight: '1' }],
      h2: ['64px', { lineHeight: '1' }],
      h3: ['48px', { lineHeight: '1.1' }],
      h4: ['40px', { lineHeight: '1.1' }],
      h5: ['32px', { lineHeight: '1.2' }],
      h6: ['24px', { lineHeight: '1.2' }],
      subh: ['18px', { lineHeight: '1.4' }],
      body: ['16px', { lineHeight: '1.5' }],
      subtitle: ['14px', { lineHeight: '1.5' }],
      caption: ['12px', { lineHeight: '1.4' }],
    },
    borderRadius: {
      xsm: '4px', sm: '12px', md: '16px', lg: '24px', xl: '70px', pill: '999px',
    },
    boxShadow: {
      xsm: '0 1px 2px rgba(10,10,10,0.04)',
      sm:  '0 2px 4px rgba(10,10,10,0.06)',
      md:  '0 4px 12px rgba(10,10,10,0.08)',
      lg:  '0 8px 24px rgba(10,10,10,0.12)',
      xl:  '0 16px 48px rgba(10,10,10,0.16)',
      pop: '6px 6px 0 #0A0A0A',
      'pop-lg': '10px 10px 0 #0A0A0A',
    },
  },
},
```

## 1.5 Utilities

Create `lib/cn.ts`:

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 1.6 Logo component

`components/ui/Logo.tsx`:

```tsx
import Image from 'next/image';
import { cn } from '@/lib/cn';

type LogoProps = { size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'hero'; className?: string };
const sizes = { xxs: 90, xs: 120, sm: 180, md: 320, lg: 480, hero: 720 };

export function Logo({ size = 'md', className }: LogoProps) {
  const width = sizes[size];
  return (
    <Image
      src="/duffleup-logo.svg"
      alt="duffleup"
      width={width}
      height={Math.round(width * 0.42)}  // SVG aspect ratio 1024:768 ≈ 0.42 after cropping
      priority={size === 'hero'}
      className={cn('block', className)}
    />
  );
}
```

## 1.7 Components to build (Phase 1 scope)

Build each as a typed React component with named exports. **Server components by default.** Mark `'use client'` only when interactivity requires it (Button onClick, Input onChange, etc.).

For every component: take a `className` prop and merge via `cn()`. Take other relevant variant/state props as a discriminated union.

| Component | File | Variants | Notes |
|-----------|------|----------|-------|
| `Button` | `components/ui/Button.tsx` | primary / secondary / secondary-dark / ghost / destructive; sizes sm/md/lg; disabled state | Use `forwardRef`, support `asChild` pattern (radix-style) for Link wrapping |
| `Input` | `components/ui/Input.tsx` | states: default / hover / focus / validating / success / error / disabled | `forwardRef`, accepts label + helper text |
| `Alert` | `components/ui/Alert.tsx` | success / info / warning / danger | Dismissable, title + body, icon |
| `Badge` | `components/ui/Badge.tsx` | tier: standard / certified / select | Pill shape, star for SELECT |
| `Chip` | `components/ui/Chip.tsx` | mood: chill / romance / adventure / reset / bash / pets | Colored per mood |
| `Avatar` | `components/ui/Avatar.tsx` | sizes 96/72/56/48/32/24; states empty/initial/active/inactive | Plus `AvatarStack` subcomponent |
| `PropertyCard` | `components/marketing/PropertyCard.tsx` | tier badge, photo placeholder, name, area, chips, price | Photo gradient placeholder; heart icon |
| `StickerMoodCard` | `components/marketing/StickerMoodCard.tsx` | 6 moods, rotated, pop shadow | Sticker tag optional |
| `SocialCard` | `components/marketing/SocialCard.tsx` | 1:1 aspect, quote + attribution | 3 color variants |
| `SiteNav` | `components/marketing/SiteNav.tsx` | Logo left, links center, CTAs right; mobile menu | Sticky on scroll |
| `Footer` | `components/marketing/Footer.tsx` | 4-column grid; brand + columns + legal | Use the locked copy below |
| `EmptyState` | `components/ui/EmptyState.tsx` | Icon + title + body + CTA | Sticker-style icon |

## 1.8 Storybook OR component preview route

Pick one — ask Gaurav which:
- **Storybook:** `npx storybook@latest init`, create stories for each component
- **In-repo preview route:** Create `/app/ds/page.tsx` rendering all components in sections (faster, no extra tooling)

Default to in-repo preview route unless told otherwise. Less ceremony.

## 1.9 Acceptance (Phase 1)

- [ ] All 12 components in the table above exist and render in the preview route
- [ ] Bungee renders on display text, Bebas Neue on utility text, Arial on body
- [ ] Logo renders on white, pitch, acid, and slap-pink backgrounds without artifacts
- [ ] No console errors, no hydration warnings
- [ ] TypeScript strict mode clean (`npm run typecheck` passes)
- [ ] Lint clean (`npm run lint` passes)

## ✅ CHECKPOINT 1

Commit: `feat(ds): SP-14 design system foundation`

**STOP.** Show Gaurav the preview route. Wait for sign-off before Phase 2.

---

# PHASE 2 — Landing page (SP-23b)

## 2.1 Read first

1. Read current `app/page.tsx` (or wherever the root route is). Tell me what's there.
2. If it has an existing email-capture or waitlist component connected to the API, preserve that integration. We are restyling, not breaking functionality.
3. Identify which API endpoints the current landing page hits.

## 2.2 Page structure

Replace root route with sections in this order:

1. **`<SiteNav>`** — sticky, white background
2. **`<Hero>`** — hyperpurple gradient, Logo (md), Bungee tagline "Don't book a room. Book a weekend.", positioning line in Bebas Neue, 2 CTAs ("Pack my duffle" + "Got a place?"), sticker decorations rotated absolutely positioned
3. **`<MoodDiscovery>`** — 6 sticker mood cards, "Pick your mood" eyebrow
4. **`<PropertyPreview>`** — 3 property cards (use placeholder/seeded data for now; wire to `/properties?featured=true` if endpoint exists)
5. **`<HowItWorks>`** — 3-step horizontal layout: "Find a place" → "Pack & go" → "Locked in"
6. **`<ForOwners>`** — CTA section to owner onboarding, "Got a place worth showing?"
7. **`<SocialProof>`** — 3 social cards as a static showcase
8. **`<Footer>`** — locked copy below

## 2.3 Locked copy (do not improvise)

**Hero:**
- Tagline (H1): `Don't book a room. Book a weekend.`
- Positioning (Bebas Neue): `Verified offbeat stays. Honest economics. Maharashtra-first.`
- Primary CTA: `Pack my duffle`
- Secondary CTA: `Got a place?`
- Sticker decorations: `OUT THERE`, `ZERO APOLOGIES`, `2 NIGHTS · 1 DUFFLE`

**Mood discovery cards** (use these copy lines exactly):
- Chill: "Slow mornings. Quiet evenings. The kind of quiet you forgot existed."
- Romance: "For two. For nothing else. Bring the right person." (tag: FOR TWO)
- Adventure: "Wake up where the trail starts. Sleep where the campfire ends."
- Reset: "Disappear without explaining. Come back as someone slightly better." (tag: SOLO OK)
- Bash: "Bring everyone. Plan nothing. The place can handle it."
- Pets: "Bring the whole family. Even the loud ones with four legs." (tag: PETS WELCOME)

CTA on each card: `Take me there →`

**How it works:**
1. **Find a place** — "Browse verified stays. Filter by mood, not stars."
2. **Pack & go** — "Lock it in. Pay once. No bouncing between 14 tabs."
3. **Locked in** — "Pack accordingly. We'll handle the rest."

**For owners:**
- Heading: `Got a place worth showing?`
- Body: `Verified properties only. Honest commissions. You set the rules.`
- CTA: `Tell us about it`

**Footer brand line:**
> Verified stays across Maharashtra. Built by someone who understands the real pain — both sides of the WhatsApp thread.

**Footer tagline:** `Pay. Pack. Go.`

## 2.4 Voice rules (apply throughout)

| ✓ Use | ✗ Avoid |
|-------|---------|
| Pack my duffle | Get early access |
| Got a place? | List your property |
| Get me out there | Reserve |
| Locked in. Pack accordingly. | Booking confirmed! 🎉 |
| Couldn't go through. | Oops! Something went wrong. |
| operator (avoid this word entirely) | — |

## 2.5 Performance

- Hero logo: `priority` prop on Image
- Lazy-load below-fold sections
- All images: next/image with width/height
- Aim Lighthouse Performance > 85, A11y > 90 on mobile

## 2.6 Acceptance (Phase 2)

- [ ] Root route renders all 8 sections
- [ ] All copy exactly matches §2.3 (no AI-generated improvisations)
- [ ] Mobile responsive (test at 375px, 768px, 1280px)
- [ ] Logo renders correctly in hero, nav, footer
- [ ] No console errors, no hydration warnings
- [ ] Existing email-capture/waitlist (if any) still functions
- [ ] `npm run build` succeeds

## ✅ CHECKPOINT 2

Commit: `feat(landing): SP-23b brand kit applied to landing page`

**STOP.** Show Gaurav the live page. Wait for sign-off.

---

# PHASE 3 — Booking flow UI

## 3.1 Routes

| Route | Purpose | Components |
|-------|---------|------------|
| `/properties` | Browse/search | PropertyCard grid + filters |
| `/properties/[slug]` | Property detail | Photo gallery, details, booking widget |
| `/book/[propertyId]` | Booking form | DateRange, GuestCounter, PriceBreakdown, PayCTA |
| `/book/processing` | Payment redirect | Loading state during Razorpay redirect |
| `/book/[bookingId]/confirmed` | Confirmation | "Locked in. Pack accordingly." + details |
| `/bookings` | My bookings | List of guest's bookings (requires auth) |
| `/bookings/[id]` | Booking detail | Status, modification, cancellation |

## 3.2 New components

| Component | File | Notes |
|-----------|------|-------|
| `DateRangePicker` | `components/booking/DateRangePicker.tsx` | Wrap `react-day-picker`, brand styling |
| `GuestCounter` | `components/booking/GuestCounter.tsx` | +/- adults, children, pets |
| `PriceBreakdown` | `components/booking/PriceBreakdown.tsx` | Per-night × nights, fees, GST, total |
| `BookingWidget` | `components/booking/BookingWidget.tsx` | Sticky on property page; combines above |
| `PhotoGallery` | `components/booking/PhotoGallery.tsx` | Hero + thumb grid; lightbox |
| `BookingStatus` | `components/booking/BookingStatus.tsx` | Pill showing PENDING_PAYMENT / CONFIRMED / etc. |
| `BookingTimeline` | `components/booking/BookingTimeline.tsx` | Visual: created → paid → confirmed → past |
| `CancellationModal` | `components/booking/CancellationModal.tsx` | Confirms cancel with policy preview |

## 3.3 API integration

Create `lib/api.ts`:

```ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}
```

**Endpoints used in this phase** (ask Gaurav for the exact contract if unclear — refer to duffleup-api Swagger/OpenAPI if available):

- `GET /api/properties?filter=...` — list
- `GET /api/properties/:slug` — detail
- `POST /api/bookings` — create (returns PENDING_PAYMENT booking + Razorpay order)
- `GET /api/bookings/:id` — detail
- `POST /api/bookings/:id/cancel` — cancel
- `GET /api/bookings/me` — my bookings (auth required)

Use server components + `fetch` with appropriate revalidation. Client components only for interactive widgets (booking form, date picker, modals).

## 3.4 Booking state machine (display logic)

| Backend status | UI label | Color | Action button |
|----------------|----------|-------|---------------|
| PENDING_PAYMENT | "Holding your spot" | warning | "Complete payment" |
| CONFIRMED | "Locked in" | success | "View details" |
| MODIFIED | "Awaiting payment" | warning | "Pay difference" |
| CANCELLED | "Cancelled" | pitch-soft | — |
| COMPLETED | "Past trip" | sterling | "Rate this stay" |
| FLAGGED_CONFLICT | "Needs attention" | danger | "Contact us" |

## 3.5 Razorpay integration

- Use Razorpay's Checkout.js or embed link (Gaurav to specify — ask)
- On payment success: redirect to `/book/[bookingId]/confirmed`
- On failure: redirect back to `/book/[propertyId]` with error toast (Alert component)

## 3.6 Locked copy (booking flow)

- **Booking widget primary CTA:** `Pack my duffle`
- **Pending payment state:** `Holding your spot. Pay to lock it in.`
- **Confirmation page H1:** `Locked in.`
- **Confirmation subhead:** `Pack accordingly. Check your inbox for the details.`
- **Cancellation confirm:** `Sure? Refund follows the policy below.`
- **Empty bookings state title:** `Nowhere booked yet.`
- **Empty bookings body:** `Pick a mood. Pack a duffle. Go.`

## 3.7 Acceptance (Phase 3)

- [ ] All 7 routes render
- [ ] Property detail → booking flow → confirmed walks end-to-end (with mocked API responses if backend not deployed)
- [ ] DateRangePicker disables unavailable dates (when API provides availability)
- [ ] PriceBreakdown calculates correctly (nights × rate + fees + GST)
- [ ] All booking states display correctly per §3.4
- [ ] Razorpay integration loads (even if test mode)
- [ ] Mobile responsive
- [ ] `npm run build` succeeds

## ✅ CHECKPOINT 3

Commit: `feat(booking): instant-book flow UI`

**STOP.** Show Gaurav the full flow. Final sign-off.

---

## Global rules (apply across all phases)

1. **Tailwind only.** No CSS modules, no styled-components, no inline `style={}` except for genuinely dynamic values (e.g., placeholder gradient hues).
2. **Server components by default.** Mark `'use client'` only when needed (interactivity, hooks, browser APIs).
3. **No emoji in UI.** Voice is direct, not cheerful.
4. **No `Math.random()` for IDs.** Use `crypto.randomUUID()` or pass-through from backend.
5. **`next/image` everywhere.** No raw `<img>` tags except the logo (already handled via Logo component).
6. **Accessibility:** focus rings (use `focus-visible:ring-acid`), ARIA labels on icon-only buttons, keyboard nav on modals and date pickers.
7. **Mobile-first.** Design at 375px first, scale up.
8. **No new dependencies** without asking. List of approved deps is in §1.2.
9. **Conventional commits** at each checkpoint.
10. **Branch:** Create `feat/sp14-design-system` off main. Commit per phase. Don't merge until all phases done.

## Things to ASK Gaurav before deciding

- Storybook vs in-repo preview route (§1.8)
- Form library choice if different from react-hook-form (§1.2)
- Razorpay integration method — Checkout.js vs embed link (§3.5)
- Auth strategy for `/bookings` and `/bookings/[id]` (NextAuth? Custom? API token via cookie?)
- Whether to seed placeholder property data for Phase 2 or wire live API
- Anything in v0.4 HTML that doesn't map cleanly to the current repo structure

## Definition of Done (entire prompt)

- [ ] All 3 phases shipped and reviewed
- [ ] All components from §1.7 + §3.2 exist, documented, and used somewhere
- [ ] Landing page live at `/`
- [ ] Booking flow walkable end-to-end on `/properties/[slug]` → confirmation
- [ ] `npm run build` clean, `npm run typecheck` clean, `npm run lint` clean
- [ ] No console errors in dev or production build
- [ ] Logo renders correctly on every surface it appears
- [ ] Voice/copy matches §2.3 + §3.6 verbatim
- [ ] Lighthouse on `/`: Performance > 85, A11y > 90 (mobile)
- [ ] Mobile responsive at 375 / 768 / 1280
- [ ] Branch `feat/sp14-design-system` ready for PR

---

**Start with §1.1.** Read the repo, tell me what's there, propose the folder structure. Don't write code yet.
