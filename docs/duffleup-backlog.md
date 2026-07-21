# duffleup-web Backlog

## Foundation Day scope freeze (2026-07-16)

Scope frozen for V1 targeting Foundation Day 2026-11-05. New
scope surfaced between now and Foundation Day lands in
`post-foundation-day-backlog.md` unless traded off against
existing planned work.

## Open items

- Dev server stale-cache pattern (FIFTH occurrence,
  2026-07-19): pattern conclusively documented as triggered by
  route additions (new route group segments) and first-time
  client dep imports (Radix Dialog imported for the first time
  in SP-F1 A.1). Add to project README or onboarding note:
  any new route + new client dep = `rm -rf .next && npm run dev`
  after the change lands. Consider adding to a git pre-merge
  check or documenting more prominently. Earlier occurrences:
  F0.A build, F0.A typecheck, F0.B visual review (compiled CSS
  404s, pages render unstyled); fix has always been stop dev
  server, rm -rf .next, restart.

- MoodKey vs Mood type naming: the API client's mood enum is named
  MoodKey (uppercase union 'CHILL' | 'ROMANCE' | ...) in
  src/lib/api/types/mood-config.ts to mirror the backend Prisma
  enum, deliberately distinct from the existing lowercase UI Mood
  type in components/ui/Chip ('chill' | 'romance' | ...). When
  SP-F1 wires live mood-config data into UI components, it needs a
  case-normalization/mapping layer at the boundary (MoodKey →
  Mood). Log so SP-F1 handles the conversion rather than leaking
  uppercase enums into component props.

- API base URL convention audit: F0.B kept the existing convention
  where NEXT_PUBLIC_API_URL includes the /api/v1 base and callers
  pass resource-relative paths (/mood-config, /early-access),
  deviating from the F0.B brief's host-only base + /api/v1-in-path
  design. This was required to avoid breaking the working
  EarlyAccessForm. Before SP-F1 phase A, audit all API base-URL
  usage and decide whether to standardize permanently on "base
  includes /api/v1" (document it) or migrate to host-only base +
  versioned paths (and update every caller + .env in one sweep).

- Admin-editable marketing copy across /about, /how-it-works,
  /list-your-property: page-content management via admin panel.
  Scope: backend schema (Page → Section → Field entities),
  admin API endpoints, frontend refactor to fetch copy from
  API instead of hardcoded strings, admin UI for editing,
  format decisions (markdown / rich text / plain). Timing:
  post-V1 launch, part of admin panel workstream. Rationale:
  copy must be changeable without a code deployment per
  Gaurav's flagged requirement.

- Editable commission percentage: 7% currently hardcoded in
  copy strings across the site AND in backend booking
  calculations. Should be a single source of truth read from
  backend platform-config, injected into copy at page render
  and used by booking math server-side. Requires:
  platform-config API endpoint, frontend fetch on marketing
  pages that reference the rate, backend booking calculation
  to consume the same source. Timing: pre-V2 or when
  commission model changes are anticipated.

- Geography expansion positioning: Duffleup accepts leads
  India-wide (form does not gate on location). Manual
  onboarder handles "currently focused on Maharashtra"
  conversation at call stage. Marketing copy reflects the
  Maharashtra-focus-with-India-expansion positioning rather
  than Maharashtra-only.

- OTP phone verification on /list-your-property intake form:
  phone field is required but currently unverified. Bad-faith
  submissions filtered at manual-call gate stage. Future
  integration: SMS OTP provider (MSG91 / Twilio / TextLocal),
  backend endpoints (send-otp, verify-otp), rate limiting,
  retry logic, frontend UX for OTP entry. Timing: post-launch,
  dedicated sprint. Estimated 4-6 hrs work plus provider
  account setup.

- Retroactive /about "4 years" restoration consideration:
  Phase A over-swept by removing "four years" from /about
  founder narrative. COI vector was Waterrock + Bhor + timespan
  combined; removing property name and location alone closes
  the loop. Restoring "4 years" is safe. Not urgent enough to
  trigger a new sprint alone; fold into any future /about edit
  or admin-CMS migration.

- Owner intake form field expansion (backend DTO work required):
  Phase C shipped form with five fields the backend accepts today
  (Name→firstName, Email, Phone, Place→propertyLocation, Property
  type). Two additional fields specced in the Phase C directive
  were dropped because backend returns 400: propertyName and
  capacity. Add these to backend early-access DTO + Prisma columns
  + migration in a dedicated small backend sprint. Frontend form
  additions once backend accepts. Manual onboarder captures these
  two fields on the call in the meantime.

- Future RARE tier copy candidates (post ~1 year in operation
  with real data + established award/revocation mechanism):

  Option C: "The top 5% of properties on Duffleup. Not for sale.
  Not for influence. Awarded, defended, sometimes lost. Rare
  stays rare."

  Option D: "The top 5%. Never for sale. Never for influence.
  Earned month over month, held only by staying great, moved
  when something better shows up."

  Mechanic to reflect: RARE is dynamic. Hard to earn, easy to
  lose. Awarded to the top 5% only, and that 5% keeps moving.
  Non-compliance revokes. Not a lifetime achievement, more like
  the Oscars.

  When RARE promotions and revocations start happening with real
  properties and audit trail, revisit and adopt whichever
  version fits the actual operational mechanic.

