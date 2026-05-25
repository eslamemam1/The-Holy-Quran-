/** Strip BOM sometimes present in API Arabic strings */
function cleanArabic(text) {
  return text?.replace(/^\uFEFF/, '').trim() || '';
}

/** Surah display name by UI language */
export function getSurahName(meta, lang, form = 'short') {
  if (!meta?.asma) return '';
  if (lang === 'ar') {
    return form === 'long' ? meta.asma.ar?.long : meta.asma.ar?.short;
  }
  return form === 'long' ? meta.asma.en?.long : meta.asma.en?.short;
}

export function getSurahMeaning(meta, lang) {
  if (!meta?.asma?.translation) return '';
  return lang === 'ar'
    ? meta.asma.translation.ar || meta.asma.translation.en
    : meta.asma.translation.en || meta.asma.translation.id;
}

/** Medinan / Meccan (or Arabic label) */
export function getSurahType(meta, lang) {
  if (!meta?.type) return '';
  if (lang === 'ar') return meta.type.ar || meta.type.en || '';
  return meta.type.en || meta.type.id || meta.type.ar || '';
}

/** Surah introduction tafsir from API `data.tafsir` */
export function getSurahTafsir(meta, lang) {
  if (!meta?.tafsir) return '';
  if (lang === 'ar') return meta.tafsir.ar || '';
  return meta.tafsir.en || meta.tafsir.id || '';
}

export function hasSurahTafsir(meta, lang) {
  return Boolean(getSurahTafsir(meta, lang)?.trim());
}

/** Opening bismillah before ayahs (not surah 1 / 9 in mushaf) */
export function getPreBismillahArabic(data) {
  return cleanArabic(data?.preBismillah?.text?.ar);
}

export function getPreBismillahTranslation(data, lang) {
  const tr = data?.preBismillah?.translation;
  if (!tr) return '';
  if (lang === 'ar') return tr.ar || tr.en || tr.id || '';
  return tr.en || tr.id || '';
}

/** Ayah meaning — API `ayah.translation` (en / id) */
export function getAyahTranslation(ayah, lang) {
  if (!ayah) return '';
  const tr = ayah.translation;
  if (lang === 'ar') {
    return tr?.ar || ayah.text?.read || tr?.en || '';
  }
  return tr?.en || tr?.id || '';
}

/** Ayah tafsir — API `ayah.tafsir` (en often null; id available) */
export function getAyahTafsir(ayah, lang) {
  if (!ayah?.tafsir) return '';
  if (lang === 'ar') return ayah.tafsir.ar || '';
  return ayah.tafsir.en || ayah.tafsir.id || '';
}

export function hasAyahTafsir(ayah, lang) {
  return Boolean(getAyahTafsir(ayah, lang)?.trim());
}

/** @deprecated alias — use getAyahTranslation */
export function getAyahReading(ayah, lang) {
  return getAyahTranslation(ayah, lang);
}

export function getAyahTransliteration(ayah) {
  return ayah?.text?.read || '';
}

/** Per-ayah recitation URL from API `ayah.audio.url` */
export function getAyahAudioUrl(ayah) {
  return ayah?.audio?.url || '';
}

/** Full-surah recitation from API `data.recitation.full` */
export function getSurahRecitationUrl(data) {
  return data?.recitation?.full || '';
}
