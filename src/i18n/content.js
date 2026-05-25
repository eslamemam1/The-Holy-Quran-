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
    : meta.asma.translation.en;
}

/** Ayah translation / reading text for display under Arabic */
export function getAyahReading(ayah, lang) {
  if (!ayah) return '';
  if (lang === 'ar') {
    return ayah.translation?.ar || ayah.translation?.en || ayah.text?.read || '';
  }
  return ayah.translation?.en || ayah.text?.read || '';
}

export function getAyahTransliteration(ayah) {
  return ayah?.text?.read || '';
}
