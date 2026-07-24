# SP-F1 A.3 — Dates + Guests + Submit

## Context

A.1 shipped the intent collector scaffolding (route, state
machine, Radix Dialog shell). A.2 shipped the mood + sub-context
grids and integrated modal entry points on home page. Both live
in prod.

A.3 completes Phase A by adding:
- **Step 3 — Dates:** check-in / check-out via react-day-picker
- **Step 4 — Guests:** adults + children + infants steppers
- **Submit:** routes to `/properties?mood=X&sub=Y&checkin=...&checkout=...&adults=N&children=M&infants=I`

After A.3 ships, Phase A is complete. Phase B (search results
page) can then consume any subset of these URL params.

## Design decisions locked

### 1. Date library
`react-day-picker` (already installed, verified in F0.E deps
hygiene sprint).

### 2. Minimum stay
1 night. Checkout must be at least 1 day after check-in.

### 3. Maximum stay — soft cap 7 nights
No hard limit. When user selects a checkout that pushes stay
beyond 7 nights, display inline warning below the date picker:

`Weekend app. Longer stays welcome. Options get thinner.`

Warning is informational only. User can still proceed.
Analytics-worthy trigger event (log this in backlog for
post-launch instrumentation).

### 4. Guest count range
Uniform across all moods: min 1 adult, max 60 total (adults +
children + infants combined). Enforced via stepper `+`
disabled at 60 total, `−` disabled at 1 for adults / 0 for
children/infants.

### 5. Guest tiers
Three categories:
- **Adults** (12+) — minimum 1, default per mood or 1 fallback
- **Children** (2-12) — minimum 0, default 0
- **Infants** (0-2) — minimum 0, default 0

Copy label under each: brief clarification (`"Ages 12+"`,
`"Ages 2-12"`, `"Under 2"`).

### 6. Date picker layout
- Single-month calendar view
- Left/right arrows to navigate months
- Range selection (tap check-in → tap check-out on same
  calendar surface)
- Highlighted range between the two selections
- Past dates disabled (before today)

Reuse react-day-picker's `mode="range"` API.

### 7. Guest counter UI
Three-tier stepper. Each row:
- Left: label + descriptor line
- Right: `−` button, count number, `+` button

Standard Airbnb/Booking pattern.

### 8. Skip-to-search — allowed on all steps
- **Step 2 (sub-context):** already locked in A.2 —
  `See all [mood] stays →` submits with `?mood=X`
- **Step 3 (dates):** secondary CTA `See stays →` submits
  with `?mood=X&sub=Y` (no dates)
- **Step 4 (guests):** primary CTA is `See stays` — the
  submit action, includes whatever was set

Each skip immediately routes and closes the modal.

### 9. Guest count prefill
On advancing to Step 4:
- If selected `moodContexts[N].defaultGuests` is set,
  prefill adults from that value
- Otherwise: adults = 1
- Children and infants always start at 0

Per A.2 backlog entry — `defaultGuests` is set on all 3
ROMANCE contexts, 2 of 3 CHILL, 2 of 3 RESET, null elsewhere.

### 10. URL structure
Full form: `/properties?mood=chill&sub=solo&checkin=2026-08-05&checkout=2026-08-08&adults=2&children=0&infants=0`

All params optional beyond `mood`:
- Only mood: `/properties?mood=chill` (Step 2 skip)
- Mood + sub: `/properties?mood=chill&sub=solo` (Step 3 skip)
- Full: as above (Step 4 submit)

Phase B handles all cases. A.3 is not responsible for Phase B's
"missing params" behavior.

### 11. Progress indicator
Keep numeric — `Step N of 4 · [Name]`
- Step 3 · Dates
- Step 4 · Guests

Even though later steps are optional, linear numbering still
applies.

### 12. Back navigation
Same pattern as A.2:
- Back preserves prior step's selection as highlighted /
  changeable
- Button label: `← Back`

