# SP-F1 Phase A — Intent Collector Modal

## Context

`duffleup-web` marketing pages are complete. Users landing on
`/` see the mood section, hero, and CTAs. When they click
"PACK MY DUFFLE" or a mood tile, they currently go to
`/properties` which 404s (SP-F1 Phase B builds it).

Phase A intercepts BEFORE `/properties`. Instead of landing
directly on a search results page, users go through an
**Intent Collector modal** that captures:

1. **Mood** (which of the six)
2. **Sub-context** (which of the three per mood)
3. **Dates** (check-in, check-out)
4. **Guests** (adults, children)

Then submits by routing to `/properties?mood=CHILL&sub=SOLO&checkin=...&checkout=...&adults=2&children=0`

`/properties` (Phase B) will consume those URL params to run
the actual search. Phase A is the collection funnel that gets
users there with intent already captured.

## Design decisions locked

### 1. Modal not full page

Radix Dialog modal, not a route change until submission. Users
never lose their place — clicking "PACK MY DUFFLE" opens the
modal over the current page. Escape or close-X returns them
where they were.

### 2. State lives in URL query params AFTER submission

During the modal flow, state is in React (useReducer). On
submit, we route to `/properties?params...`. This keeps the
modal simple during entry and makes results shareable/
bookmarkable.

### 3. Case boundary at the adapter layer

Backend enum: `MoodKey = 'CHILL' | 'ROMANCE' | 'ADVENTURE' | 'RESET' | 'BASH' | 'PETS'`
UI expectation (per StickerMoodCard): lowercase `'chill' | 'romance' | ...`

Adapter in `src/lib/moods/normalize.ts`:
```typescript
export const moodKeyToLower = (key: MoodKey): string => key.toLowerCase()
export const lowerToMoodKey = (lower: string): MoodKey => lower.toUpperCase() as MoodKey
```

URL param uses lowercase (`mood=chill`), backend query uses
uppercase. Adapter normalizes both directions.

### 4. Data source

Server Component fetches mood config via `getMoodConfig()`
(built in F0.B). Passes mood array to Client Component
containing the modal. Modal renders whatever moods come from
API. Not hardcoded.

### 5. Entry points into the modal

Multiple triggers open the same modal:
- Hero "PACK MY DUFFLE" button
- Any mood tile click on home page
- (Future) burger menu "Stays" link

Each trigger can pre-select mood if the trigger identifies one
(mood tile click → mood already picked, skip to sub-context
step). Hero CTA opens on step 1 (mood selection).

### 6. Progressive disclosure — one step at a time

Steps render sequentially. User can go back (previous step
button). Each step must complete before next appears. Progress
indicator at top shows position (1 of 4, 2 of 4, etc.).

### 7. Route on submit

Submit URL format:
```
/properties?mood=chill&sub=solo&checkin=2026-08-05&checkout=2026-08-08&adults=2&children=0
```

- `mood` and `sub` lowercase (URL convention)
- `checkin` and `checkout` ISO 8601 date strings
- `adults` and `children` integers
- Route uses Next.js `router.push()` from client-side

## Sub-phase split

Phase A splits into three sub-phases. Each ends at a natural
hold gate. CC executes sequentially, halts for Gaurav approval
at each gate. Overnight-safe: A.1 has no design decisions, so
CC can complete it autonomously.

## Non-negotiables (all sub-phases)

- Do NOT modify home page, mood cards, or any existing marketing
  component beyond adding modal triggers
- Do NOT change design tokens
- Do NOT invent copy — placeholder copy is fine in A.1, real
  copy adjudicated in A.2 and A.3
- Do NOT touch backend API
- Do NOT install new deps beyond what's already installed and
  documented in F0.E
- Do NOT create a new route beyond `(booking)/collect/` and
  supporting files
- Scope frozen; new ideas get logged to
  `docs/post-foundation-day-backlog.md`
- Report at every gate. Wait for explicit go before proceeding.

## Prerequisite check (before A.1 starts)

1. On `main`, working tree clean apart from expected untracked
   docs
2. `main` at F0.E merge HEAD or later
3. `npm run lint && npm run typecheck && npm run test && npm run build`
   all pass
4. Backend `/api/v1/mood-config` responds with 200 from
   `https://api.duffleup.in/api/v1/mood-config`
5. F0.B's `getMoodConfig()` helper exists at `src/lib/api/types/index.ts`
   or similar location — verify before proceeding

If any fails, STOP and report.

---

## Sub-phase A.1 — Scaffolding + case boundary + state skeleton

