/** Group surah ayahs by standard Madani mushaf page number (1–604). */
export function groupAyahsByMushafPage(ayahs) {
  if (!ayahs?.length) return [];

  const byPage = new Map();
  for (const ayah of ayahs) {
    const mushafPage = ayah.page ?? 1;
    if (!byPage.has(mushafPage)) byPage.set(mushafPage, []);
    byPage.get(mushafPage).push(ayah);
  }

  return Array.from(byPage.entries())
    .sort(([a], [b]) => a - b)
    .map(([mushafPage, pageAyahs]) => ({
      mushafPage,
      ayahs: pageAyahs,
      juz: pageAyahs[0]?.juz,
    }));
}

export function clampSurahPage(pageNum, totalPages) {
  const n = parseInt(pageNum, 10);
  if (Number.isNaN(n) || totalPages < 1) return 1;
  return Math.min(totalPages, Math.max(1, n));
}

/** Surah 1 and 9 have no bismillah before ayahs in mushaf. */
export function showBismillah(surahNumber) {
  return surahNumber !== 1 && surahNumber !== 9;
}
