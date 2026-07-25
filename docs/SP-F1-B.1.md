# SP-F1 B.1 — Backend Audit + Basic Scaffolding

## Context

Phase A of SP-F1 is complete. Intent collector submits to
`/properties?mood=X&sub=Y&checkin=...&checkout=...&adults=N&children=M&infants=I`
which currently 404s.

Phase B builds the search results page. Before writing any UI
code, we need to understand backend state. This sprint is
almost entirely audit + minimal scaffolding — the goal is
returning enough information for Gaurav to adjudicate B.2, B.3,
B.4 with real context.

**Phase B breakdown for context (not part of B.1 scope):**
- B.1 (this sprint) — Audit + basic scaffolding
- B.2 — PropertyCard component + list render
- B.3 — Filter controls + URL sync
- B.4 — Empty states + polish

## Non-negotiables

- **Audit is the primary deliverable.** Do not write PropertyCard
  or any UI beyond the minimal scaffold.
- Do NOT modify backend API endpoints in this sprint.
- Do NOT seed property data in this sprint.
- If backend endpoints don't exist, report that finding — don't
  build them unprompted.
- Scaffolding is intentionally minimal — no styling, no data
  fetching UX polish, just prove the route + basic data flow work.
- Scope frozen — new ideas → `docs/post-foundation-day-backlog.md`.

## Prerequisite check

1. On `main`, working tree clean apart from expected untracked
   docs
2. `main` at A.3 merge HEAD or later (verify with `git log`)
3. `npm run lint && npm run typecheck && npm run test && npm run build`
   all pass
4. Backend accessible at `NEXT_PUBLIC_API_URL`

If any fails, STOP and report.

## Do

### 1. Cut branch `feat/properties-audit-scaffold` off `main`

### 2. Backend audit (primary deliverable)

**Report findings on ALL of these before writing any code:**

**Property model:**
- Location of Prisma schema for Property entity (share file path)
- All fields on Property model (verbatim, including types and 
  nullability)
- Related entities (PropertyMood, PropertyPhoto, PropertyOwner, etc.)
- Enums used (Mood, Tier, ContextTag, etc.)

**Property endpoint(s):**
- Does `/api/v1/properties` (GET) exist?
- If yes: what query params does it accept? What does it return?
- What's the response shape? DTO type location?
- What filters are already supported? (mood, sub, tier, price, 
  capacity, etc.)
- Is there pagination? Cursor-based or offset?
- Sort options supported?
- Any auth/permission checks on the endpoint?
- If endpoint doesn't exist, is there any code preparing for it?

**Property detail endpoint:**
- Does `/api/v1/properties/:id` (or slug) exist?
- What's the response shape?
- If not, note as B.2/C dependency

**Pricing model:**
- Is pricing on the Property model itself, or a separate 
  Pricing/Rate entity?
- Base rate field name and type
- Any seasonal/dynamic pricing structure?
- Currency handling
- How would "From ₹X" be computed for search results?

**Availability model:**
- Is there a Booking entity? Availability calendar? Nothing yet?
- If Booking exists, what's the shape?
- How is date-range availability calculated in the current code 
  (if at all)?
- If nothing exists, what would filtering by dates require in 
  B.2/B.3?

**Property seed data:**
- What properties currently exist in the database?
- Is Waterrock seeded?
- Any other test properties?
- Count and sample of what's queryable right now

**Mood/context relationship on properties:**
- How is a property's mood assigned? Single mood? Multiple?
- How are sub-contexts (tagKeys like `chill.solo`, `chill.couple`) 
  linked to properties?
- Are there properties with no mood assigned?

**Photos:**
- How are property photos stored? (URLs in DB? Uploaded to S3/
  Vercel Blob/Cloudinary?)
- Is there a primary photo indicator?
- Are photos required, or can a property have zero photos?

### 3. Frontend audit

**API client:**
- Location of api client for properties
  (should follow `src/lib/api/` pattern from F0.B)
- If no property client exists yet, what would need to be added
  following the existing pattern?

**Route existence:**
- What's currently rendered at `/properties`?
  (Expected: 404 — confirm)
- Is there any `src/app/(marketing)/properties/` or similar folder?
- Any leftover code from earlier attempts?

**Type contracts:**
- If `MoodConfigResponse` is in `src/lib/api/types/mood-config.ts`,
  what parallel file exists for Property types?