**Overnight-safe. Zero design decisions. Zero copy.**

### Do

#### 1. Cut branch `feat/intent-collector-scaffolding` off `main`

#### 2. Create `src/lib/moods/normalize.ts`

```typescript
import type { MoodKey } from '@/lib/api/types/mood-config'

/**
 * Converts backend uppercase MoodKey to lowercase URL/UI form.
 */
export const moodKeyToLower = (key: MoodKey): string => key.toLowerCase()

/**
 * Converts lowercase URL/UI form to backend MoodKey.
 * Throws if the input isn't a valid MoodKey.
 */
export const lowerToMoodKey = (lower: string): MoodKey => {
  const upper = lower.toUpperCase()
  const valid: MoodKey[] = ['CHILL', 'ROMANCE', 'ADVENTURE', 'RESET', 'BASH', 'PETS']
  if (!valid.includes(upper as MoodKey)) {
    throw new Error(`Invalid mood key: ${lower}`)
  }
  return upper as MoodKey
}
```

Adapt the valid list to match the actual MoodKey type from
F0.B's type definition. If MoodKey union has changed since
F0.B, use the current definition.

#### 3. Create `src/lib/moods/normalize.test.ts`

Small unit test:
- `moodKeyToLower('CHILL')` returns `'chill'`
- `lowerToMoodKey('chill')` returns `'CHILL'`
- `lowerToMoodKey('invalid')` throws

#### 4. Create route `(booking)/collect/page.tsx`

Minimal Server Component that:
- Fetches mood config via `getMoodConfig()`
- Wraps everything in a Client Component (`IntentCollector`)
- Renders nothing else

```typescript
import { getMoodConfig } from '@/lib/api'
import { IntentCollector } from './IntentCollector'

export default async function CollectPage() {
  const moodConfig = await getMoodConfig()
  return <IntentCollector moods={moodConfig.moods} />
}
```

If `getMoodConfig` fails at build time (backend down),
`page.tsx` should not throw — wrap in try/catch and render an
error state. Log ambiguity, do not fabricate mood data.

#### 5. Create `(booking)/collect/IntentCollector.tsx`

Client Component (mark with `'use client'`).

Uses `@radix-ui/react-dialog` for modal shell. Initially,
render:

- Radix Dialog root
- Trigger button (labeled `Open collector` for now — real
  triggers integrate in later sub-phases)
- Dialog content with placeholder step markers ("Step 1: Mood",
  "Step 2: Sub-context", "Step 3: Dates", "Step 4: Guests")
- Close button
- Progress indicator at top (1 of 4, 2 of 4, ...)
- Back and Next buttons at bottom
- Console.log the current state on transitions (for debugging)

No real UI beyond structure. No mood tile grid, no date picker,
no guest counter. Just placeholder text and working buttons.

#### 6. Create state management with useReducer

```typescript
type Step = 'mood' | 'sub' | 'dates' | 'guests'

type IntentState = {
  step: Step
  mood: MoodKey | null
  sub: string | null
  checkin: Date | null
  checkout: Date | null
  adults: number
  children: number
}

type IntentAction =
  | { type: 'SELECT_MOOD'; mood: MoodKey }
  | { type: 'SELECT_SUB'; sub: string }
  | { type: 'SET_DATES'; checkin: Date; checkout: Date }
  | { type: 'SET_GUESTS'; adults: number; children: number }
  | { type: 'STEP_BACK' }
  | { type: 'RESET' }
```

Implement reducer with basic transitions. No submission logic
yet.

#### 7. Add URL param generation utility

`src/lib/moods/build-search-url.ts`:

```typescript
export function buildSearchUrl(state: IntentState): string {
  const params = new URLSearchParams()
  if (state.mood) params.set('mood', state.mood.toLowerCase())
  if (state.sub) params.set('sub', state.sub.toLowerCase())
  if (state.checkin) params.set('checkin', state.checkin.toISOString().split('T')[0])
  if (state.checkout) params.set('checkout', state.checkout.toISOString().split('T')[0])
  params.set('adults', state.adults.toString())
  params.set('children', state.children.toString())
  return `/properties?${params.toString()}`
}
```

With unit test in `build-search-url.test.ts`.

#### 8. Verify

- `npm run lint` clean
- `npm run typecheck` clean
- `npm run test` — all tests pass including new ones
- `npm run build` succeeds
- `npm run dev` — visit `http://localhost:3000/collect`, modal
  trigger button visible, clicking opens modal, buttons
  navigate placeholder steps, close returns to page

