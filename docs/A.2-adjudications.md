# SP-F1 A.2 — Adjudications

All three blocking rulings resolved. All "proceeding unless
you object" items approved.

## R1 — Sub-context tile copy

**(a) Label-only tiles per Decision 5.** Ship `guestLabel`
as-is. No frontend string map.

`contextCopy` becomes the Step 2 heading — a better solution
than the two-tier tile hierarchy. Mood personality lives in
the heading, tiles stay clean action selectors.

Log to backlog (see below).

## R2 — What goes in sub=

**Approve CC's approach.** State stores bare suffix (`solo`).
`tagKey` reconstructed as `${mood}.${sub}` when needed by
Phase B backend queries. No changes to `build-search-url.ts`
or its test. Existing URL structure preserved.

## R3 — Home-page modal data fetching

**(b) Modal fetches client-side on first open.**

Home page stays fully static per F0.B decision. Modal fetches
`moodProfiles[]` + `moodContexts[]` client-side when it opens.
Brief loading state is invisible in practice.

**Cache pattern:** module-level cache so subsequent modal
opens don't re-fetch:

```typescript
let cachedConfig: MoodConfigResponse | null = null

async function loadConfig() {
  if (cachedConfig) return cachedConfig
  const config = await getMoodConfig()
  cachedConfig = config
  return config
}
```

Loading state UI is a simple spinner or skeleton — CC decides
what fits the existing modal aesthetic. Small.

## "Proceeding unless you object" — ALL APPROVED

1. **Correct paths** to `components/marketing/*` (my brief had
   `components/home/*` which doesn't exist). Fix path
   references throughout.

2. **Add optional `onClick` to StickerMoodCard** — renders
   `<button>` when no `href` set. Non-breaking for `/ds` page,
   serves both the modal grid and MoodDiscovery integration.

3. **Extract `PackMyDuffleCta` client component** from Hero.
   Hero stays a Server Component. Line 33 swap is one line.
   PackMyDuffleCta is a small `'use client'` component
   managing modal open state.

4. **MoodDiscovery becomes `'use client'`** — flagged as
   more-than-one-line change per escalation rule, but the
   change is safe. No server-only deps. This is the natural
   client boundary for interactive mood tiles.

5. **Desktop modal max-width ~640px** — widens A.1's
   `max-w-md` (448px). A 3×2 grid of 4:5 sticker cards is
   unusably cramped at 448px.

6. **Step 2 heading = `moodProfiles[].contextCopy`** — great
   find. Uses backend's punchy copy naturally.

## Backlog entries — add to docs/duffleup-backlog.md

```
- Sub-context tile copy enrichment: backend MoodContext
  currently exposes only guestLabel (single phrase per tile).
  A.2 ships label-only tiles per Decision 5 (use backend as-is).
  Consider adding an optional description field to MoodContext
  for richer secondary copy per tile (e.g., "Solo escape" +
  "The pace is yours"). Currently RESET/PETS have single-word
  labels which feel thin. Timing: post-launch small backend
  sprint if we want the two-tier tile hierarchy.

- A.3 guest counter prefill: moodProfiles[] exposes a
  defaultGuests field populated for CHILL / ROMANCE / RESET.
  A.3 should use this to prefill the guest counter step based
  on selected mood (e.g., ROMANCE defaults to 2). Adventure /
  Bash / Pets don't have defaults — use adults=1 fallback per
  A.1's initial state.
```

## Execute

Proceed with the A.2 brief execution with all rulings above
applied. Add both backlog entries as part of the atomic
commit.

**Commit:** `feat(collect): mood grid + sub-context grid with modal entry points`

Push. CI runs on branch. HOLD for Gaurav's visual review.

Report:
- Commit hash
- CI status on branch push
- Files created/modified
- Actual `guestLabel` values applied per mood (for eyeball
  verification of backend copy quality)
- Screenshot descriptions of desktop and mobile modal states
- Any deviation

## Non-negotiables reminder

- Do NOT change backend API
- Do NOT modify home page beyond Hero.tsx line 33 swap +
  MoodDiscovery client boundary + tile click handlers
- Do NOT ship modal fetch without the module-level cache
- If any unexpected surprise surfaces, HALT and report — don't
  fabricate
