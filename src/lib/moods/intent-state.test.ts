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
})
