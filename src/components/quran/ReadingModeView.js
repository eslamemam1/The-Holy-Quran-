import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Play from './Play';
import { useLanguage } from '../../context/LanguageContext';
import { getAyahReading } from '../../i18n/content';
import { groupAyahsByMushafPage, showBismillah } from '../../utils/mushaf';

export default function ReadingModeView({
  surah,
  quran,
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
    <div className="reader-content mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {pageNum === 1 && showBismillah(surah) && (
        <p
          className="arabic-text mb-8 text-center text-2xl text-quran-text sm:text-3xl"
          dir="rtl"
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </p>
      )}

      <div className="reader-flow" dir="rtl">
        {pageAyahs.map((ayah) => {
          const ayahNum = ayah.number?.insurah;
          const globalIndex = data.ayahs.findIndex(
            (a) => a.number?.insurah === ayahNum
          );
          return (
            <div key={ayah.number?.inquran ?? globalIndex} className="reader-ayah">
              <div className="group flex items-start gap-2">
                <span className="reader-ayah-text arabic-text">{ayah.text.ar}</span>
                <Link
                  to={`/surah/${surah}/verse/${ayahNum ?? globalIndex + 1}`}
                  className="reader-ayah-num shrink-0"
                  title={t('reader.verseByVerse')}
                >
                  {ayahNum?.toLocaleString('ar-u-nu-arab') ??
                    (globalIndex + 1).toLocaleString('ar-u-nu-arab')}
                </Link>
              </div>
              {showTranslation && (
                <div className="reader-translation text-start" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <p>{getAyahReading(ayah, lang)}</p>
                </div>
              )}
              <div className="reader-ayah-tools opacity-0 transition group-hover:opacity-100">
                <Play quran={quran} loading={false} id={globalIndex} />
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav
          className="reader-page-nav mt-10 flex flex-wrap items-center justify-center gap-2 border-t border-quran-border pt-6"
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
