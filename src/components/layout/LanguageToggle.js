import { useLanguage } from '../../context/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5"
      role="group"
      aria-label={t('lang.switch')}
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`rounded-md px-2.5 py-1 text-xs font-bold transition sm:px-3 sm:text-sm ${
          lang === 'en'
            ? 'bg-quran-primary text-white shadow-sm'
            : 'text-quran-muted hover:text-quran-primary'
        }`}
      >
        {t('lang.en')}
      </button>
      <button
        type="button"
        onClick={() => setLang('ar')}
        className={`rounded-md px-2.5 py-1 text-xs font-bold transition sm:px-3 sm:text-sm ${
          lang === 'ar'
            ? 'bg-quran-primary text-white shadow-sm'
            : 'text-quran-muted hover:text-quran-primary'
        }`}
      >
        {t('lang.ar')}
      </button>
    </div>
  );
}
