# SP-F1 A.1 Merge + Backlog Update

Clean restart resolved the modal issue — fifth occurrence of
stale `.next` cache after route addition + first-time client
dep import.

Visual review passed. All three A.1 deviations approved:
- `moodProfiles[]` shape (matches actual API)
- `STEP_NEXT` action addition (symmetric with STEP_BACK)
- Debug line proving Server→Client pipeline

## Do

### 1. Execute A.1 merge

```
git checkout main
git pull origin main
git merge --no-ff feat/intent-collector-scaffolding -m "Merge SP-F1 A.1: intent collector scaffolding"
git push origin main
git push origin --delete feat/intent-collector-scaffolding
git branch -d feat/intent-collector-scaffolding
```

### 2. Update backlog entry

Update the existing stale-cache pattern entry in
`docs/duffleup-backlog.md` to note the fifth occurrence:

```
- Dev server stale-cache pattern (FIFTH occurrence,
  2026-07-19): pattern conclusively documented as triggered by
  route additions (new route group segments) and first-time
  client dep imports (Radix Dialog imported for the first time
  in SP-F1 A.1). Add to project README or onboarding note:
  any new route + new client dep = `rm -rf .next && npm run dev`
  after the change lands. Consider adding to a git pre-merge
  check or documenting more prominently.
```

Commit as: `docs: log fifth occurrence of stale .next cache pattern`

Push to main.

### 3. Report

- A.1 merge commit hash
- CI status on main after A.1 merge push
- Backlog update commit hash

## Non-negotiables

- Do NOT modify any code beyond the backlog entry
- Do NOT start A.2 — Gaurav ships adjudications file first
