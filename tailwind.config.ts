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
        // Brand (designer-locked)
        hyperpurple: { DEFAULT: '#7B2FFF', 90: '#8A47FF', 75: '#A876FF', 50: '#BDA0FF', 25: '#DECCFF', 5: '#F4EDFF' },
        'slap-pink': { DEFAULT: '#FF1B8D', 75: '#FF5BAA', 50: '#FF8BC4', 25: '#FFC5E2' },
        acid: { DEFAULT: '#CCFF00', 90: '#D2FF1A', 75: '#DBFF5B', dark: '#99CC00' },
        plasma: { DEFAULT: '#00D0FF' },
        solar: { DEFAULT: '#FF6B00' },
        sterling: { DEFAULT: '#DEDED9', warm: '#FAFAF8' },
        pitch: { DEFAULT: '#0A0A0A', soft: '#2A2A2A' },
        // Mood-specific (pets uses its own pink)
        pets: '#FF6FBC',
        // Hairlines
        line: { DEFAULT: 'rgba(10,10,10,0.1)', strong: 'rgba(10,10,10,0.2)' },
        // Alerts
        success: { DEFAULT: '#1FC156', bg: '#E4F8EC' },
        info: { DEFAULT: '#3266FF', bg: '#E5EBFF' },
        warning: { DEFAULT: '#F5B339', bg: '#FDF1DC' },
        danger: { DEFAULT: '#FF0000', bg: '#FFE5E5' },
      },
      fontFamily: {
        display: ['var(--font-bungee)', 'Impact', 'sans-serif'],
        utility: ['var(--font-bebas)', 'Impact', 'Arial Narrow Bold', 'sans-serif'],
        body: ['Arial', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        h1: ['96px', { lineHeight: '1' }],
        h2: ['64px', { lineHeight: '1' }],
        h3: ['48px', { lineHeight: '1.1' }],
        h4: ['40px', { lineHeight: '1.1' }],
        h5: ['32px', { lineHeight: '1.2' }],
        h6: ['24px', { lineHeight: '1.2' }],
        subh: ['18px', { lineHeight: '1.4' }],
        body: ['16px', { lineHeight: '1.5' }],
        subtitle: ['14px', { lineHeight: '1.5' }],
        caption: ['12px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        xsm: '4px', sm: '12px', md: '16px', lg: '24px', xl: '70px', pill: '999px',
      },
      boxShadow: {
        xsm: '0 1px 2px rgba(10,10,10,0.04)',
        sm: '0 2px 4px rgba(10,10,10,0.06)',
        md: '0 4px 12px rgba(10,10,10,0.08)',
        lg: '0 8px 24px rgba(10,10,10,0.12)',
        xl: '0 16px 48px rgba(10,10,10,0.16)',
        pop: '6px 6px 0 #0A0A0A',
        'pop-lg': '10px 10px 0 #0A0A0A',
      },
      // Intent collector modal: mobile presents as a bottom sheet (SP-F1 A.2
      // decision 10). Desktop keeps its centered transform, so the slide is
      // disabled from `sm` up.
      keyframes: {
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'sheet-up': 'sheet-up 220ms cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fade-in 150ms ease-out',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at 65% 50%, #FF1B8D 0%, #7B2FFF 40%, #5818CC 90%)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
