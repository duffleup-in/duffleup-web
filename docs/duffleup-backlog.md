# duffleup-web Backlog

## Open items

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
