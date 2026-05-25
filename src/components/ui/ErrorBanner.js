import { useLanguage } from '../../context/LanguageContext';

export default function ErrorBanner({ message }) {
  const { t } = useLanguage();
  if (!message) return null;

  const text = message.includes('.') && !message.includes(' ')
    ? t(message)
    : message;

  return (
    <div
      className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-800"
      role="alert"
    >
      {text}
    </div>
  );
}
