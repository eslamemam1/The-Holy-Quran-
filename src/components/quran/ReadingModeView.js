import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getAyahReading } from '../../i18n/content';
import { groupAyahsByMushafPage, showBismillah } from '../../utils/mushaf';

export default function ReadingModeView({
  surah,
  data,
  pageNum,
  totalPages,
  showTranslation,
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
      <div className="reader-reading-panel">
        {pageNum === 1 && showBismillah(surah) && (
          <p
            className="reader-bismillah arabic-text text-center text-2xl sm:text-3xl"
            dir="rtl"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>
        )}

        <p className="reader-continuous arabic-text" dir="rtl">
          {pageAyahs.map((ayah, i) => {
            const ayahNum = ayah.number?.insurah ?? i + 1;
            const globalIndex = data.ayahs.findIndex(
              (a) => a.number?.insurah === ayah.number?.insurah
            );
            return (
              <span
                key={ayah.number?.inquran ?? globalIndex}
                className="reader-ayah-inline"
              >
                <span className="reader-ayah-words">{ayah.text.ar}</span>
                <Link
                  to={`/surah/${surah}/verse/${ayahNum}`}
                  className="reader-ayah-num"
                  title={t('reader.verseByVerse')}
                  aria-label={`${t('ayah.label')} ${ayahNum}`}
                >
                  {ayahNum.toLocaleString('ar-u-nu-arab')}
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
              return (
                <p key={`tr-${ayah.number?.inquran ?? i}`} className="reader-translation-line">
                  <span className="reader-translation-num">{ayahNum}. </span>
                  {getAyahReading(ayah, lang)}
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
