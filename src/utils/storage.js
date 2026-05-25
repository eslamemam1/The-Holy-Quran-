const KEYS = {
  LAST_READ: 'quran_last_read',
  BOOKMARKS: 'quran_bookmarks',
};

const defaultLastRead = {
  surah: 1,
  ayah: 1,
  view: 'reading',
  mushafPage: 1,
};

export function clampSurah(n) {
  const num = parseInt(n, 10);
  if (Number.isNaN(num)) return 1;
  return Math.min(114, Math.max(1, num));
}

export function clampAyah(n, max = 286) {
  const num = parseInt(n, 10);
  if (Number.isNaN(num)) return 1;
  return Math.min(max, Math.max(1, num));
}

export function getLastRead() {
  try {
    const raw = localStorage.getItem(KEYS.LAST_READ);
    if (!raw) return { ...defaultLastRead };
    const data = JSON.parse(raw);
    return {
      surah: clampSurah(data.surah),
      ayah: clampAyah(data.ayah),
      view:
        data.view === 'verse' || data.view === 'ayah'
          ? 'verse'
          : 'reading',
      mushafPage: Math.max(1, parseInt(data.mushafPage, 10) || 1),
    };
  } catch {
    return { ...defaultLastRead };
  }
}

export function setLastRead({ surah, ayah, view, mushafPage }) {
  const payload = {
    surah: clampSurah(surah),
    ayah: clampAyah(ayah),
    view: view === 'verse' || view === 'ayah' ? 'verse' : 'reading',
    mushafPage: Math.max(1, parseInt(mushafPage, 10) || 1),
  };
  localStorage.setItem(KEYS.LAST_READ, JSON.stringify(payload));
  return payload;
}

export function getBookmarks() {
  try {
    const raw = localStorage.getItem(KEYS.BOOKMARKS);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return [...new Set(list.map(clampSurah))].sort((a, b) => a - b);
  } catch {
    return [];
  }
}

export function toggleBookmark(surah) {
  const n = clampSurah(surah);
  const current = getBookmarks();
  const next = current.includes(n)
    ? current.filter((x) => x !== n)
    : [...current, n].sort((a, b) => a - b);
  localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(next));
  return next;
}

export function isBookmarked(surah, bookmarks) {
  return bookmarks.includes(clampSurah(surah));
}