## Non-negotiables

- Do NOT change backend API
- Do NOT alter A.1's state shape beyond adding infants
  (already spec'd for A.3)
- Do NOT install new deps — react-day-picker + date-fns
  (already installed) are sufficient
- Do NOT modify Phase B's `/properties` route or make
  assumptions about its behavior
- Do NOT touch other steps' UI beyond wiring up prefill from
  moodContexts
- If any component from A.2 (MoodGrid, SubContextGrid,
  IntentCollectorModal) needs modification beyond adding
  Step 3/4 rendering, HALT and propose
- Scope frozen — new ideas get logged to
  `docs/post-foundation-day-backlog.md`

## Prerequisite check

1. On `main`, working tree clean apart from expected untracked
   docs
2. `main` at A.2-fix merge HEAD (`57edb84`) or later
3. `npm run lint && npm run typecheck && npm run test && npm run build`
   all pass
4. `react-day-picker` and `date-fns` verified in package.json
5. Backend `/api/v1/mood-config` responds and `moodContexts[]`
   with `defaultGuests` field is accessible

If any fails, STOP and report.

## Do

### 1. Cut branch `feat/intent-collector-dates-guests` off `main`

### 2. Audit and report BEFORE writing UI code

Report before building:
- Confirm `moodContexts[].defaultGuests` values (from A.2 audit
  — should be numeric or null)
- Confirm react-day-picker's `mode="range"` API is available at
  the installed version (check node_modules)
- Confirm date-fns utilities available for date math (add,
  differenceInDays)
- Where is IntentCollector.tsx currently? (should be at
  `src/app/(booking)/collect/IntentCollector.tsx`)
- Show current IntentCollector.tsx Step 3 and Step 4 placeholder
  code

Gaurav reviews the audit briefly, then proceeds to execution.

### 3. State machine updates

**`src/lib/moods/intent-state.ts` modifications:**

Add `infants: number` to IntentState:
```typescript
type IntentState = {
  step: Step
  mood: MoodKey | null
  sub: string | null
  checkin: Date | null
  checkout: Date | null
  adults: number
  children: number
  infants: number  // NEW
}
```

Update `initialIntentState`:
```typescript
adults: 1,
children: 0,
infants: 0,
```

Add reducer actions:
```typescript
| { type: 'SET_DATES'; checkin: Date; checkout: Date }
| { type: 'SET_ADULTS'; count: number }
| { type: 'SET_CHILDREN'; count: number }
| { type: 'SET_INFANTS'; count: number }
```

SET_DATES advances step to 'guests'.
SET_ADULTS/CHILDREN/INFANTS mutate in place (Step 4 is not
transitional).

**`src/lib/moods/build-search-url.ts` modifications:**

Add infants to URL param output:
```typescript
params.set('infants', state.infants.toString())
```

Update the corresponding test.

**Tests:** Update `intent-state.test.ts` for new state shape and
new actions. Update `build-search-url.test.ts` for infants
param.

### 4. New components

**`src/components/booking/DatePickerStep.tsx` (new)**

Client Component. Single-month range picker via react-day-picker.
- Props: `checkin: Date | null`, `checkout: Date | null`,
  `onRangeChange({ checkin, checkout }) => void`, `onSkip() => void`
- Reuses react-day-picker with `mode="range"`
- Applies Duffleup brand styling (Pitch on primary, Hyperpurple
  for range highlight, disabled for past dates)
- Warning line displays when `differenceInDays(checkout, checkin) > 7`
- Warning text: `Weekend app. Longer stays welcome. Options get thinner.`
- Skip CTA: `See stays →` (secondary style)
- Next CTA: enabled when both checkin AND checkout set

**`src/components/booking/GuestStepper.tsx` (new)**

Client Component. Three-tier stepper.
- Props: `adults, children, infants: number`, `onAdultsChange, onChildrenChange, onInfantsChange(count) => void`,
  `onSubmit() => void`, `moodName: string`
- Three rows: Adults / Children / Infants
- Each row: label + `−` count `+`
- Disable `−` on min (1 for adults, 0 for children/infants)
- Disable `+` when total (adults + children + infants) = 60
- Submit CTA: `See [mood] stays →` — always enabled (adults
  always ≥ 1)

### 5. IntentCollector.tsx modifications

Replace Step 3 and Step 4 placeholders with:

```tsx
{step === 'dates' && (
  <DatePickerStep
    checkin={state.checkin}
    checkout={state.checkout}
    onRangeChange={({ checkin, checkout }) => dispatch({ type: 'SET_DATES', checkin, checkout })}
    onSkip={handleSkipToSearch}
  />
)}
{step === 'guests' && (
  <GuestStepper
    adults={state.adults}
    children={state.children}
    infants={state.infants}
    onAdultsChange={n => dispatch({ type: 'SET_ADULTS', count: n })}
    onChildrenChange={n => dispatch({ type: 'SET_CHILDREN', count: n })}
    onInfantsChange={n => dispatch({ type: 'SET_INFANTS', count: n })}
    onSubmit={handleSubmit}
    moodName={moodDisplayName(state.mood)}
  />
)}
```

Wire up:
- Step 3 skip → routes to `/properties?mood=X&sub=Y`
- Step 3 SET_DATES → advances to Step 4, prefill from
  `defaultGuests` if available (in reducer or effect)
- Step 4 submit → routes to full URL via
  `buildSearchUrl(state)`

Progress indicator update:
- Step 3 · Dates
- Step 4 · Guests

### 6. Default guest prefill logic

When entering Step 4 (from Step 3 date submission), check
`moodContexts[selected]?.defaultGuests` and prefill adults if
present.

Cleanest implementation: an effect in IntentCollector that
watches `step === 'guests'` and dispatches SET_ADULTS from
mood config on transition. Or handle in reducer's SET_DATES
action.

CC picks the cleaner pattern.

### 7. Handle back navigation

Back on Step 3 → returns to Step 2 (sub-context grid) with sub
still highlighted.

Back on Step 4 → returns to Step 3 (date picker) with dates
still shown.

### 8. Verify

- `npm run lint` clean
- `npm run typecheck` clean
- `npm run test` — all existing tests pass, new tests for
  DatePickerStep + GuestStepper + updated state/URL
- `npm run build` succeeds
- Dev server flow test on `/collect`:
  - Complete flow: pick mood → sub → dates → guests → submit
  - Skip on Step 3 flow: pick mood → sub → skip dates
  - Skip on Step 2 flow: still works (unchanged)
  - Home entry: hero → complete flow
  - Home entry: mood tile → pre-selected mood → complete flow
  - Back navigation preserves selections at every step
  - >7 night selection shows warning
  - Guest count constraints enforced
  - defaultGuests prefill works for ROMANCE moods

### 9. Push branch and report

Report:
- Commit hash
- CI status on branch push
- Files created/modified
- Actual URL params generated for complete flow AND partial
  skip flows (verified via console log or dev URL)
- defaultGuests prefill confirmed for at least one ROMANCE
  sub-context
- Any deviation

**Commit:** `feat(collect): dates + guests steps with submit routing`

Push. CI runs. HOLD for Gaurav's visual review authorization.

## Escalate before doing

- react-day-picker `mode="range"` doesn't work at the installed
  version — propose alternative
- Backend `moodContexts[].defaultGuests` doesn't match A.2's
  audit finding
- Any state machine change that would break A.2's shipped
  behavior
- react-day-picker styling doesn't accept Tailwind overrides
  cleanly — propose approach
- Any test or lint failure that's not straightforward

## Visual review (Gaurav will run)

```
cd C:\Code\duffleup\duffleup-web
git fetch
git checkout feat/intent-collector-dates-guests
git pull
npm install
npm run test
npm run dev
```

**Desktop test flow (localhost:3000):**
1. Home → click "PACK MY DUFFLE" → modal opens at Step 1
2. Complete Step 1 (mood) and Step 2 (sub-context)
3. Step 3 loads with date picker, single-month view
4. Pick check-in, then check-out (2 taps on calendar)
5. Range highlights between the two dates
6. Advance to Step 4
7. Guest stepper shows adults=1 (or default from moodContexts),
   children=0, infants=0
8. Increment adults to 3, add 1 child, add 1 infant
9. Click "See stays" → routes to
   `/properties?mood=X&sub=Y&checkin=...&checkout=...&adults=3&children=1&infants=1`
10. `/properties` 404s (expected, Phase B builds it)

**Test 7-night warning:**
1. Complete Steps 1-2
2. Step 3: pick check-in today, check-out 10 days out
3. Verify warning shows: `Weekend app. Longer stays welcome. Options get thinner.`
4. Verify user can still advance to Step 4

**Test defaultGuests prefill:**
1. Complete Steps 1-2 with mood=ROMANCE, any sub
2. Advance through Step 3
3. Step 4 should show adults=2 (per Romance defaultGuests),
   not adults=1

**Test skip flows:**
1. Step 3: pick nothing, click "See stays →" secondary CTA
2. Routes to `/properties?mood=X&sub=Y` (no date params)
3. Verify URL

**Mobile test flow (DevTools 375px):**
1. Same flow but full-screen sheet
2. Date picker still single-month, calendar readable
3. Guest steppers work with tap targets ≥ 44px

**Back navigation test:**
1. Complete Steps 1-3
2. On Step 4, click Back → returns to Step 3 with dates
   preserved
3. On Step 3, click Back → returns to Step 2 with sub
   preserved

If all clean, merge:
```
git checkout main
git pull origin main
git merge --no-ff feat/intent-collector-dates-guests -m "Merge SP-F1 A.3: dates + guests + submit"
git push origin main
git push origin --delete feat/intent-collector-dates-guests
git branch -d feat/intent-collector-dates-guests
```

## After merge

Vercel deploys ~3 min. Verify live:
- Home hero and mood tile entry points → complete flow
  possible end-to-end
- Skip flows work
- Submit routes to `/properties?mood=...` (404 in prod
  expected until Phase B)

Then Phase A is complete.

## Backlog additions needed

Add to `docs/duffleup-backlog.md`:

```
- Duffleup Vouchers (gifting product): allow users to purchase
  Duffleup vouchers for gifting to others. Post-Foundation-Day
  scope. Requires backend voucher entity, purchase flow via
  Razorpay, redemption logic in booking flow, expiry rules,
  transferability rules, admin voucher management, guest 
  "You have vouchers" surface. Estimated 60-70 CC hours 
  total. Natural launch: Q1 2027, potentially bundled with 
  Strap launch. Real value: revenue upfront (voucher purchase 
  = cash), viral acquisition channel, holiday-season play.

- Backend booking DTO — infants field: intent collector A.3
  captures adults/children/infants in URL params. Backend
  booking DTO currently doesn't have an `infants` field (per
  A.2 audit noting the CreateEarlyAccessDto shape). Add
  `infants: number` to booking-related DTOs before Phase D
  (booking scaffolding). Small backend sprint.

- Max stay length policy: intent collector has soft cap 7
  nights with warning "Weekend app. Longer stays welcome.
  Options get thinner." No hard block. Log the warning-trigger
  event when analytics infrastructure lands post-launch —
  data will show whether soft cap is respected or ignored.
  Revisit hard cap decision at 3 months post-launch based on
  distribution.
```

## Standing rules

- Scope frozen. New ideas → `docs/post-foundation-day-backlog.md`.
- No PR opened; Gaurav directs merges.
- Report at every unexpected finding.
- CI must be green before merge.
