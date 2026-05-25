import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  getAyahTranslation,
  getPreBismillahArabic,
  getPreBismillahTranslation,
} from '../../i18n/content';
import { groupAyahsByMushafPage, showBismillah } from '../../utils/mushaf';

export default function ReadingModeView({
  surah,
  data,
  pageNum,
  totalPages,
  showTranslation,
  activeAyahInsurah,
  selectedAyahInsurah,
  onSelectAyah,
  onPageChange,
}) {
  const { t, lang } = useLanguage();

  const pages = useMemo(
    () => groupAyahsByMushafPage(data.ayahs),
    [data.ayahs]
  );
  const pageIndex = Math.min(totalPages, Math.max(1, pageNum)) - 1;
  const pageAyahs = pages[pageIndex]?.ayahs ?? data.ayahs;
  const mushafPage = pages[pageIndex]?.mushafPage;

  return (
    <div className="reader-reading-wrap mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <p className="reader-select-ayah-hint mb-4 text-center text-xs text-quran-muted">
        {t('reader.selectAyahHint')}
      </p>

      <div className="reader-reading-panel">
        {pageNum === 1 && showBismillah(surah) && getPreBismillahArabic(data) && (
          <div className="reader-bismillah-block mb-6 text-center">
            <p
              className="reader-bismillah arabic-text text-2xl sm:text-3xl"
              dir="rtl"
            >
              {getPreBismillahArabic(data)}
            </p>
            {showTranslation && getPreBismillahTranslation(data, lang) && (
              <p
                className="mt-3 text-sm leading-relaxed text-quran-muted"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              >
                {getPreBismillahTranslation(data, lang)}
              </p>
            )}
          </div>
        )}

        <p className="reader-continuous arabic-text" dir="rtl">
          {pageAyahs.map((ayah, i) => {
            const ayahNum = ayah.number?.insurah ?? i + 1;
            const globalIndex = data.ayahs.findIndex(
              (a) => a.number?.insurah === ayah.number?.insurah
            );
            const isPlaying =
              activeAyahInsurah != null && ayahNum === activeAyahInsurah;
            const isSelected =
              selectedAyahInsurah != null && ayahNum === selectedAyahInsurah;
            let stateClass = '';
            if (isPlaying) stateClass = ' reader-ayah-inline--active';
            else if (isSelected) stateClass = ' reader-ayah-inline--selected';

            return (
              <span
                key={ayah.number?.inquran ?? globalIndex}
                className={`reader-ayah-inline${stateClass}`}
              >
                <span className="reader-ayah-words">{ayah.text.ar}</span>
                <button
                  type="button"
                  className="reader-ayah-num"
                  title={t('reader.selectAyahPlay')}
                  aria-label={t('reader.selectAyahPlayN', { n: ayahNum })}
                  aria-pressed={isSelected || isPlaying}
                  onClick={() => onSelectAyah(ayahNum)}
                >
                  {ayahNum.toLocaleString('ar-u-nu-arab')}
                </button>
                <Link
                  to={`/surah/${surah}/verse/${ayahNum}`}
                  className="reader-ayah-open"
                  title={t('reader.verseByVerse')}
                  aria-label={`${t('ayah.focus')} ${ayahNum}`}
                >
                  ↗
                </Link>
                {'\u00A0'}
              </span>
            );
          })}
        </p>

        {showTranslation && (
          <div
            className="reader-translations-block"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {pageAyahs.map((ayah, i) => {
              const ayahNum = ayah.number?.insurah ?? i + 1;
              const isSelected =
                selectedAyahInsurah != null && ayahNum === selectedAyahInsurah;
              return (
                <p
                  key={`tr-${ayah.number?.inquran ?? i}`}
                  className={`reader-translation-line${isSelected ? ' reader-translation-line--selected' : ''}`}
                  onClick={() => onSelectAyah(ayahNum)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectAyah(ayahNum);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <span className="reader-translation-num">{ayahNum}. </span>
                  {getAyahTranslation(ayah, lang)}
                </p>
              );
            })}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav
          className="reader-page-nav mt-8 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-quran-border/80 bg-white/90 px-4 py-4 backdrop-blur-sm"
          aria-label={t('mushaf.page')}
        >
          <button
            type="button"
            className="reader-action-btn"
            disabled={pageNum <= 1}
            onClick={() => onPageChange(pageNum - 1)}
          >
            {t('mushaf.prevPage')}
          </button>
          <span className="px-3 text-sm font-medium text-quran-muted">
            {t('reader.pageNav', { current: pageNum, total: totalPages })}
            {mushafPage ? ` · ${t('mushaf.mushafPage', { page: mushafPage })}` : ''}
            {(activeAyahInsurah ?? selectedAyahInsurah) != null && (
              <span className="block text-xs text-quran-primary sm:inline sm:before:content-['·'] sm:before:mx-1">
                {t('reader.startFromAyah', {
                  n: activeAyahInsurah ?? selectedAyahInsurah,
                })}
              </span>
            )}
          </span>
          <button
            type="button"
            className="reader-action-btn"
            disabled={pageNum >= totalPages}
            onClick={() => onPageChange(pageNum + 1)}
          >
            {t('mushaf.nextPage')}
          </button>
        </nav>
      )}
    </div>
  );
}