#### 9. Push branch and report

Report:
- Commit hash
- Files created (list them)
- State shape confirmed
- Any deviation from the design
- CI status on branch push

**Commit:** `feat(collect): scaffold intent collector route with state skeleton`

Push. CI runs on branch (per F0.C+D triggers). Wait for CI
result.

If CI green, HOLD for Gaurav's visual review authorization.
Do NOT proceed to A.2.

### A.1 gate — Gaurav's visual review

```
cd C:\Code\duffleup\duffleup-web
git fetch
git checkout feat/intent-collector-scaffolding
git pull
npm install
npm run test
npm run dev
```

Browser check:
- `http://localhost:3000/collect` — page loads
- Click "Open collector" trigger — modal opens
- Placeholder step markers visible (1 of 4, 2 of 4, etc.)
- Back/Next buttons navigate between placeholders
- Close button closes modal
- Reopening resets to Step 1
- No console errors
- All 8 existing pages still render normally

Also verify:
- GitHub Actions CI green on branch
- Existing tests still pass

If clean, merge:
```
git checkout main
git pull origin main
git merge --no-ff feat/intent-collector-scaffolding -m "Merge SP-F1 A.1: intent collector scaffolding"
git push origin main
git push origin --delete feat/intent-collector-scaffolding
git branch -d feat/intent-collector-scaffolding
```

Confirm CI green on main. Then proceed to A.2.

---

## Sub-phase A.2 — Mood + sub-context grid

**Needs Gaurav adjudication. Do NOT execute until A.1 merges
and Gaurav provides A.2 adjudications file.**

### Scope (for context, not execution)

- Real mood tile grid using `StickerMoodCard` component
- Selection state, transition to sub-context step
- Sub-context grid (3 per mood) — need Gaurav's copy for tile
  labels and any explanation copy
- Back navigation between steps
- Skip-to-search option (if user just wants to browse a mood
  without sub-context) — Gaurav rules on this
- Empty-state handling (no mood selected + skip pressed)
- Mobile layout — Gaurav rules on approach

Gaurav will ship `SP-F1-A.2-adjudications.md` after A.1 merges.
CC waits.

---

## Sub-phase A.3 — Dates + guests + route submission

**Needs Gaurav adjudication. Do NOT execute until A.2 merges
and Gaurav provides A.3 adjudications file.**

### Scope (for context, not execution)

- Date picker using `react-day-picker` (kept in F0.E)
- Minimum-stay validation — Gaurav rules on rule (1 night? 2?)
- Guest counter (adults + children — Gaurav rules on infant
  handling)
- Guest maximums per property capacity? Or unlimited at intent
  stage, filter at results stage? — Gaurav rules
- Submit button — routes to `/properties?...`
- Since `/properties` doesn't exist yet, submit will land on a
  404. This is expected and correct. Phase B fixes.

Gaurav will ship `SP-F1-A.3-adjudications.md` after A.2 merges.

---

## Overnight execution rules

CC will only execute A.1 tonight without further adjudication.

If A.1 completes cleanly (CI green, no surprises):
- CC pushes and HOLDS
- CC does NOT attempt A.2 without Gaurav's file

If A.1 encounters something requiring Gaurav's ruling:
- CC HALTS at that decision point
- CC pushes whatever partial work is complete
- CC reports the decision needed
- Gaurav wakes up, adjudicates, CC continues

**Never fabricate a decision.** The overnight brief is safe
because A.1 has no real decision surface — the state skeleton,
route structure, and case boundary adapter are all
predetermined. If anything surprising appears during A.1,
CC halts.

## Escalate before doing

- Backend `/api/v1/mood-config` doesn't respond during
  prerequisite check
- MoodKey type from F0.B differs from the union assumed here
- `getMoodConfig()` helper doesn't exist at the expected path
- Radix Dialog install is missing or broken
- Any hidden coupling between the intent collector and existing
  components
- Any failing test on main before starting

## After A.1 merges

Gaurav will send the A.2 adjudications file with rulings on:
- Sub-context tile copy for each mood
- Skip-to-search behavior
- Mobile layout
- Empty state
- Back navigation copy
- Any other design decisions surfaced during A.1 execution

Then A.2 executes. Same pattern for A.3.

## Standing rules

- Scope frozen. New ideas get logged to
  `docs/post-foundation-day-backlog.md`.
- No PR opened; Gaurav directs merges.
- Report at every unexpected finding.
- CI must be green before merge.
