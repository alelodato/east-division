/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,jsx,mdx}',
    './components/**/*.{js,jsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-bebas)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        brand: {
          black: '#0a0a0a',
          white: '#f5f5f0',
          grey: '#8a8a8a',
          accent: '#c8ff00',
        },
      },
      letterSpacing: {
        widest: '0.3em',
      },
    },
  },
  plugins: [],
}

module.exports = config
