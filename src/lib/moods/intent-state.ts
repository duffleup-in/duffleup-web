import type { MoodKey } from '@/lib/api/types/mood-config'

/**
 * Intent Collector modal state (SP-F1 Phase A). During the modal flow state
 * lives here in a reducer; on submit it is serialized to URL params
 * (see build-search-url.ts) and the user routes to /properties.
 */
export type Step = 'mood' | 'sub' | 'dates' | 'guests'

/** Ordered steps — drives progress indicator and back/next navigation. */
export const STEP_ORDER: Step[] = ['mood', 'sub', 'dates', 'guests']

export type IntentState = {
  step: Step
  mood: MoodKey | null
  sub: string | null
  checkin: Date | null
  checkout: Date | null
  adults: number
  children: number
}

export type IntentAction =
  | { type: 'SELECT_MOOD'; mood: MoodKey }
  | { type: 'SELECT_SUB'; sub: string }
  | { type: 'SET_DATES'; checkin: Date; checkout: Date }
  | { type: 'SET_GUESTS'; adults: number; children: number }
  | { type: 'STEP_NEXT' }
  | { type: 'STEP_BACK' }
  | { type: 'RESET' }

export const initialIntentState: IntentState = {
  step: 'mood',
  mood: null,
  sub: null,
  checkin: null,
  checkout: null,
  adults: 1,
  children: 0,
}

/**
 * Builds the reducer's starting state. The collector opens at Step 1 from the
 * hero CTA, but home-page mood tiles open it at Step 2 with that mood already
 * chosen — pass `preselectedMood` for that entry point.
 */
export const makeInitialState = (preselectedMood?: MoodKey): IntentState => ({
  ...initialIntentState,
  step: preselectedMood ? 'sub' : 'mood',
  mood: preselectedMood ?? null,
})

function stepAt(current: Step, delta: number): Step {
  const i = STEP_ORDER.indexOf(current)
  const next = Math.min(Math.max(i + delta, 0), STEP_ORDER.length - 1)
  return STEP_ORDER[next]
}

export function intentReducer(
  state: IntentState,
  action: IntentAction
): IntentState {
  switch (action.type) {
    case 'SELECT_MOOD':
      return { ...state, mood: action.mood, step: 'sub' }
    case 'SELECT_SUB':
      return { ...state, sub: action.sub, step: 'dates' }
    case 'SET_DATES':
      return {
        ...state,
        checkin: action.checkin,
        checkout: action.checkout,
        step: 'guests',
      }
    case 'SET_GUESTS':
      return { ...state, adults: action.adults, children: action.children }
    case 'STEP_NEXT':
      return { ...state, step: stepAt(state.step, 1) }
    case 'STEP_BACK':
      return { ...state, step: stepAt(state.step, -1) }
    case 'RESET':
      return initialIntentState
    default:
      return state
  }
}
