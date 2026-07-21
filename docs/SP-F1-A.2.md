# SP-F1 A.2 — Mood + Sub-Context Grid

## Context

A.1 shipped the intent collector scaffolding:
- Route `(booking)/collect/page.tsx` — Server Component fetching
  `moodProfiles[]` and `moodContexts[]` via `getMoodConfig()`
- `IntentCollector.tsx` — Client Component with Radix Dialog
  shell, useReducer state machine, N-of-4 progress, Back/Next
  nav, close-resets
- Adapters: `normalize.ts` (MoodKey ↔ lowercase), `intent-state.ts`
  (Step/IntentState/IntentAction/reducer), `build-search-url.ts`
- Placeholder step markers, "Loaded N mood profiles" debug line

A.2 replaces the placeholders with real UI:
- Step 1: Mood grid (6 tiles)
- Step 2: Sub-context grid (3 tiles per selected mood)
- Real transitions between steps
- Skip-to-search after mood
- Mobile-responsive layout

A.3 handles dates + guests + submit routing.

## Design decisions locked

### 1. Modal trigger placement
Modal opens from TWO entry points on home page:
- **"PACK MY DUFFLE" hero button** → opens modal at Step 1 (mood)
- **Any mood tile click on home** → opens modal at Step 2 (sub-context), with that mood pre-selected

Both wire into the same `IntentCollector` component. Fix
Hero.tsx CTA target (currently `/properties`) to open modal
instead. Fix MoodDiscovery.tsx mood card clicks to open modal
with pre-selection.

### 2. Modal not route
Radix Dialog modal, state in React (useReducer). Only submit
routes to `/properties?...`. No URL changes during modal flow.

### 3. Mood grid layout
Responsive:
- Mobile (< 640px): 2 columns × 3 rows (six mood tiles)
- Desktop (≥ 640px): 3 columns × 2 rows

Reuse StickerMoodCard component or its visual language.
Match home page's mood tile aesthetic exactly — this is a
consistency win.

### 4. Sub-context grid layout
Responsive:
- Mobile: 1 column × 3 rows (vertical stack, full-width tiles)
- Desktop: 3 columns × 1 row (horizontal)

Sub-context tiles should be visually different from mood tiles
— less sticker-heavy, more secondary. Perhaps a simpler
bordered card style. Keep visual hierarchy clear.

### 5. Sub-context copy — use backend as-is
`moodContexts[]` from the API is the source of truth for
sub-context labels and content. Do NOT override in the frontend.

Report what `moodContexts[]` actually contains during execution
audit — Gaurav will decide if it needs backend copy refinement
in a future sprint.

### 6. Skip-to-search behavior
Allowed after Step 1 (mood selection).
- On Step 2, display a secondary CTA: "See all [mood] stays →"
- On click: dispatches skip action, closes modal, routes to
  `/properties?mood=<mood>` (no sub, no dates, no guests)
- Phase B (search results page) handles the "no dates" case —
  properties displayed without availability filter, "From ₹X"
  pricing indicator

For A.2 the skip just routes to `/properties?mood=chill` —
Phase B (which builds `/properties`) handles what that URL
does. The 404 that will result is expected and correct until
Phase B ships.

### 7. Empty state / mid-flow close
Modal close (X or Escape) resets to Step 1 on next open.
No session persistence. Simple.

### 8. Back navigation UX
Back button on any step:
- Returns to previous step
- Preserves the previous selection as "highlighted, changeable"
- User sees which mood/context they picked, can change or keep

Button label: `← Back`

### 9. Progress indicator
Format: `Step 1 of 4 · Mood`

At the top of the modal content. Both numeric progress AND
step name.

Step names:
- Step 1 · Mood
- Step 2 · Vibe (sub-context)
- Step 3 · Dates (A.3)
- Step 4 · Guests (A.3)

### 10. Mobile modal presentation
On screens < 640px:
- Modal presents as full-screen bottom sheet (slides up from
  bottom)
- Covers viewport entirely
- Close button (X) in top-right of sheet
- Radix Dialog styled via CSS to achieve this

On desktop:
- Standard centered Radix Dialog
- Max-width ~640px, centered
- Backdrop overlay

## Non-negotiables

- Do NOT change backend API — consume `moodProfiles[]` and
  `moodContexts[]` as they exist
- Do NOT alter A.1's state shape beyond adding what Step 2
  needs (which is already in `IntentState.sub`)
- Do NOT install new deps beyond what's already in package.json
- Do NOT change the URL structure of the final submit route
  (`/properties?mood=X&sub=Y&...`)
- Do NOT modify home page beyond the two integration points
  (Hero CTA target + MoodDiscovery tile click handlers)
- If backend `moodContexts[]` shape differs from what A.1
  scaffolded, HALT and report — do not fabricate a mapping
