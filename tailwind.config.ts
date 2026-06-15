import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Quiet Luxury Clear Mode Palette
        'nexus': {
          'white': '#FFFFFF',
          'ivory': '#F9F8FC',
          'lavender': '#EADCF9',
          'gold': '#E2B659',
          'amethyst': '#2A1A4A',
          'platinum': '#EEE9F5',
        }
      },
      fontFamily: {
        'serif': ['Cormorant Garamond', 'Editorial New', 'serif'],
        'sans': ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        'display': ['28px', { lineHeight: '1.2' }],
        'h1': ['24px', { lineHeight: '1.2' }],
        'h2': ['20px', { lineHeight: '1.3' }],
        'body': ['16px', { lineHeight: '1.5' }],
        'caption': ['14px', { lineHeight: '1.4' }],
      },
      spacing: {
        'mobile-edge': '16px',
      },
      borderRadius: {
        'ios': '8px',
      },
      animation: {
        'silk-in': 'silkIn 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-pop': 'scalePop 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        silkIn: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scalePop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      backdropFilter: {
        'blur-glass': 'blur(20px)',
      },
    },
  },
  plugins: [],
}
export default config
