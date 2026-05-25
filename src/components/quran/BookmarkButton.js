import { useQuran } from '../../context/QuranContext';
import { useLanguage } from '../../context/LanguageContext';
import { isBookmarked } from '../../utils/storage';

export default function BookmarkButton({ surahNumber, className = '' }) {
  const { bookmarks, toggleBookmark } = useQuran();
  const { t } = useLanguage();
  const active = isBookmarked(surahNumber, bookmarks);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(surahNumber);
      }}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl transition-colors hover:bg-quran-primary/10 ${className}`}
      aria-label={active ? t('bookmarks.remove') : t('bookmarks.add')}
      title={active ? t('bookmarks.remove') : t('bookmarks.add')}
    >
      <span className={active ? 'text-quran-gold' : 'text-slate-300'}>
        {active ? '★' : '☆'}
      </span>
    </button>
  );
}
