'use client'

import { useReducer } from 'react'
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
import { moodKeyToLower } from '@/lib/moods/normalize'
import { MoodGrid, moodDisplayName } from '@/components/booking/MoodGrid'
import { SubContextGrid } from '@/components/booking/SubContextGrid'

type IntentCollectorProps = {
  moods: MoodProfileConfig[]
  contexts: MoodContextConfig[]
  /** Set when opened from a home-page mood tile — starts at Step 2. */
  preselectedMood?: MoodKey
  onClose: () => void
}

/** Progress indicator names (design decision 9). Steps 3–4 land in A.3. */
const STEP_NAMES: Record<Step, string> = {
  mood: 'Mood',
  sub: 'Vibe',
  dates: 'Dates',
  guests: 'Guests',
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
  const isPlaceholderStep = state.step === 'dates' || state.step === 'guests'

  const activeProfile = moods.find((m) => m.mood === state.mood) ?? null
  const activeContexts = state.mood
    ? contexts.filter((c) => c.mood === state.mood)
    : []

  // Skip-to-search bypasses the reducer entirely (A.2 brief §5, simpler
  // alternative): navigate and close, leaving no half-finished state behind.
  const handleSkip = (mood: MoodKey) => {
    onClose()
    router.push(`/properties?mood=${moodKeyToLower(mood)}`)
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
        {state.step === 'mood'
          ? 'Six ways to spend a weekend. Start with how you want to feel.'
          : state.step === 'sub'
            ? 'Narrow it down — or see everything and filter later.'
            : 'Placeholder step. Dates and guests arrive in A.3.'}
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
            onSkip={handleSkip}
          />
        )}

        {isPlaceholderStep && (
          <p className="text-body text-white/40">
            {moodDisplayName(state.mood ?? 'CHILL')} · {state.sub} — real
            controls arrive in A.3.
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-between gap-4">
        <button
          type="button"
          onClick={() => dispatch({ type: 'STEP_BACK' })}
          disabled={isFirst}
          className="rounded-pill border border-white/25 px-5 py-2 font-utility uppercase tracking-[0.15em] transition-colors hover:border-acid hover:text-acid disabled:opacity-40 disabled:hover:border-white/25 disabled:hover:text-white"
        >
          ← Back
        </button>

        {isPlaceholderStep && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'STEP_NEXT' })}
            disabled={state.step === 'guests'}
            className="rounded-pill bg-acid px-5 py-2 font-utility uppercase tracking-[0.15em] text-pitch transition-opacity disabled:opacity-40"
          >
            Next
          </button>
        )}
      </div>
    </>
  )
}
