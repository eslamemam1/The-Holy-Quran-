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
import {
  IconHeadphones,
  IconPause,
  IconTranslation,
  IconChevronLeft,
  IconChevronRight,
  IconHome,
} from '../ui/Icons';
import { useReaderMobileChrome } from '../../context/ReaderMobileChromeContext';

function MobilePageNav({ pageNav, t, lang }) {
  if (!pageNav) return null;

  const { pageNum, totalPages, onPageChange } = pageNav;
  const prevIcon =
    lang === 'ar' ? (
      <IconChevronRight className="h-3.5 w-3.5 shrink-0" />
    ) : (
      <IconChevronLeft className="h-3.5 w-3.5 shrink-0" />
    );
  const nextIcon =
    lang === 'ar' ? (
      <IconChevronLeft className="h-3.5 w-3.5 shrink-0" />
    ) : (
      <IconChevronRight className="h-3.5 w-3.5 shrink-0" />
    );

  return (
    <div
      className="reader-mobile-pages"
      aria-label={t('reader.pageNav', { current: pageNum, total: totalPages })}
    >
      <button
        type="button"
        className="reader-page-nav-mobile-btn"
        disabled={pageNum <= 1}
        onClick={() => onPageChange(pageNum - 1)}
        aria-label={t('mushaf.prevPageLabel')}
      >
        {prevIcon}
        <span className="reader-page-nav-mobile-label">
          {t('mushaf.prevPageLabel')}
        </span>
      </button>
      <span className="reader-mobile-page-count">{pageNum}/{totalPages}</span>
      <button
        type="button"
        className="reader-page-nav-mobile-btn"
        disabled={pageNum >= totalPages}
        onClick={() => onPageChange(pageNum + 1)}
        aria-label={t('mushaf.nextPageLabel')}
      >
        <span className="reader-page-nav-mobile-label">
          {t('mushaf.nextPageLabel')}
        </span>
        {nextIcon}
      </button>
    </div>
  );
}

function ReaderActionButtons({
  showListen,
  playing,
  showTranslation,
  onPlay,
  onPause,
  onToggleTranslation,
  t,
  layout,
}) {
  const isMobile = layout === 'mobile';
  const iconClass = isMobile ? 'h-4 w-4 shrink-0' : 'h-5 w-5 shrink-0';

  return (
    <>
      {showListen && (
        <button
          type="button"
          onClick={playing ? onPause : onPlay}
          className={
            isMobile
              ? 'reader-mobile-dock-btn reader-mobile-dock-btn--listen'
              : 'reader-action-btn reader-action-btn--listen'
          }
        >
          {playing ? (
            <IconPause className={iconClass} />
          ) : (
            <IconHeadphones className={iconClass} />
          )}
          <span>{playing ? t('reader.stop') : t('reader.listen')}</span>
          {!playing && !isMobile && (
            <span className="reader-listen-hint">{t('reader.listenPageHint')}</span>
          )}
        </button>
      )}
      <button
        type="button"
        onClick={onToggleTranslation}
        className={
          isMobile
            ? `reader-mobile-dock-btn${showTranslation ? ' reader-mobile-dock-btn-active' : ''}`
            : `reader-action-btn${showTranslation ? ' reader-action-btn-active' : ''}`
        }
      >
        <IconTranslation className={iconClass} />
        <span>{t('reader.translation')}</span>
      </button>
    </>
  );
}

