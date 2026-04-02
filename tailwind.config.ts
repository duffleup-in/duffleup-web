import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2D4A3E',
          light: '#3D6455',
          dark: '#1E3229',
        },
        terracotta: {
          DEFAULT: '#C4622D',
          light: '#D97B48',
          dark: '#A04E22',
        },
        sand: {
          DEFAULT: '#E8C080',
          light: '#F2D9A8',
          dark: '#CFA054',
        },
        cream: '#FAF5ED',
        stone: '#8B7355',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        dm: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
