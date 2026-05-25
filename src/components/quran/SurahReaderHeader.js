import { Link, useLocation } from 'react-router-dom';
import SurahPicker from './SurahPicker';
import BookmarkButton from './BookmarkButton';
import { useLanguage } from '../../context/LanguageContext';
import {
  getSurahName,
  getSurahMeaning,
  getSurahType,
  getSurahTafsir,
  hasSurahTafsir,
} from '../../i18n/content';

export default function SurahReaderHeader({
  surah,
  data,
  playing,
  showTranslation,
  onToggleTranslation,
  onPlay,
  onPause,
  onSelectSurah,
}) {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const isVerseMode = location.pathname.includes('/verse/');

  const surahNum = String(surah).padStart(3, '0');

  return (
    <header className="reader-header sticky z-40 border-b border-quran-border bg-quran-surface">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span className="reader-surah-badge">{surahNum}</span>
            <div className="min-w-0 text-start">
              <h1 className="text-xl font-bold text-quran-text sm:text-2xl">
                {lang === 'ar' ? data.asma.ar.long : getSurahName(data, lang, 'long')}
              </h1>
              <p className="mt-0.5 text-sm text-quran-muted">
                {getSurahMeaning(data, lang)}
                {getSurahType(data, lang) && (
                  <span className="reader-surah-type">
                    {' · '}
                    {getSurahType(data, lang)}
                  </span>
                )}
              </p>
              {lang !== 'ar' && (
                <p className="arabic-text mt-1 text-lg text-quran-primary">
                  {data.asma.ar.long}
                </p>
              )}
            </div>
          </div>
          <BookmarkButton surahNumber={surah} className="h-10 w-10" />
        </div>

        {hasSurahTafsir(data, lang) && (
          <p
            className="mb-4 text-sm leading-relaxed text-quran-muted"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {getSurahTafsir(data, lang)}
          </p>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link
            to={`/surah/${surah}/reading`}
            className={`reader-mode-pill ${!isVerseMode ? 'reader-mode-pill-active' : ''}`}
          >
            {t('reader.reading')}
          </Link>
          <Link
            to={`/surah/${surah}/verse/1`}
            className={`reader-mode-pill ${isVerseMode ? 'reader-mode-pill-active' : ''}`}
          >
            {t('reader.verseByVerse')}
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SurahPicker
            currentSurah={surah}
            onSelect={onSelectSurah}
            className="min-w-[200px] flex-1"
          />
          <button
            type="button"
            onClick={playing ? onPause : onPlay}
            className="reader-action-btn"
          >
            <span aria-hidden>{playing ? '⏸' : '▶'}</span>
            {playing ? t('reader.stop') : t('reader.listen')}
          </button>
          <button
            type="button"
            onClick={onToggleTranslation}
            className={`reader-action-btn ${showTranslation ? 'reader-action-btn-active' : ''}`}
          >
            {t('reader.translation')}
          </button>
        </div>
      </div>
    </header>
  );
}
