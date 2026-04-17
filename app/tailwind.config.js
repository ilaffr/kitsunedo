/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Ghost of Yotei palette
        ink: {
          DEFAULT: '#1a1a2e',
          light: '#16213e',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c97a',
          dark: '#a07830',
        },
        mist: {
          DEFAULT: '#e8e4d9',
          dark: '#c4bfb0',
        },
        fox: {
          DEFAULT: '#d4522a',
          light: '#e8754d',
        },
        sage: {
          DEFAULT: '#4a7c59',
          light: '#6ba87a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        jp: ['var(--font-noto-jp)', 'serif'],
      },
    },
  },
  plugins: [],
}