export default function SurahReaderHeader({
  surah,
  data,
  showTranslation,
  showListen = false,
  playing = false,
  onToggleTranslation,
  onPlay,
  onPause,
  onSelectSurah,
}) {
  const { t, lang } = useLanguage();
  const { pageNav } = useReaderMobileChrome();
  const location = useLocation();
  const isVerseMode = location.pathname.includes('/verse/');

  const surahNum = String(surah).padStart(3, '0');

  return (
    <>
      <header className="reader-header reader-header--compact sticky z-40 overflow-hidden rounded-b-3xl bg-quran-surface">
        <div className="reader-header-top">
          <div className="mx-auto max-w-3xl">
            <div className="mb-2 flex items-start justify-between gap-2 md:mb-4 md:gap-3">
              <div className="flex min-w-0 flex-1 items-start gap-2 md:gap-3">
                <span className="reader-surah-badge">{surahNum}</span>
                <div className="min-w-0 text-start">
                  <h1 className="text-base font-bold leading-tight text-white md:text-2xl">
                    {lang === 'ar'
                      ? data.asma.ar.long
                      : getSurahName(data, lang, 'long')}
                  </h1>
                  <p className="mt-0.5 hidden text-xs text-white/75 md:block md:text-sm">
                    {getSurahMeaning(data, lang)}
                    {getSurahType(data, lang) && (
                      <span className="text-quran-gold/90">
                        {' · '}
                        {getSurahType(data, lang)}
                      </span>
                    )}
                  </p>
                  {lang !== 'ar' && (
                    <p className="arabic-text mt-1 hidden text-lg text-quran-gold/90 md:block">
                      {data.asma.ar.long}
                    </p>
                  )}
                </div>
              </div>
              <BookmarkButton surahNumber={surah} variant="dark" />
            </div>

            {hasSurahTafsir(data, lang) && (
              <p
                className="mb-3 hidden text-sm leading-relaxed text-white/70 md:mb-4 md:block"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              >
                {getSurahTafsir(data, lang)}
              </p>
            )}

            <div className="grid grid-cols-2 gap-1.5 md:flex md:flex-wrap md:items-center md:gap-2">
              <Link
                to={`/surah/${surah}/reading`}
                className={`reader-mode-pill justify-center md:justify-start ${!isVerseMode ? 'reader-mode-pill-active' : ''}`}
              >
                {t('reader.reading')}
              </Link>
              <Link
                to={`/surah/${surah}/verse/1`}
                className={`reader-mode-pill justify-center md:justify-start ${isVerseMode ? 'reader-mode-pill-active' : ''}`}
              >
                {t('reader.verseByVerse')}
              </Link>
            </div>
          </div>
        </div>

        <div className="reader-header-toolbar hidden md:block">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2">
            <SurahPicker
              currentSurah={surah}
              onSelect={onSelectSurah}
              className="min-w-[200px] flex-1"
            />
            <ReaderActionButtons
              showListen={showListen}
              playing={playing}
              showTranslation={showTranslation}
              onPlay={onPlay}
              onPause={onPause}
              onToggleTranslation={onToggleTranslation}
              t={t}
              layout="desktop"
            />
          </div>
        </div>

        <div className="reader-header-toolbar reader-header-toolbar--compact md:hidden">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="reader-home-btn"
                aria-label={t('nav.home')}
              >
                <IconHome className="h-5 w-5 shrink-0" />
                <span className="text-xs font-bold">{t('nav.home')}</span>
              </Link>
              <SurahPicker
                currentSurah={surah}
                onSelect={onSelectSurah}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </header>

      <div
        className="reader-mobile-dock md:hidden"
        aria-label={t('reader.mobileActions')}
      >
        <MobilePageNav pageNav={pageNav} t={t} lang={lang} />
        <div className="reader-mobile-dock-actions">
          <Link
            to="/"
            className="reader-mobile-dock-btn reader-mobile-dock-btn--home"
            aria-label={t('nav.home')}
          >
            <IconHome className="h-4 w-4 shrink-0" />
            <span>{t('nav.home')}</span>
          </Link>
          <ReaderActionButtons
            showListen={showListen}
            playing={playing}
            showTranslation={showTranslation}
            onPlay={onPlay}
            onPause={onPause}
            onToggleTranslation={onToggleTranslation}
            t={t}
            layout="mobile"
          />
        </div>
      </div>
    </>
  );
}
