# SP-F1 B.2 — PropertyCard + List Render

## Context

B.1 shipped debug scaffold on `/properties` and cleanly-typed
API client for `/api/v1/search`. B.2 replaces the debug output
with a real PropertyCard component and grid render.

**Not in B.2 scope** (goes to B.3, B.4):
- Filter modification UX (edit dates/guests inline)
- URL sync on filter changes
- Sort controls (backend already sorts, no UI needed yet)
- Pagination controls
- Empty state polish (deferred — seed data covers this)
- Advanced error states

## Design decisions locked

### 1. Visual language
Hybrid: editorial base + sticker accent
- Photo dominates the card (editorial)
- Mood tags render as sticker chips (brand continuity from home)
- Card itself is clean, minimal chrome, restrained

### 2. Grid layout
- Desktop (≥ 768px): 2 columns
- Mobile (< 768px): 1 column stack
- Consistent gap: 24px (matching moodboard spacing)
- No 3-column dense layout (avoid OTA aesthetic)

### 3. Photo handling
- Photo carousel per card
- Desktop: arrows appear on hover
- Mobile: swipe gesture (touchstart/touchend, or use existing
  library if simpler)
- Show current photo index dots at bottom if more than 1 photo

### 4. Card data displayed
- Photo carousel (up to 5 photos per card)
- Property name (referential-name spec deferred — use whatever
  search API returns in `name` field)
- Location string
- All moods this property supports (rendered as sticker chips)
- Price: `Starts at ₹X` when priceFrom is set
- **No tier badge in B.2** (backlog for future)

