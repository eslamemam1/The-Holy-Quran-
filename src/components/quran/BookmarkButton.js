import { useQuran } from '../../context/QuranContext';
import { useLanguage } from '../../context/LanguageContext';
import { isBookmarked } from '../../utils/storage';
import { IconBookmark } from '../ui/Icons';

export default function BookmarkButton({
  surahNumber,
  className = '',
  variant = 'light',
}) {
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
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors ${
        variant === 'dark' ? 'hover:bg-white/15' : 'hover:bg-quran-mint/60'
      } ${className}`}
      aria-label={active ? t('bookmarks.remove') : t('bookmarks.add')}
      title={active ? t('bookmarks.remove') : t('bookmarks.add')}
    >
      <IconBookmark
        className={`h-5 w-5 ${
          active
            ? 'text-quran-gold'
            : variant === 'dark'
              ? 'text-white/70'
              : 'text-quran-muted'
        }`}
        filled={active}
      />
    </button>
  );
}
