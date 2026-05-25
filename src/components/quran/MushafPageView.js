import { Link } from 'react-router-dom';
import bismillah from '../../assets/images/473.png';
import Play from './Play';
import { showBismillah } from '../../utils/mushaf';
import { useLanguage } from '../../context/LanguageContext';
import { getAyahTranslation, getAyahTransliteration } from '../../i18n/content';

export default function MushafPageView({
  surah,
  pageData,
  quran,
  allAyahs,
  showTranslation,
  onToggleTranslation,
  isFirstPageOfSurah,
}) {
  const { t, lang } = useLanguage();
  const { mushafPage, ayahs, juz } = pageData;

  return (
    <article className="mushaf-page" aria-label={`${t('mushaf.page')} ${mushafPage}`}>
      <header className="mushaf-page-header">
        <span className="mushaf-page-badge">
          {t('mushaf.pageAr')} {mushafPage.toLocaleString(lang === 'ar' ? 'ar-u-nu-arab' : 'en')}
        </span>
        {juz && (
          <span className="text-xs text-quran-muted">
            {t('mushaf.juzAr')} {juz.toLocaleString(lang === 'ar' ? 'ar-u-nu-arab' : 'en')}
          </span>
        )}
      </header>

      {isFirstPageOfSurah && showBismillah(surah) && (
        <div className="mb-6 flex justify-center">
          <img
            src={bismillah}
            alt={t('content.bismillah')}
            className="max-w-[220px] opacity-90"
          />
        </div>
      )}

      <div className="mushaf-ayah-block">
        {ayahs.map((ayah) => {
          const ayahNum = ayah.number?.insurah;
          const globalIndex = allAyahs.findIndex(
            (a) => a.number?.insurah === ayahNum
          );
          const displayNum = ayahNum ?? globalIndex + 1;
          return (
            <div
              key={ayah.number?.inquran ?? globalIndex}
              className="mushaf-ayah-row group"
            >
              <span className="mushaf-ayah-text arabic-text" dir="rtl">
                {ayah.text.ar}
                <span className="mushaf-ayah-marker">
                  {displayNum.toLocaleString('ar-u-nu-arab')}
                </span>
              </span>
              <div className="mushaf-ayah-actions opacity-0 transition group-hover:opacity-100">
                <Play quran={quran} loading={false} id={globalIndex} />
                <Link
                  to={`/ayah/${surah}/${displayNum}`}
                  className="text-xs font-semibold text-quran-primary hover:underline"
                >
                  {t('ayah.focus')}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {showTranslation && (
        <div className="mt-8 space-y-4 border-t border-quran-gold/20 pt-6 text-start">
          {ayahs.map((ayah) => (
            <div key={`t-${ayah.number?.inquran}`}>
              <p className="mb-1 text-xs font-bold text-quran-gold">
                {t('ayah.label')} {ayah.number?.insurah}
              </p>
              <p className="text-base leading-relaxed text-slate-700">
                {getAyahTranslation(ayah, lang)}
              </p>
              {lang === 'ar' && getAyahTransliteration(ayah) && (
                <p className="mt-1 text-sm italic text-quran-muted">
                  {t('content.transliteration')}: {getAyahTransliteration(ayah)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <footer className="mushaf-page-footer">
        <button
          type="button"
          onClick={onToggleTranslation}
          className="text-xs font-semibold text-quran-primary hover:underline"
        >
          {showTranslation
            ? t('mushaf.hideTranslation')
            : t('mushaf.showTranslation')}
        </button>
        <span className="text-xs text-quran-muted">
          {mushafPage.toLocaleString(lang === 'ar' ? 'ar-u-nu-arab' : 'en')}
        </span>
      </footer>
    </article>
  );
}
