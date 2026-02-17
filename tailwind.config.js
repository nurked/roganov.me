/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'surface-base': '#0A0F1A',
        'surface-card': '#111827',
        'surface-elevated': '#1F2937',
        'brand': '#0F67B1',
        'brand-light': '#3B82F6',
        'brand-accent': '#22D3EE',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        blink: 'blink 4s steps(2, start) infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      boxShadow: {
        'glow': '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)',
        'brand': '0 4px 30px rgba(15, 103, 177, 0.3)',
      },
      textColor: {
        glow: 'rgba(255, 255, 255, 0.8)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(1.5)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function({ addUtilities }) {
      addUtilities({
        '.text-gradient': {
          'background': 'linear-gradient(135deg, #3B82F6, #22D3EE)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
      });
    }),
  ],
}
