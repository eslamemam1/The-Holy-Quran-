/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        quran: {
          navy: '#0f1729',
          primary: '#151f64',
          deep: '#14203f',
          gold: '#c9a227',
          cream: '#faf8f3',
          muted: '#64748b',
        },
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(15, 23, 41, 0.08)',
        'card-hover': '0 8px 30px rgba(21, 31, 100, 0.15)',
      },
    },
  },
  plugins: [],
};
