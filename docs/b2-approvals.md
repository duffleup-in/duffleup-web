# SP-F1 B.2 — Approvals + Adjudications

## All findings approved

### Finding 1 — displayName + moods derived from units
**Approved.**

- Use `displayName` as the visible name field throughout
  (this is the referential-name field — great find)
- Moods derived from `units[].moods` union at query time
- Do NOT show property-level moods column (Phase-2.5.1
  removed it deliberately)

### Finding 2 — Zero prod data — mock preview approach
**Approved.**

- Unit tests against mock PublicProperty data
- Uncommitted preview route with mock data for visual review
- Take screenshot, delete preview route before pushing
- Committed `/properties` renders skeleton + empty grid on
  real prod
- Real property seeding is Gaurav's ops track (Waterrock +
  founding partners), not a code sprint blocker

### Finding 3 — MoodChip as new component
**Approved.**

Build MoodChip ~30 lines with sticker treatment:
- Reuse existing mood→color mapping (chill→plasma,
  romance→slap-pink, adventure→solar, reset→hyperpurple,
  bash→acid, pets→pets)
- Black border + shadow-pop
- Compact ~24px height
- Do NOT reuse existing Chip component (misses sticker
  treatment)

### Finding 4 — Home PropertyCard lineage clear
**Approved.**

- Build fresh in `components/property/PropertyCard.tsx`
- Path distinction from `components/marketing/PropertyCard.tsx`
  is fine
- Bare-name overlap acceptable via import context

### Finding 5 — Photos capped at 5 + gradient placeholder
**Approved.**

- Carousel max 5 photos
- Zero-photo case: gradient placeholder tile (reuse home
  card idiom)

## All adjudications approved

### Guests mapping
Correct B.1's bug: guests = `adults + children` (infants
free per Phase A ruling). Update the mapper and its test.

### Naming
Reuse B.1's shipped names (`getProperties`,
`PublicProperty`) — no rename churn. Ignore the brief's
illustrative `searchProperties` / `SearchResultProperty`.

### Carousel implementation
- Plain React state (useState index)
- Prev/next buttons (hover-reveal on desktop)
- touchstart/touchend swipe on mobile
- Index dots when > 1 photo
- No new deps

### Card link + navigation
- Wrap card in `next/link` to `/properties/${slug}`
- Carousel arrows `stopPropagation` so they don't trigger
  card navigation

### Backlog entries
Add the six entries from the brief. Also add this seventh
one:

```
- Duplicate PropertyCard component name: 
  components/marketing/PropertyCard.tsx (home preview) and 
  components/property/PropertyCard.tsx (search results grid) 
  share bare component name via different paths. Import 
  context disambiguates but a future refactor should rename 
  one to remove the overlap. Post-V1.
```

## Execute

Proceed with execution per the brief. Push branch and HOLD
for Gaurav's visual review.

Commit strategy: one commit for the sprint, OR one commit
per logical grouping (components / page / tests / backlog).
CC picks.

## Non-negotiables reminder

- Do NOT modify backend
- Do NOT install new deps
- Do NOT ship without skeleton loading state
- Filter no-price properties defensively
- Report deviations, don't fabricate

## Report

- Commit hash(es)
- Files created/modified
- Mock preview screenshot (if you can attach or describe)
- Backlog entries added
- Any surprise
