import { describe, it, expect } from 'vitest'
import {
  intentReducer,
  initialIntentState,
  makeInitialState,
} from './intent-state'

describe('makeInitialState', () => {
  it('starts at the mood step with no preselection', () => {
    expect(makeInitialState()).toEqual(initialIntentState)
  })

  it('starts at the sub step when a mood is preselected', () => {
    const state = makeInitialState('ROMANCE')
    expect(state.step).toBe('sub')
    expect(state.mood).toBe('ROMANCE')
  })

  it('leaves the remaining fields at their defaults', () => {
    const state = makeInitialState('BASH')
    expect(state.sub).toBeNull()
    expect(state.checkin).toBeNull()
    expect(state.checkout).toBeNull()
    expect(state.adults).toBe(1)
    expect(state.children).toBe(0)
    expect(state.infants).toBe(0)
  })

  it('does not mutate the shared initial state', () => {
    makeInitialState('PETS')
    expect(initialIntentState.step).toBe('mood')
    expect(initialIntentState.mood).toBeNull()
  })
})

describe('intentReducer', () => {
  it('advances to the sub step on SELECT_MOOD', () => {
    const state = intentReducer(initialIntentState, {
      type: 'SELECT_MOOD',
      mood: 'CHILL',
    })
    expect(state).toMatchObject({ step: 'sub', mood: 'CHILL' })
  })

  it('advances to the dates step on SELECT_SUB', () => {
    const state = intentReducer(makeInitialState('CHILL'), {
      type: 'SELECT_SUB',
      sub: 'solo',
    })
    expect(state).toMatchObject({ step: 'dates', sub: 'solo' })
  })

  it('preserves the selection when stepping back', () => {
    const chosen = intentReducer(initialIntentState, {
      type: 'SELECT_MOOD',
      mood: 'ADVENTURE',
    })
    const back = intentReducer(chosen, { type: 'STEP_BACK' })
    expect(back.step).toBe('mood')
    expect(back.mood).toBe('ADVENTURE')
  })

  it('advances to guests and records the range on SET_DATES', () => {
    const checkin = new Date('2026-08-05T00:00:00Z')
    const checkout = new Date('2026-08-08T00:00:00Z')
    const state = intentReducer(makeInitialState('CHILL'), {
      type: 'SET_DATES',
      checkin,
      checkout,
    })
    expect(state).toMatchObject({ step: 'guests', checkin, checkout })
  })

  it('mutates guest counts in place without changing the step', () => {
    const base = { ...initialIntentState, step: 'guests' as const }
    const adults = intentReducer(base, { type: 'SET_ADULTS', count: 3 })
    expect(adults).toMatchObject({ step: 'guests', adults: 3 })

    const children = intentReducer(adults, { type: 'SET_CHILDREN', count: 2 })
    expect(children).toMatchObject({ step: 'guests', adults: 3, children: 2 })

    const infants = intentReducer(children, { type: 'SET_INFANTS', count: 1 })
    expect(infants).toMatchObject({ step: 'guests', adults: 3, children: 2, infants: 1 })
  })
})
