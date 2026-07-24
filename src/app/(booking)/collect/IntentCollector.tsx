'use client'

import { useEffect, useReducer, useRef } from 'react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type {
  MoodContextConfig,
  MoodKey,
  MoodProfileConfig,
} from '@/lib/api/types/mood-config'
import {
  intentReducer,
  makeInitialState,
  STEP_ORDER,
  type Step,
} from '@/lib/moods/intent-state'
import { buildSearchUrl } from '@/lib/moods/build-search-url'
import { moodKeyToLower } from '@/lib/moods/normalize'
import { MoodGrid, moodDisplayName } from '@/components/booking/MoodGrid'
import { SubContextGrid, tagKeyToSub } from '@/components/booking/SubContextGrid'
import { DatePickerStep } from '@/components/booking/DatePickerStep'
import { GuestStepper } from '@/components/booking/GuestStepper'

type IntentCollectorProps = {
  moods: MoodProfileConfig[]
  contexts: MoodContextConfig[]
  /** Set when opened from a home-page mood tile — starts at Step 2. */
  preselectedMood?: MoodKey
  onClose: () => void
}

/** Progress indicator names (decisions 9 / 11). */
const STEP_NAMES: Record<Step, string> = {
  mood: 'Mood',
  sub: 'Vibe',
  dates: 'Dates',
  guests: 'Guests',
}

const STEP_DESCRIPTIONS: Record<Step, string> = {
  mood: 'Six ways to spend a weekend. Start with how you want to feel.',
  sub: 'Narrow it down — or see everything and filter later.',
  dates: 'Pick your nights — or skip ahead and browse.',
  guests: "Who's making the trip?",
}

/**
 * The collector's step machine and content. Rendered inside
 * IntentCollectorModal's Dialog.Content, which unmounts on close — that unmount
 * is what resets the flow to Step 1 (design decision 7).
 */
export function IntentCollector({
  moods,
  contexts,
  preselectedMood,
  onClose,
}: IntentCollectorProps) {
  const router = useRouter()
  const [state, dispatch] = useReducer(
    intentReducer,
    preselectedMood,
    makeInitialState
  )

  const stepIndex = STEP_ORDER.indexOf(state.step)
  const isFirst = stepIndex === 0

  const activeProfile = moods.find((m) => m.mood === state.mood) ?? null
  const activeContexts = state.mood
    ? contexts.filter((c) => c.mood === state.mood)
    : []

  // Prefill adults from the selected sub-context's defaultGuests, but exactly
  // once per session and only if the user hasn't touched the count — so a
  // dates↔guests bounce never clobbers their edits (decision 9, A.2 backlog).
  const prefilledRef = useRef(false)
  useEffect(() => {
    if (state.step !== 'guests' || prefilledRef.current) return
    prefilledRef.current = true
    // Derive from the stable `contexts` prop (not the per-render activeContexts
    // array) so the effect deps stay referentially stable.
    const selected = contexts.find(
      (c) => c.mood === state.mood && tagKeyToSub(c.tagKey) === state.sub
    )
    if (selected?.defaultGuests != null) {
      dispatch({ type: 'SET_ADULTS', count: selected.defaultGuests })
    }
  }, [state.step, state.mood, state.sub, contexts])

  // Skip / submit bypass the reducer (A.2 pattern): route and close, leaving no
  // half-finished state behind. Step 2 skip carries mood only; Step 3 skip adds
  // sub; Step 4 submit serializes the full intent (decision 10).
  const routeToProperties = (query: string) => {
    onClose()
    router.push(`/properties?${query}`)
  }

  const handleSkipMoodOnly = (mood: MoodKey) => {
    routeToProperties(`mood=${moodKeyToLower(mood)}`)
  }

  const handleSkipFromDates = () => {
    const params = new URLSearchParams()
    if (state.mood) params.set('mood', moodKeyToLower(state.mood))
    if (state.sub) params.set('sub', state.sub)
    routeToProperties(params.toString())
  }

  const handleSubmit = () => {
    onClose()
    router.push(buildSearchUrl(state))
  }

  const title =
    state.step === 'mood'
      ? 'Pick your mood'
      : state.step === 'sub'
        ? (activeProfile?.contextCopy ?? 'Narrow it down')
        : state.step === 'dates'
          ? 'When?'
          : "Who's coming?"

  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="font-utility text-caption uppercase tracking-[0.15em] text-white/60">
          Step {stepIndex + 1} of {STEP_ORDER.length} · {STEP_NAMES[state.step]}
        </span>
        <Dialog.Close
          aria-label="Close"
          className="-mt-1 text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
        >
          <X size={20} />
        </Dialog.Close>
      </div>

      <Dialog.Title className="font-display text-h6 leading-tight sm:text-h5">
        {title}
      </Dialog.Title>

      <Dialog.Description className="mt-2 text-subtitle text-white/60">
        {STEP_DESCRIPTIONS[state.step]}
      </Dialog.Description>

      <div className="mt-6">
        {state.step === 'mood' && (
          <MoodGrid
            moods={moods}
            selected={state.mood}
            onSelect={(mood) => dispatch({ type: 'SELECT_MOOD', mood })}
          />
        )}

        {state.step === 'sub' && state.mood && (
          <SubContextGrid
            contexts={activeContexts}
            moodKey={state.mood}
            selected={state.sub}
            onSelect={(sub) => dispatch({ type: 'SELECT_SUB', sub })}
            onSkip={handleSkipMoodOnly}
          />
        )}

        {state.step === 'dates' && (
          <DatePickerStep
            checkin={state.checkin}
            checkout={state.checkout}
            onRangeChange={({ checkin, checkout }) =>
              dispatch({ type: 'SET_DATES', checkin, checkout })
            }
            onSkip={handleSkipFromDates}
          />
        )}

        {state.step === 'guests' && (
          <GuestStepper
            adults={state.adults}
            childrenCount={state.children}
            infants={state.infants}
            onAdultsChange={(count) => dispatch({ type: 'SET_ADULTS', count })}
            onChildrenChange={(count) => dispatch({ type: 'SET_CHILDREN', count })}
            onInfantsChange={(count) => dispatch({ type: 'SET_INFANTS', count })}
            onSubmit={handleSubmit}
            moodName={moodDisplayName(state.mood ?? 'CHILL')}
          />
        )}
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => dispatch({ type: 'STEP_BACK' })}
          disabled={isFirst}
          className="rounded-pill border border-white/25 px-5 py-2 font-utility uppercase tracking-[0.15em] transition-colors hover:border-acid hover:text-acid disabled:opacity-40 disabled:hover:border-white/25 disabled:hover:text-white"
        >
          ← Back
        </button>
      </div>
    </>
  )
}
