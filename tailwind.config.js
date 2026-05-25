/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        quran: {
          primary: '#40674D',
          primaryHover: '#355840',
          deep: '#2d4a38',
          header: '#40674D',
          gold: '#D1A93B',
          goldHover: '#b8922f',
          goldLight: '#f5edd4',
          goldSoft: '#ebe0c4',
          cream: '#f4f6f3',
          mint: '#c8e6d9',
          mintSoft: '#e8f4ee',
          mintDark: '#9ec9b3',
          surface: '#ffffff',
          border: '#d8e2db',
          muted: '#5c6b61',
          text: '#1e2a23',
          navy: '#1e2a23',
          menuDark: '#283932',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      fontSize: {
        'ui-sm': ['16px', { lineHeight: '24px' }],
        'ui-md': ['20px', { lineHeight: '32px' }],
        'ui-lg': ['24px', { lineHeight: '38px' }],
        'ui-xl': ['32px', { lineHeight: '52px' }],
      },
      boxShadow: {
        card: '0 2px 8px rgba(64, 103, 77, 0.08)',
        'card-hover': '0 8px 24px rgba(64, 103, 77, 0.14)',
        menu: '0 8px 32px rgba(0, 0, 0, 0.28)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