- If none, is there a pattern established for how new type files
  should be created?

### 4. Minimal scaffolding (build this after audit)

Once audit is reported, build the minimum viable route:

**File: `src/app/(marketing)/properties/page.tsx`** (Server Component)
- Reads URL search params: mood, sub, checkin, checkout, adults, 
  children, infants
- Displays parsed params as JSON debug output (this is 
  intentional — real UI in B.2)
- If backend endpoint exists: fetches property list with those 
  params, displays raw count + first 3 property names as debug
- If backend endpoint doesn't exist: displays "Endpoint not yet 
  available. B.2 depends on backend endpoint creation."
- Zero styling. Zero polish. Debug page.

**File: `src/lib/api/properties.ts`** (only if endpoint exists)
- Follows F0.B API client pattern
- Function `getProperties(params: PropertySearchParams): Promise<PropertyListResponse>`
- Uses `apiFetch` from existing `client.ts`

**File: `src/lib/api/types/property.ts`** (only if endpoint exists)
- Type declarations mirroring backend DTO
- Uppercase MoodKey union to match F0.B pattern

**Test coverage:**
- Basic test that page.tsx compiles and renders
- Basic test for getProperties client function (if built)

### 5. Verify

- `npm run lint` clean
- `npm run typecheck` clean
- `npm run test` — all existing tests pass, new tests pass
- `npm run build` succeeds
- Manual: navigate to `/properties?mood=chill` in dev server, 
  see debug output
- Manual: navigate through full intent flow, complete submit, 
  land on `/properties?...` and see debug output (no more 404)

### 6. Push and report

**Report structure:**

**Part 1: Backend audit findings** (the primary deliverable)
- Property model schema + fields
- Endpoint state (exists / doesn't / partial)
- Pricing model
- Availability model
- Seed data state
- Mood/context relationship
- Photos

**Part 2: Frontend audit findings**
- API client pattern
- Route existence
- Type contracts

**Part 3: Scaffolding shipped**
- Files created/modified
- Debug output shown when hitting `/properties?mood=chill`
- CI status

**Part 4: Blocking gaps for B.2/B.3/B.4**
- What backend work is needed before B.2 can render real cards?
- What API additions would B.3 filters require?
- Any recommendations on B.2+ scope based on real backend state?

**Commit:** `feat(properties): audit + basic route scaffolding`

Push. CI runs. HOLD for Gaurav's review of audit + adjudication
of B.2 based on findings.

## Escalate before doing

- Backend Property model doesn't exist at all — report before 
  building scaffolding (this changes B.2+ scope significantly)
- Route conflicts with existing code (unexpected pages already at
  `/properties`)
- Property endpoint exists but returns something drastically 
  different from the search-page use case (e.g., single property 
  only, or admin-scoped) — propose approach

## Visual review (Gaurav will run after push)

```
cd C:\Code\duffleup\duffleup-web
git fetch
git checkout feat/properties-audit-scaffold
git pull
npm install
npm run test
npm run dev
```

Manual check:
1. Visit `http://localhost:3000/properties` — should see debug 
   page, not 404
2. Visit `/properties?mood=chill&sub=solo&checkin=2026-08-05&checkout=2026-08-08&adults=2&children=0&infants=0` 
   — should see all params parsed
3. Complete a full intent flow from home hero, land on 
   `/properties?...`, see debug output correctly showing all 
   submitted params
4. If backend endpoint exists, debug should show property count 
   / first 3 names

## After Gaurav's review

If audit is clean and scaffolding works, merge:
```
git checkout main
git pull origin main
git merge --no-ff feat/properties-audit-scaffold -m "Merge SP-F1 B.1: properties audit + basic scaffolding"
git push origin main
git push origin --delete feat/properties-audit-scaffold
git branch -d feat/properties-audit-scaffold
```

Then HOLD for B.2 adjudications file, which Gaurav writes based
on audit findings.

## Standing rules

- Scope frozen. New ideas → `docs/post-foundation-day-backlog.md`.
- No PR opened; Gaurav directs merges.
- Report at every unexpected finding.
- CI must be green before merge.
- Audit findings > code output for this sprint. If audit reveals
  blocking backend gaps, execute the minimal scaffold anyway (so
  the route stops 404-ing) and be explicit about the gap.
