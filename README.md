# Quran Kareem

A React app to read and listen to the Holy Quran — all 114 surahs with Arabic text, translation, tafsir, and audio recitation.

**Live site:** [https://eslamemam1.github.io/The-Holy-Quran-/](https://eslamemam1.github.io/The-Holy-Quran-/)

## Project structure

```
src/
├── app/                    # App shell, routes, global styles
│   ├── App.js
│   └── App.css
├── pages/                  # Route-level screens
│   ├── Home.js
│   └── SurahReader.js      # Reading + Verse-by-Verse modes (Quran.com-style)
├── components/
│   ├── layout/             # Navbar, footer, scroll behavior
│   ├── ui/                 # Reusable UI (buttons, spinners, search)
│   └── quran/              # Quran-specific (bookmarks, picker, play)
├── context/                # React context (data, cache, navigation)
│   └── QuranContext.js
├── utils/                  # Helpers (localStorage, surah/ayah clamping)
│   └── storage.js
├── assets/
│   └── images/             # Icons, backgrounds, UI images
├── styles/
│   └── index.css           # Tailwind + global CSS
├── index.js                # Entry point
├── reportWebVitals.js
└── setupTests.js
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm test` | Run tests |

## Features

- Browse and search all 114 surahs
- Full surah view and ayah-by-ayah mode
- Audio recitation (full surah and per-ayah)
- Bookmarks and continue reading (saved in browser)
- **Reading mode** & **Verse by Verse** (like [Quran.com](https://quran.com/1?readingMode=arabic))
- Mushaf page breaks inside Reading mode
- Shareable URLs: `/surah/36/reading/page/3`, `/surah/36/verse/5`
- Cached surah data for faster navigation
- **Arabic / English UI** with RTL layout and language toggle (saved in browser)

## Tech stack

- React 18, React Router 6
- Tailwind CSS
- [quran-endpoint](https://quran-endpoint.vercel.app) API
- GitHub Pages (`gh-pages`)
