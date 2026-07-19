# SP-F0.C+D — Test Setup + CI

## Context

`duffleup-web` has no test infrastructure. SP-F1 and beyond
will build real user flows (booking, payment, form validation)
that need automated verification. Manual testing at every merge
becomes untenable as complexity grows.

F0.C+D establishes the test setup (Vitest + React Testing
Library) and CI enforcement (GitHub Actions running lint +
typecheck + test + build on every push).

The two go together — CI without tests is useless, tests
without CI erode when nobody runs them.

## Non-negotiables

- Do NOT modify any existing page or component beyond adding
  tests for existing behavior (F0.C+D adds infrastructure, not
  new functionality)
- Do NOT chase 100% coverage — this sprint proves the pattern
  with one utility test and one component test. Comprehensive
  coverage is post-launch backlog work.
- Do NOT introduce Playwright or E2E testing tools — Vitest +
  RTL for unit + component tests only in this sprint
- Do NOT add CI checks that don't exist yet (e.g., visual
  regression, bundle size gates) — lint + typecheck + test +
  build is the whole scope
- Scope frozen; new test tooling ideas get logged to backlog
- Report at every unexpected finding

## Prerequisite check

1. On `main`, working tree clean apart from expected untracked
   docs
2. `main` at F0.B merge HEAD (`641ca49` per your last report,
   or later after Vercel deploy)
3. `npm run lint && npm run typecheck && npm run build` pass
   on current main

If any fails, STOP and report.

## Design decisions locked

### 1. Vitest, not Jest

- Native ESM + TypeScript support (no Babel setup needed)
- Faster than Jest for typical Next.js projects
- Aligns with Vite ecosystem tooling
- Works well with Next.js App Router when configured for jsdom

### 2. React Testing Library (RTL) for component tests

- Industry standard for React component testing
- User-centric API (test what users see, not implementation
  details)
- Works cleanly with Vitest + jsdom

### 3. jsdom environment

- Fake DOM in Node for component rendering
- Alternative to happy-dom (which is faster but has more
  compat quirks)
- Vitest uses jsdom by default when configured

### 4. GitHub Actions, not Vercel checks or CircleCI

- Free for public repos, generous for private
- Native GitHub integration (PR status checks, required checks)
- Matches the CI approach already used in duffleup-api

### 5. CI runs: lint + typecheck + test + build

- All four run in one workflow
- Fail-fast: if lint fails, don't waste time on the rest
- Ubuntu runner (matches Vercel build env closely enough)
- Node 20 (matches .nvmrc if it exists, else Next.js
  recommended)
- npm ci for reproducible installs
- Cache node_modules for speed

### 6. Trigger: push to main + PR

- Every push to main runs the full workflow
- Every PR (opened, synchronize, reopened) runs the workflow
- Not on tag pushes (not using tags yet for releases)

## Do

### 1. Cut branch `feat/test-setup-and-ci` off `main`

### 2. Install Vitest + RTL + supporting deps

```
npm install --save-dev \
  vitest \
  @vitest/ui \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom
```

Notes:
- `@vitest/ui` provides `vitest --ui` for local test debugging
  (optional but useful; small footprint)
- `@testing-library/jest-dom` adds custom matchers like
  `toBeInTheDocument()`
- `@testing-library/user-event` for realistic user interaction
  simulation

If any dep has a Next.js 14 / React 18 compat issue, STOP and
report before proceeding. Do NOT pin to older versions
speculatively.

### 3. Create `vitest.config.ts` at repo root

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

May need `@vitejs/plugin-react` — install as devDep if not
already present:
```
npm install --save-dev @vitejs/plugin-react
```

Alternative: use `vite-tsconfig-paths` to auto-inherit tsconfig
paths. Choose the approach that reads cleaner.

### 4. Create `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom/vitest'
```

Adds RTL custom matchers to Vitest's global expect.

### 5. Add package.json scripts

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui",
  "test:ci": "vitest run --reporter=verbose"
}
```

Merge with existing scripts, don't overwrite.

### 6. Write ONE utility test

Pick a small pure function in the codebase (or create a minimal
one if none exist). Something like a formatter, validator, or
helper. Location suggestion: `src/lib/**/*.test.ts` alongside
the function.

Test that it returns expected outputs for expected inputs. 2-3
assertions.

If no natural candidate exists, create
`src/lib/format-price.ts` with a small function like:

```typescript
export function formatPrice(paise: number): string {
  const rupees = paise / 100
  return `₹${rupees.toLocaleString('en-IN')}`
}
```

And test:
```typescript
import { describe, it, expect } from 'vitest'
import { formatPrice } from './format-price'

describe('formatPrice', () => {
  it('formats basic amounts', () => {
    expect(formatPrice(800000)).toBe('₹8,000')
  })
  it('handles zero', () => {
    expect(formatPrice(0)).toBe('₹0')
  })
})
```

The utility should be plausibly used by SP-F1 later (booking
prices, calculation displays). Not dead code.

### 7. Write ONE component test

Pick an existing simple component. Suggestion: `Badge.tsx` if
it exists — small, testable, no complex data dependencies.

Test that it:
- Renders the tier label correctly
- Applies the right color class per tier
- Renders the star icon for the Rare tier only

Example location: `src/components/ui/Badge.test.tsx`

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders the tier label', () => {
    render(<Badge tier="raw" />)
    expect(screen.getByText(/raw/i)).toBeInTheDocument()
  })
  
  it('shows star for rare tier only', () => {
    const { rerender } = render(<Badge tier="raw" />)
    expect(screen.queryByTestId('rare-star')).not.toBeInTheDocument()
    
    rerender(<Badge tier="rare" />)
    expect(screen.getByTestId('rare-star')).toBeInTheDocument()
  })
})
```

Adapt to the actual `Badge` component's API. If star icon
doesn't have a `data-testid`, add one — small acceptable
tweak to the component.

If Badge doesn't exist, pick another simple component. Report
which you chose.

### 8. Create `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Typecheck
        run: npm run typecheck
      
      - name: Test
        run: npm run test:ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: https://api.duffleup.in/api/v1
```

Notes:
- `NEXT_PUBLIC_API_URL` in env for build — needed so build
  doesn't fail on missing var
- Uses prod backend URL for CI builds (build doesn't fetch,
  just needs URL for the string)
- Node 20 (Next.js 14 supported version)

### 9. Verify locally

Before pushing:
- `npm run lint` clean
- `npm run typecheck` clean
- `npm run test` — both tests pass
- `npm run build` succeeds
- All 8 routes still static

### 10. Push branch and report

Report:
- Commit hash
- Deps installed (list them)
- Test file names and what they test
- Any deviation from the design decisions above
- Whether Badge component test approach worked or a different
  component was chosen
- CI workflow file location

**Commit:** `feat: add Vitest + RTL test setup and GitHub Actions CI`

Push. HOLD for Gaurav's visual review authorization.

## Post-push CI verification

Once pushed, the GitHub Actions workflow will run on the branch
push. Gaurav can verify at:
`https://github.com/duffleup-in/duffleup-web/actions`

Look for the workflow named "CI" running against the branch
commit. Expected states:
- Green ✓ = all four steps passed (lint, typecheck, test, build)
- Red ✗ = report which step failed

If CI fails on the branch, fix on the branch before merging.

## Visual review (Gaurav will run)

```
cd C:\Code\duffleup\duffleup-web
git fetch
git checkout feat/test-setup-and-ci
git pull
npm install         # install new devDeps
npm run test        # verify tests pass locally
npm run dev
```

Browser check:
- All 8 pages still render (no regressions)
- No console errors

Then check GitHub Actions:
- `https://github.com/duffleup-in/duffleup-web/actions`
- Latest run on `feat/test-setup-and-ci` is green

If both clean, merge:
```
git checkout main
git pull origin main
git merge --no-ff feat/test-setup-and-ci -m "Merge SP-F0.C+D: test setup and CI"
git push origin main
git push origin --delete feat/test-setup-and-ci
git branch -d feat/test-setup-and-ci
```

## Backlog entries

Add to `docs/duffleup-backlog.md`:

```
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
```

## Escalate before doing

- Vitest install fails or has Next.js 14 compat issues
- No existing simple pure function to test (all utils involve
  React/DOM)
- Badge component doesn't exist or has complex data
  dependencies
- CI workflow fails on the branch push for a non-obvious
  reason
- Any deviation from the intended design that has broader
  implications

## Standing rules

- Scope frozen. New test tooling / patterns get logged to
  `docs/post-foundation-day-backlog.md`.
- No PR opened; Gaurav directs merges.
- Report at every unexpected finding.