- Tier promotion criteria (manual V1, admin-panel V2):
  RAW → REAL promotion requires N completed bookings (define N),
  <5% negative feedback ratio, minimum vintage on platform
  (define months), evaluation across dimensions (tech, linen,
  food, ambience, amenities, hospitality). RARE promotion:
  reserved for top 5% by absolute count of properties on the
  platform, non-purchaseable, non-influenceable. Documented
  promotion criteria + audit trail required per property. V1
  workflow is manual via admin. V2 (post-launch) may add
  automated criteria surfacing but promotion decision stays
  human-in-the-loop even at V2.

- owner-cta-propagation sprint (2026-07-15) stood down without
  code changes. Diagnostic confirmed burger menu already contains
  GOT A PLACE? owner CTA (visible in mobile scroll-triggered
  overlay). Footer has no CTA today; adding one deferred as an
  open design question — no clear need before launch.
  /list-your-property "SECURE YOUR SLOT" in-page anchor +
  surrounding "First 25 properties" invented-claims copy will be
  rebuilt during B3 Phase C along with the rest of that page.

- "Filter" word usage reconciliation: home page (SocialProof.tsx:7
  and metadata.description) uses "Filter by mood, not stars" which
  is on the banned copy list. Left alone in B3 to preserve
  locked home reference. Reconcile in a future small copy pass
  across all pages: either lift the ban to allow "filter" (with
  a clear rationale) or migrate home's usage to a permitted
  synonym.

- Home page /properties 404: Hero.tsx:33 "Pack my duffle" CTA
  links to /properties which doesn't exist. Route is planned
  for SP-F1. Until SP-F1 ships, this is a 404 on home's
  primary hero button. Fix as part of SP-F1 rollout.

- README.md:24 stale reference: still lists "/contact — Contact
  form" post-B2 (contact route removed 2026-07-14). Update in
  next docs pass, non-urgent.

- API client type generation: currently hand-authored types
  in src/lib/api/types/ mirror backend DTOs manually. Log the
  future migration to auto-generated types via OpenAPI codegen
  or Zodios once backend NestJS Swagger emission is verified
  complete. Timing: post-launch, small integration sprint.

- API client auth extension: apiFetch and apiMutate accept an
  optional authToken parameter which SP-F1 phase E will
  populate for authenticated booking endpoints. Auth token
  management (storage, refresh, expiry) designed as part of
  SP-F1 phase E.

- Home page title double-branding: renders "Duffleup — Don't book
  a room. Book a weekend. | Duffleup" because home sets a string
  title and root template appends "| Duffleup". Fix: either change
  home's title to not include "Duffleup —" prefix, OR restructure
  root metadata template. Cosmetic bug, pre-dates F0.A, log for
  opportunistic fix (small commit next time metadata gets touched).

- Test coverage expansion: F0.C+D shipped Vitest + RTL setup
  with two example tests (formatPrice utility, Badge
  component). Expand coverage progressively as SP-F1 phases
  ship — target testing all shared components, all utility
  functions, and critical booking flow logic. Not a dedicated
  sprint; add tests alongside feature commits.

- Playwright / E2E test setup: F0.C+D scope was unit +
  component tests only. E2E testing (full booking flow across
  routes) is post-launch backlog. Consider Playwright when
  booking flow stabilizes.

- Vercel PR previews + CI status checks: connect GitHub
  Actions CI status to Vercel deployment previews so failed
  CI blocks merging PRs. Currently CI runs but doesn't gate.
  Post-launch hardening.

- npm audit vulnerabilities from F0.C+D test tooling: 8
  vulnerabilities (2 moderate, 6 high) reported after
  installing Vitest + RTL deps. All from transitive test
  dependencies, not runtime code. Do NOT auto-fix — could
  pull breaking changes. Post-launch: run npm audit review,
  adopt targeted fixes with test verification, or wait for
  upstream deps to update. Not a security issue since these
  are dev deps only.

## Codebase rules

- Tailwind cn() ordering rule: inside cn() calls, always place
  leading-* (line-height) AFTER any text-* size class.
  tailwind-merge treats font-size classes as overriding
  line-height when the project's fontSize tokens carry
  line-heights (as this project's do — h1: [96px,
  {lineHeight: '1'}], etc.). Leading placed before a size class
  silently vanishes. No build-time or lint-time error catches
  this — only DOM inspection does. See StickerMoodCard.tsx for
  the reference pattern and inline comment.


- Sub-context tile copy enrichment: backend MoodContext currently
  exposes only `guestLabel` (single phrase per tile). A.2 ships
  label-only tiles per Decision 5 (use backend as-is). Consider
  adding an optional `description` field to MoodContext for
  richer secondary copy per tile (e.g., "Solo escape" +
  "The pace is yours"). Currently RESET/PETS have single-word
  labels which feel thin. Timing: post-launch, small backend
  sprint if we want the two-tier hierarchy.

- A.3 guest counter prefill: `defaultGuests` lives on
  moodContexts[] (per sub-context), not on moodProfiles[] —
  corrected during A.2 execution against the live API. It is
  populated on all three ROMANCE contexts (2), two of three
  CHILL (solo 1, couple 2), and two of three RESET (body 1,
  mind 1); every ADVENTURE / BASH / PETS context is null.
  A.3 should prefill the guest counter from the *selected
  sub-context*, falling back to adults=1 per A.1's initial
  state when null.