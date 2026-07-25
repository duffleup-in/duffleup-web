import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// The page is a Server Component that fetches; stub the data layer so the test
// stays a pure render check (real fetch is covered in properties.test.ts).
vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/api')>('@/lib/api')
  return {
    ...actual,
    getProperties: vi.fn(async () => ({
      data: [{ displayName: 'Waterrock' }, { displayName: 'Twin Villa' }],
      meta: { total: 2, page: 1, limit: 3, totalPages: 1, sortedBy: 'mood' },
    })),
  }
})

import PropertiesPage from './page'

describe('PropertiesPage (B.1 scaffold)', () => {
  it('renders parsed intent params and the backend result count', async () => {
    const ui = await PropertiesPage({
      searchParams: {
        mood: 'chill',
        sub: 'solo',
        checkin: '2026-08-05',
        checkout: '2026-08-08',
        adults: '2',
        children: '0',
        infants: '0',
      },
    })
    render(ui)

    expect(screen.getByText(/B\.1 debug scaffold/i)).toBeInTheDocument()
    // Parsed params + mapped DTO + result are all dumped as JSON.
    expect(screen.getByText(/"mood": "chill"/)).toBeInTheDocument()
    expect(screen.getByText(/"moods":/)).toBeInTheDocument()
    expect(screen.getByText(/"total": 2/)).toBeInTheDocument()
    expect(screen.getByText(/Waterrock/)).toBeInTheDocument()
  })

  it('renders a fetch-failure message instead of throwing', async () => {
    const api = await import('@/lib/api')
    vi.mocked(api.getProperties).mockRejectedValueOnce(new Error('boom'))

    const ui = await PropertiesPage({ searchParams: {} })
    render(ui)

    expect(screen.getByText(/Fetch failed: boom/)).toBeInTheDocument()
  })
})
