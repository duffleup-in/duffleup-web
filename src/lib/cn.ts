import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Our Tailwind theme adds custom fontSize tokens (text-h1…text-caption, text-subh,
// text-body, text-subtitle). tailwind-merge doesn't know these are font sizes, so
// by default it lumps e.g. `text-subtitle` into the text-color group and lets it
// clobber `text-acid` (or vice-versa). Register them as font-size so size and
// colour stop colliding.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subh', 'body', 'subtitle', 'caption'],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
