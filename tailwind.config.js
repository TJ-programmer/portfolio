/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05060A',
        cyan: '#7CFFCB',
        violet: '#8A5CF6',
        muted: '#A0AEC0',
        surface: '#0D0E14',
      },
      fontFamily: {
        display: ['Clash Display', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
