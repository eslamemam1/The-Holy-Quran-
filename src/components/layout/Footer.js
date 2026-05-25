import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="mt-16 border-t border-quran-border bg-quran-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm font-bold text-quran-primary">
          © {year} {t('appName')}. {t('footer.rights')}
        </p>
        <p className="mt-1 text-sm text-quran-muted">{t('footer.credit')}</p>
      </div>
    </footer>
  );
}
