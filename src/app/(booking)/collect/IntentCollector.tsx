'use client'

import { useEffect, useReducer } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { MoodProfileConfig } from '@/lib/api/types/mood-config'
import {
  intentReducer,
  initialIntentState,
  STEP_ORDER,
  type Step,
} from '@/lib/moods/intent-state'

type IntentCollectorProps = {
  /** Live mood profiles from getMoodConfig(). Rendered as real tiles in A.2. */
  moods: MoodProfileConfig[]
}

// Placeholder step labels — real UI (mood grid, date picker, guest counter)
// arrives in A.2/A.3. A.1 only proves the shell, state machine, and navigation.
const STEP_LABELS: Record<Step, string> = {
  mood: 'Step 1: Mood',
  sub: 'Step 2: Sub-context',
  dates: 'Step 3: Dates',
  guests: 'Step 4: Guests',
}

export function IntentCollector({ moods }: IntentCollectorProps) {
  const [state, dispatch] = useReducer(intentReducer, initialIntentState)

  // Debug aid (design decision: console.log state on transitions).
  useEffect(() => {
    console.log('[IntentCollector] state', state)
  }, [state])

  const stepIndex = STEP_ORDER.indexOf(state.step)
  const isFirst = stepIndex === 0
  const isLast = stepIndex === STEP_ORDER.length - 1

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Dialog.Root
        onOpenChange={(open) => {
          // Reset to Step 1 whenever the modal closes so reopening starts fresh.
          if (!open) dispatch({ type: 'RESET' })
        }}
      >
        <Dialog.Trigger className="rounded-pill bg-acid px-6 py-3 font-utility uppercase tracking-[0.15em] text-pitch">
          Open collector
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-pitch p-6 text-white">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-utility text-caption uppercase tracking-[0.15em] text-white/60">
                {stepIndex + 1} of {STEP_ORDER.length}
              </span>
              <Dialog.Close aria-label="Close" className="text-white/60 hover:text-white">
                <X size={20} />
              </Dialog.Close>
            </div>

            <Dialog.Title className="text-h5 font-display">
              {STEP_LABELS[state.step]}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-body text-white/60">
              Placeholder step. Real UI arrives in A.2 / A.3. Loaded {moods.length}{' '}
              mood profiles.
            </Dialog.Description>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => dispatch({ type: 'STEP_BACK' })}
                disabled={isFirst}
                className="rounded-pill border border-line px-5 py-2 font-utility uppercase tracking-[0.15em] disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'STEP_NEXT' })}
                disabled={isLast}
                className="rounded-pill bg-acid px-5 py-2 font-utility uppercase tracking-[0.15em] text-pitch disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}
