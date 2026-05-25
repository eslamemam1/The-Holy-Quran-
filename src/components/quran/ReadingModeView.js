import { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  getAyahTranslation,
  getPreBismillahArabic,
  getPreBismillahTranslation,
} from '../../i18n/content';
import { groupAyahsByMushafPage, showBismillah } from '../../utils/mushaf';
import AyahNumberMenu from './AyahNumberMenu';

export default function ReadingModeView({
  surah,
  data,
  pageNum,
  totalPages,
  showTranslation,
  activeAyahInsurah,
  selectedAyahInsurah,
  onPlayAyah,
  onPlayAyahOnly,
  onPageChange,
}) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [openMenuAyah, setOpenMenuAyah] = useState(null);

  const pages = useMemo(
    () => groupAyahsByMushafPage(data.ayahs),
    [data.ayahs]
  );
  const pageIndex = Math.min(totalPages, Math.max(1, pageNum)) - 1;
  const pageAyahs = pages[pageIndex]?.ayahs ?? data.ayahs;
  const mushafPage = pages[pageIndex]?.mushafPage;

  const closeMenu = useCallback(() => setOpenMenuAyah(null), []);

  const toggleMenu = useCallback((ayahNum) => {
    setOpenMenuAyah((prev) => (prev === ayahNum ? null : ayahNum));
  }, []);

  const handleGoToAyah = useCallback(
    (ayahNum) => {
      navigate(`/surah/${surah}/verse/${ayahNum}`);
    },
    [navigate, surah]
  );

  useEffect(() => {
    closeMenu();
  }, [pageNum, closeMenu]);

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

            return (
              <span
                key={ayah.number?.inquran ?? globalIndex}
                className={`reader-ayah-inline${isPlaying ? ' reader-ayah-inline--active' : ''}`}
              >
                <span className="reader-ayah-words">{ayah.text.ar}</span>
                <AyahNumberMenu
                  ayahNum={ayahNum}
                  isPlaying={isPlaying}
                  isSelected={isSelected && !isPlaying}
                  open={openMenuAyah === ayahNum}
                  onToggle={() => toggleMenu(ayahNum)}
                  onClose={closeMenu}
                  onListen={onPlayAyah}
                  onListenOnly={onPlayAyahOnly}
                  onGoToAyah={handleGoToAyah}
                  t={t}
                  lang={lang}
                />
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
              const isHighlighted =
                (activeAyahInsurah != null && ayahNum === activeAyahInsurah) ||
                (selectedAyahInsurah != null && ayahNum === selectedAyahInsurah);
              return (
                <p
                  key={`tr-${ayah.number?.inquran ?? i}`}
                  className={`reader-translation-line${isHighlighted ? ' reader-translation-line--selected' : ''}`}
                  onClick={() => toggleMenu(ayahNum)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleMenu(ayahNum);
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
