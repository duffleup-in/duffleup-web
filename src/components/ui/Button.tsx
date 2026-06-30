import * as React from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'secondary-dark'
  | 'ghost'
  | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Render as the single child element (e.g. a Next.js <Link>) instead of <button>. */
  asChild?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 font-utility uppercase tracking-[0.1em] font-normal no-underline rounded-sm transition-all duration-150 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-acid text-pitch hover:bg-acid-dark hover:-translate-y-px disabled:bg-acid/40 disabled:text-pitch/50 disabled:translate-y-0',
  secondary:
    'bg-transparent text-acid border-2 border-acid hover:bg-acid hover:text-pitch',
  'secondary-dark':
    'bg-transparent text-pitch border-2 border-pitch hover:bg-pitch hover:text-acid',
  ghost: 'bg-transparent text-pitch hover:text-hyperpurple',
  destructive: 'bg-slap-pink text-white hover:bg-[#E0156F]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'text-subtitle px-[18px] py-[10px]',
  md: 'text-subh px-7 py-[14px]',
  lg: 'text-[22px] px-9 py-[18px]',
}

// Ghost has its own horizontal padding per the v0.4 spec.
const ghostSizes: Record<ButtonSize, string> = {
  sm: 'text-subtitle px-2 py-[10px]',
  md: 'text-subh px-2 py-[14px]',
  lg: 'text-[22px] px-2 py-[18px]',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    const sizeClass = variant === 'ghost' ? ghostSizes[size] : sizes[size]
    const classes = cn(base, variants[variant], sizeClass, className)

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      })
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
