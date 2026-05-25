import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Play from './Play';
import { useLanguage } from '../../context/LanguageContext';
import {
  getAyahTranslation,
  getAyahTransliteration,
  getAyahTafsir,
  hasAyahTafsir,
} from '../../i18n/content';
import { clampAyah } from '../../utils/storage';

export default function VerseModeView({
  surah,
  ayah,
  ayahCount,
  quran,
  data,
  showTranslation,
}) {
  const { t, lang, isRtl } = useLanguage();
  const navigate = useNavigate();
  const ayahIndex = ayah - 1;
  const currentAyah = data.ayahs[ayahIndex];

  const goVerse = useCallback(
    (index) => {
      const n = clampAyah(index + 1, ayahCount);
      navigate(`/surah/${surah}/verse/${n}`, { replace: true });
    },
    [surah, ayahCount, navigate]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
      const prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === nextKey || e.key === 'j') goVerse(ayahIndex + 1);
      if (e.key === prevKey || e.key === 'k') goVerse(ayahIndex - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ayahIndex, goVerse, isRtl]);

  if (!currentAyah) {
    return null;
  }

  return (
    <div className="reader-content mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-quran-muted">
          {t('surah.label')}{' '}
          {surah.toLocaleString(lang === 'ar' ? 'ar-u-nu-arab' : 'en')}
          {' · '}
          {t('ayah.label')}{' '}
          {ayah.toLocaleString(lang === 'ar' ? 'ar-u-nu-arab' : 'en')}{' '}
          {t('ayah.of')}{' '}
          {ayahCount.toLocaleString(lang === 'ar' ? 'ar-u-nu-arab' : 'en')}
        </p>
        <label className="flex items-center gap-2 text-sm text-quran-muted">
          {t('ayah.goTo')}
          <input
            type="number"
            min={1}
            max={ayahCount}
            value={ayah}
            onChange={(e) => goVerse(parseInt(e.target.value, 10) - 1)}
            className="w-16 rounded-lg border border-quran-border px-2 py-1 text-center outline-none focus:border-quran-primary"
          />
        </label>
      </div>

      <article className="reader-verse-card">
        <div className="mb-6 flex items-start justify-between gap-4">
          <Play quran={quran} loading={false} id={ayahIndex} />
          <span className="reader-verse-badge">
            {ayah.toLocaleString('ar-u-nu-arab')}
          </span>
        </div>

        <p
          className="arabic-text text-center text-3xl leading-[2.2] text-quran-text sm:text-4xl"
          dir="rtl"
        >
          {currentAyah.text.ar}
        </p>

        {showTranslation && (
          <div
            className="mt-8 border-t border-quran-border pt-6 text-start"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-quran-primary">
              {t('content.translation')}
            </p>
            <p className="text-lg leading-relaxed text-quran-text">
              {getAyahTranslation(currentAyah, lang)}
            </p>
            {lang !== 'ar' && getAyahTransliteration(currentAyah) && (
              <p className="mt-3 text-sm italic leading-relaxed text-quran-muted">
                {t('content.transliteration')}: {getAyahTransliteration(currentAyah)}
              </p>
            )}
            {hasAyahTafsir(currentAyah, lang) && (
              <>
                <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide text-quran-muted">
                  {t('content.tafsir')}
                </p>
                <p className="text-base leading-relaxed text-quran-muted">
                  {getAyahTafsir(currentAyah, lang)}
                </p>
              </>
            )}
          </div>
        )}
      </article>

      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          className="btn-outline flex-1"
          disabled={ayah <= 1}
          onClick={() => goVerse(ayahIndex - 1)}
        >
          {t('ayah.prev')}
        </button>
        <button
          type="button"
          className="btn-primary flex-1"
          disabled={ayah >= ayahCount}
          onClick={() => goVerse(ayahIndex + 1)}
        >
          {t('ayah.next')}
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-quran-muted">{t('ayah.tipKeys')}</p>
    </div>
  );
}
