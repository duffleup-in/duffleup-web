import Image from 'next/image'
import { cn } from '@/lib/cn'

type LogoSize = 'nav' | 'bleed-xl' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'hero'
type LogoProps = { size?: LogoSize; className?: string; priority?: boolean }

// Widths. `nav` (64) renders the 48px-tall contained mark; `bleed-xl` (240) is
// the oversized top-of-page anchor (180px tall). The rest are the v0.4
// .dup-logo-img--* sizes.
const sizes: Record<LogoSize, number> = {
  nav: 64,
  'bleed-xl': 240,
  xxs: 90,
  xs: 120,
  sm: 180,
  md: 320,
  lg: 480,
  hero: 720,
}

// Real asset viewBox is 1024x768 -> intrinsic aspect ratio 0.75. Using the
// true ratio keeps the wordmark undistorted on every surface.
const ASPECT = 768 / 1024

export function Logo({ size = 'md', className, priority }: LogoProps) {
  const width = sizes[size]
  return (
    <Image
      src="/duffleup-logo.svg"
      alt="duffleup"
      width={width}
      height={Math.round(width * ASPECT)}
      priority={priority ?? size === 'hero'}
      className={cn('block h-auto w-full max-w-full', className)}
      style={{ maxWidth: width }}
    />
  )
}
