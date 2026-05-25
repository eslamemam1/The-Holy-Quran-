/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        quran: {
          navy: '#0f1729',
          primary: '#1b8354',
          primaryHover: '#156b44',
          deep: '#0d5c3a',
          gold: '#c9a227',
          cream: '#f7f8f7',
          surface: '#ffffff',
          border: '#e1e4e1',
          muted: '#6b7280',
          text: '#232323',
        },
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(27, 131, 84, 0.12)',
      },
    },
  },
  plugins: [],
};
