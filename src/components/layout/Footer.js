import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/80">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold text-quran-primary">
          © {year} {t('appName')}. {t('footer.rights')}
        </p>
        <p className="mt-1 text-sm text-quran-muted">{t('footer.credit')}</p>
      </div>
    </footer>
  );
}
