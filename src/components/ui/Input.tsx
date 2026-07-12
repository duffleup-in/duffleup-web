import * as React from 'react'
import { cn } from '@/lib/cn'

type InputState = 'default' | 'validating' | 'success' | 'error'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  helperText?: string
  state?: InputState
}

const stateBorders: Record<InputState, string> = {
  default: 'border-line-strong',
  validating: 'border-warning',
  success: 'border-success',
  error: 'border-danger',
}

const helperColors: Record<InputState, string> = {
  default: 'text-pitch-soft',
  validating: 'text-warning',
  success: 'text-success',
  error: 'text-danger',
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, state = 'default', id, disabled, ...props }, ref) => {
    const inputId = id ?? props.name
    return (
      <div className="flex max-w-[400px] flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-utility text-subtitle uppercase tracking-[0.1em] text-pitch"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={state === 'error' || undefined}
          className={cn(
            'rounded-sm border-2 bg-white px-4 py-[14px] font-body text-body text-pitch transition-colors duration-150',
            'hover:enabled:border-hyperpurple-75 focus:border-hyperpurple focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-sterling disabled:text-pitch-soft',
            stateBorders[state],
            className
          )}
          {...props}
        />
        {helperText && (
          <p className={cn('text-[13px]', helperColors[state])}>{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
