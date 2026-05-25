import { useQuran } from '../../context/QuranContext';
import { useLanguage } from '../../context/LanguageContext';
import { getSurahName } from '../../i18n/content';

export default function ContinueReading() {
  const { lastRead, goToSurah, goToVerse, getSurahMeta } = useQuran();
  const { t, lang } = useLanguage();
  const meta = getSurahMeta(lastRead.surah);
  const name =
    getSurahName(meta, lang) || `${t('surah.label')} ${lastRead.surah}`;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-10 -mt-6 rounded-2xl border border-quran-gold/30 bg-white p-5 shadow-card sm:p-6">
        <p className="section-label mb-1">{t('continue.label')}</p>
        <p className="text-lg font-bold text-quran-navy">
          {name}
          {lastRead.view === 'verse' ? (
            <span className="font-normal text-quran-muted">
              {' '}
              · {t('continue.ayah')} {lastRead.ayah}
            </span>
          ) : (
            <span className="font-normal text-quran-muted">
              {' '}
              · {t('continue.page')} {lastRead.mushafPage || 1}
            </span>
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              lastRead.view === 'verse'
                ? goToVerse(lastRead.surah, lastRead.ayah)
                : goToSurah(lastRead.surah, lastRead.mushafPage || 1)
            }
          >
            {t('continue.resume')}
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => goToSurah(lastRead.surah, 1)}
          >
            {t('continue.fromPage1')}
          </button>
        </div>
      </div>
    </div>
  );
}
