/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#153726', mid: '#1e4d34', light: '#2f6b45' },
        sage: '#6ea87e',
        cream: { DEFAULT: '#fdfdfb', 2: '#f1f5f2' },
        parchment: '#eaf1ec',
        gold: { DEFAULT: '#c08a3e', light: '#dba766' },
        charcoal: '#0f2118',
        text: { DEFAULT: '#152019', muted: '#5c6b62' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