### 5. Properties with no priceFrom
- Card hidden entirely (don't render)
- Backend already filters most cases per B.1 audit; this is
  defense in depth

### 6. Loading state
- Skeleton cards match final layout
- Show 4 skeleton cards on desktop, 2 on mobile
- Skeleton has: gray photo area, gray name bar, gray location
  bar, gray mood chip placeholders
- Skeleton visible during initial load and refetch

### 7. No result count display
- Grid renders directly, no "N stays" header
- Grid itself communicates count

### 8. Guest count mapping (from Phase A rulings)
- Backend accepts single `guests` int
- Frontend sends `guests = adults + children` (infants free
  per hospitality convention)
- Already implemented in `build-search-url.ts` from Phase A

## Non-negotiables

- Do NOT modify backend API — consume `/api/v1/search` as-is
- Do NOT alter B.1's scaffolding beyond replacing debug page
  content
- Do NOT install new deps beyond what's in package.json
- Do NOT ship without loading skeleton
- Do NOT render cards where priceFrom is null (defensive filter)
- If backend returns unexpected shape, HALT and report
- Scope frozen — new ideas → `docs/duffleup-backlog.md`

## Prerequisite check

1. On `main`, working tree clean apart from expected untracked
   docs
2. `main` at latest merge (verify with `git log`)
3. `npm run lint && npm run typecheck && npm run test && npm run build`
   all pass
4. Backend `/api/v1/search?mood=CHILL` returns 200 with expected
   envelope
5. StickerMoodCard location confirmed in `src/components/`

If any fails, STOP and report.

## Do

### 1. Cut branch `feat/properties-card-list` off `main`

### 2. Audit and report BEFORE building

Report before writing any UI code:
- Confirm `/api/v1/search` response envelope shape and property
  fields available (name, location, photos, moods, priceFrom,
  slug)
- Check for `displayName` field (referential name) — if absent,
  use `name`
- Confirm StickerMoodCard component API and whether it's the
  right component to reuse for the mood chip rendering, or if
  a new smaller `MoodChip` component is needed
- Read home page property cards (Gaurav mentioned two exist)
  and report their visual pattern for lineage
- Confirm search results include photo URLs and how many photos
  per property (needed for carousel)

Gaurav reviews audit briefly, then proceeds.

### 3. Execute

**Files to create:**

**`src/components/property/PropertyCard.tsx`** (new)
- Client Component (needs interactivity for photo carousel)
- Props: `property: SearchResultProperty`
- Renders: photo carousel + name + location + mood chips +
  price
- Uses existing StickerMoodCard visual language for chips OR
  new smaller MoodChip component
- Photo carousel: arrows on hover (desktop), swipe (mobile)
- Photo index dots below photo (if > 1 photo)
- Link the card to `/properties/${property.slug}` for detail
  page (Phase C target)
- Hide entire card if `priceFrom` is null

**`src/components/property/MoodChip.tsx`** (new, if needed)
- Smaller version of StickerMoodCard for use as chips within
  PropertyCard
- Colored background per mood key (Hyperpurple for CHILL, etc.
  — use existing MOOD_COLORS mapping)
- Sticker treatment: black border, small drop shadow
- Compact size: ~24px height, 12px padding
- Text: mood key display label (CHILL, ROMANCE, etc.)

**`src/components/property/PropertyGrid.tsx`** (new)
- Wrapper component that renders the responsive grid
- Props: `properties: SearchResultProperty[]`, `isLoading: boolean`
- Loading state: render 4 PropertyCardSkeleton components on
  desktop, 2 on mobile
- Otherwise: render PropertyCard for each property
- Filter out null-price properties before mapping

**`src/components/property/PropertyCardSkeleton.tsx`** (new)
- Matches PropertyCard final layout dimensions
- Gray placeholder blocks for: photo area, name bar, location
  bar, mood chips
- Simple opacity-based pulse animation (Tailwind
  animate-pulse)

**Files to modify:**

**`src/app/(marketing)/properties/page.tsx`** (existing debug
  page from B.1)
- Server Component
- Reads URL params (mood, sub, checkin, checkout, adults,
  children, infants)
- Calls `searchProperties(params)` server-side
- Passes result to Client Component wrapper
- Show skeleton if searchProperties returns pending or errors

**`src/app/(marketing)/properties/PropertiesResults.tsx`** (new
  Client Component)
- Receives initial data from Server Component
- Renders PropertyGrid
- Handles error state (basic — just a "Something went wrong"
  message for B.2, richer treatment in B.4)

### 4. Verify

- `npm run lint` clean
- `npm run typecheck` clean
- `npm run test` — all existing tests pass, new tests for
  PropertyCard rendering + PropertyGrid loading state
- `npm run build` succeeds
- Manual test flow:
  1. Complete intent collector: mood → sub → dates → guests
  2. Submit routes to `/properties?mood=CHILL&sub=solo&...`
  3. Verify: grid renders with 2-col desktop / 1-col mobile
  4. Photo carousel works (arrows on hover desktop, swipe
     mobile)
  5. All moods per property display as sticker chips
  6. "Starts at ₹X" shows for priced properties
  7. No-price properties hidden
  8. Skeleton cards appear during load
  9. Click PropertyCard → routes to `/properties/${slug}` (404
     is expected until Phase C, that's fine)

### 5. Push branch and report

Report:
- Commit hash
- CI status
- Files created/modified
- Any deviation
- Photo carousel implementation approach
- MoodChip component API
- Any surprise on `displayName` vs `name` handling
- Property count in results and confirmation the render logic
  is correct

**Commit:** `feat(properties): PropertyCard + grid render on /properties`

Push. HOLD for visual review + merge authorization.

## Escalate before doing

- Search API doesn't return photo URLs in a usable format —
  propose approach
- StickerMoodCard doesn't work as chip and MoodChip refactor
  is bigger than expected — propose approach
- Response envelope has changed shape since B.1 audit — report
- More than 5 photos per property — decide carousel behavior
  (max? show all?)
- Empty result set from live prod (few or no properties seeded
  yet) — report; test with a broader mood filter or use test
  data

## Visual review (Gaurav will run)

```
cd C:\Code\duffleup\duffleup-web
git fetch
git checkout feat/properties-card-list
git pull
npm install
npm run test
npm run dev
```

**Desktop test flow:**
1. Home → click "PACK MY DUFFLE" → complete intent flow
2. Land on `/properties?mood=CHILL&sub=solo&...`
3. Verify 2-column grid renders
4. Skeleton cards appear briefly then get replaced with real
   properties
5. PropertyCard shows: photo carousel + name + location +
   mood chips + "Starts at ₹X"
6. Hover reveals photo carousel arrows
7. Click arrows: photo advances
8. All moods for a property display as sticker chips
9. Click card: navigates to `/properties/${slug}` (404 is
   expected)

**Mobile test flow (F12 → 375px):**
1. Same flow but 1-column stack
2. Swipe photo carousel
3. Cards readable, chips readable

**Also verify:**
- Skip flow: `/properties?mood=CHILL` (no sub, dates, guests)
  still renders results
- Very narrow search (mood=PETS+sub=multi-pet) may return few
  results; verify no visual break
- Try `/properties?mood=CHILL&sub=solo&checkin=2026-08-05&checkout=2026-08-08&adults=2&children=0&infants=0`
  as full URL — should work

If clean, merge:
```
git checkout main
git pull origin main
git merge --no-ff feat/properties-card-list -m "Merge SP-F1 B.2: PropertyCard + grid render"
git push origin main
git push origin --delete feat/properties-card-list
git branch -d feat/properties-card-list
```

## After merge

Vercel deploys ~3 min. Verify live:
- Home → intent flow → `/properties?...` shows real cards
- Photo carousel works
- Cards route to detail (404 expected until Phase C)
- No console errors

Then HOLD for B.3 adjudications (filters + URL sync).

## Backlog additions

Add to `docs/duffleup-backlog.md`:

```
- Property naming — referential vs exact: property card + search 
  results should show REFERENCE names (like Airbnb: "Charming 3BR 
  Villa near Panchgani" vs the actual name "Villa Rosa"). Prevents 
  guests from Googling the property and bypassing Duffleup for 
  direct bookings. This affects: PropertyCard render, PropertyDetail 
  H1, search results, owner dashboard wizard name field intent, and 
  possibly a new "displayName" backend field distinct from 
  "internalName". Real product decision confirmed but needs full 
  spec: what algorithm generates display name from property 
  attributes, is it owner-authored, is it hidden until booking 
  confirmed. Owner-facing name (in dashboard, in tier progression 
  records) stays real. Guest-facing name is referential. Backend 
  spec required. Post-V1 spec sprint likely.

- Tier badge on PropertyCard — future rollout: B.2 ships with tier 
  hidden on card. Move to Option 3 later: show tier badge for REAL 
  and RARE only (skip RAW to avoid new-property stigma). Rollout 
  timing: after tier promotion mechanics (30/30/30/10 with Good/Bad/
  Ugly review system) is live, which is post-V1. When enabled, 
  badge visual language should match tier tenure signal.

- Empty state design for /properties: B.2 ships without empty-state 
  polish (assumes seeded properties cover all moods at launch). If 
  results genuinely empty for a mood/sub combination, ship a 
  brand-voice fallback like "We're picking fifty. Not everyone makes 
  the cut." — needs proper design + copy adjudication. Backlog until 
  post-launch data reveals real empty-state frequency.

- Mobile app Tinder-style card UI: mobile app (Foundation Day+ 
  scope, ~6 months out) will use a Tinder-style swipe deck for 
  property discovery. This has design implications for the 
  PropertyCard: single-card focus, swipe left/right for like/pass, 
  full-screen photo dominance. Web PropertyCard design should keep 
  mental continuity where possible: photos-first, single-card 
  scanability. Log for design consistency planning when mobile app 
  sprint begins.

- Sort controls for /properties: backend already sorts by tier 
  relevance + sub context. UI sort controls (price, tier, distance) 
  come in B.3+ or post-V1 based on user behavior.

- Result count display: B.2 hides count. If user testing shows 
  people miss it, add "N stays" header. Post-launch UX decision.
```

## Standing rules

- Scope frozen. New ideas → `docs/duffleup-backlog.md`.
- No PR opened; Gaurav directs merges.
- Report at every unexpected finding.
- CI must be green before merge.