- Scope frozen — new ideas get logged to
  `docs/post-foundation-day-backlog.md`

## Prerequisite check

1. On `main`, working tree clean apart from expected untracked
   docs
2. `main` at A.1 merge HEAD (`98495d3`) or later
3. `npm run lint && npm run typecheck && npm run test && npm run build`
   all pass
4. Backend `/api/v1/mood-config` returns 200 with both
   `moodProfiles[]` and `moodContexts[]` populated
5. Existing StickerMoodCard component location confirmed
   (should be in `src/components/`)

If any fails, STOP and report.

## Do

### 1. Cut branch `feat/intent-collector-mood-context-grid` off `main`

### 2. Audit and report BEFORE building

Report before writing any UI code:
- Exact shape of `moodContexts[]` from a live API response
  (or from backend DTO if API is down)
- How `moodContexts[]` maps to `moodProfiles[]` (is there a
  `moodKey` field on each context? Or an ownership relationship?)
- Actual labels/copy in `moodContexts[]` per mood
- Location and API of StickerMoodCard component — can it be
  reused, or does a new tile component need to be created?
- Home page structure — where is Hero.tsx? Where is 
  MoodDiscovery.tsx? How do mood tiles currently handle click?

Gaurav will review the audit, adjudicate the sub-context copy
(if it's placeholder junk, we'll ship an interim string map;
if it's good, ship as-is), and approve execution.

### 3. Execution (after audit approval)

**Files to create/modify:**

**`src/components/booking/MoodGrid.tsx` (new)**
- 6-tile mood grid
- Responsive 2×3 mobile / 3×2 desktop
- Reuses StickerMoodCard visual language
- Props: `moods: MoodProfileConfig[]`, `onSelect(moodKey)`

**`src/components/booking/SubContextGrid.tsx` (new)**
- 3-tile sub-context grid for a specific mood
- Responsive 1×3 mobile / 3×1 desktop
- Props: `contexts: MoodContext[]` (filtered by mood),
  `moodKey: MoodKey`, `onSelect(sub)`, `onSkip(moodKey)`

**`src/app/(booking)/collect/IntentCollector.tsx` (modify)**
- Replace Step 1 placeholder with `<MoodGrid ...>`
- Replace Step 2 placeholder with `<SubContextGrid ...>`
- Wire up dispatches: SELECT_MOOD advances step,
  SELECT_SUB advances step, skip closes modal + routes
- Update progress indicator to "Step N of 4 · [Name]"
- Update back button to `← Back`

**`src/app/(booking)/collect/page.tsx` (modify)**
- Pass both `moodProfiles` AND `moodContexts` as props
- Remove debug "Loaded N mood profiles" line

**`src/components/booking/IntentCollectorModal.tsx` (new)**
- Shell component that Home page can render
- Manages Dialog open state via `open` prop + `onOpenChange`
- Wraps IntentCollector logic
- Renders full-screen sheet on mobile, centered dialog on
  desktop (Radix Dialog + CSS media queries)

**`src/components/home/Hero.tsx` (modify)**
- Change "PACK MY DUFFLE" CTA:
  - Old: `<Link href="/properties">` (currently 404s)
  - New: `<button onClick={openModal}>` — opens
    IntentCollectorModal at Step 1 (mood)

**`src/components/home/MoodDiscovery.tsx` (modify)**
- On mood tile click: opens IntentCollectorModal at Step 2
  with that mood pre-selected via SELECT_MOOD dispatched
  before mounting

### 4. State handling for entry points

The reducer needs to accept an initial state override so the
modal can open at Step 2 with a pre-selected mood:

```typescript
// In intent-state.ts, add initializer support
export const makeInitialState = (
  preselectedMood?: MoodKey
): IntentState => ({
  ...initialIntentState,
  step: preselectedMood ? 'sub' : 'mood',
  mood: preselectedMood ?? null,
})
```

`IntentCollectorModal` accepts an optional `preselectedMood`
prop that flows through.

### 5. Skip-to-search implementation

Add new action type:
```typescript
| { type: 'SKIP_TO_SEARCH' }
```

Handler in reducer routes to `/properties?mood=<lower>` via
`router.push()` — the reducer itself won't call `router.push()`
since it's a pure function. Instead, the click handler
dispatches SKIP_TO_SEARCH which updates state to a "skipped"
condition, and the effect in IntentCollector observes state
and triggers `router.push()` + modal close.

Alternative pattern: skip button calls `router.push` directly
+ closes modal, without going through the reducer. Simpler.

### 6. Radix Dialog full-screen mobile styling

Approach: Use `w-screen h-screen max-w-none rounded-none` on
Dialog.Content at mobile breakpoint. Reset padding, position
from top. On desktop breakpoint, restore centered dialog with
`w-[90vw] max-w-md rounded-2xl`.

Example Tailwind classes:
```
sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
sm:w-[90vw] sm:max-w-md sm:rounded-2xl
inset-0 w-screen h-screen max-w-none rounded-none
```

Test carefully at both breakpoints.

### 7. Verify

- `npm run lint` clean
- `npm run typecheck` clean
- `npm run test` — all existing tests pass, new tests for
  MoodGrid + SubContextGrid selection behavior
- `npm run build` succeeds
- `/collect` route works with real mood grid + sub-context grid
- Home page "PACK MY DUFFLE" opens modal
- Home page mood tile clicks open modal at Step 2 pre-selected
- Back navigation preserves selections as highlighted
- Skip-to-search routes to `/properties?mood=chill` (404 is
  expected until Phase B)
- Escape / close resets modal
- Mobile (< 640px viewport in DevTools): full-screen sheet
- Desktop: centered modal

### 8. Add unit tests

At minimum:
- `MoodGrid.test.tsx`: renders 6 mood tiles, click dispatches
  onSelect with correct MoodKey
- `SubContextGrid.test.tsx`: renders 3 context tiles for given
  mood, click dispatches onSelect, skip button dispatches onSkip
- `intent-state.test.ts`: existing tests still pass, new tests
  for pre-selection initializer

### 9. Push branch and report

Report:
- Commit hash
- CI status on branch push
- Files created/modified (list)
- Actual copy in `moodContexts[]` per mood (for Gaurav to
  eyeball)
- Screenshot description of desktop and mobile modal states
- Any deviation from the design

**Commit:** `feat(collect): mood grid + sub-context grid with modal entry points`

Push. CI runs on branch. Report result. HOLD for visual review.

## Escalate before doing

- Backend `moodContexts[]` shape differs from A.1's assumed
  scaffolding — audit report first
- StickerMoodCard component API doesn't fit intent collector
  use (e.g., requires callbacks A.2 can't provide) — propose
  approach
- Home page Hero.tsx or MoodDiscovery.tsx structure surprises
  you and modification isn't a 1-line change
- Radix Dialog full-screen mobile styling turns out to need a
  bigger refactor
- Any test or lint failure that's not a straightforward fix

## Visual review (Gaurav will run)

```
cd C:\Code\duffleup\duffleup-web
git fetch
git checkout feat/intent-collector-mood-context-grid
git pull
npm install
npm run test
npm run dev
```

**Desktop test flow:**
1. Home → click "PACK MY DUFFLE" → modal opens at Step 1
2. See 3×2 mood grid
3. Click "Chill" → advances to Step 2 (sub-context)
4. See 3-tile horizontal sub-context row
5. Click a sub-context → advances to Step 3 (placeholder, A.3 territory)
6. Back button → returns to Step 2, Chill highlighted
7. Back again → Step 1, Chill highlighted
8. Escape → modal closes
9. Reopen from hero → Step 1, no selections
10. From home page, click a mood tile directly → modal opens at Step 2 with that mood

**Mobile test flow (DevTools responsive mode, 375px):**
1. Same flow, but modal is full-screen bottom sheet
2. 2×3 mood grid
3. 1×3 vertical sub-context stack

**Skip flow:**
1. Home → click mood tile → modal opens at Step 2
2. Click "See all [mood] stays →" secondary CTA
3. Modal closes, routes to `/properties?mood=chill`
4. 404 (expected — Phase B builds `/properties`)

**Verification also:**
- Backend `moodContexts[]` shape matches A.1 assumptions
- Skip button shows correct mood name
- Progress indicator shows correct step name

If clean, merge:
```
git checkout main
git pull origin main
git merge --no-ff feat/intent-collector-mood-context-grid -m "Merge SP-F1 A.2: mood + sub-context grid"
git push origin main
git push origin --delete feat/intent-collector-mood-context-grid
git branch -d feat/intent-collector-mood-context-grid
```

## After merge

Vercel deploys ~3 min. Verify live:
- Home hero + mood tiles open modal
- Modal renders correctly on prod
- Skip routes to `/properties?mood=X` (404 in prod is expected)

Then HOLD for SP-F1 A.3 adjudications.

## A.3 preview (do NOT execute)

A.3 will handle:
- Date picker (react-day-picker, already installed)
- Guest counter (adults, children)
- Submit routing to `/properties?mood=X&sub=Y&checkin=...&checkout=...&adults=N&children=M`
- Date validation (checkout after checkin, min stay?)
- Guest max limits (or none, filter at results?)

Gaurav will ship A.3 adjudications file after A.2 merges.

## Standing rules

- Scope frozen. New ideas → `docs/post-foundation-day-backlog.md`.
- No PR opened; Gaurav directs merges.
- Report at every unexpected finding.
- CI must be green before merge.
