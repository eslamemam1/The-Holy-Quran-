import { Link } from 'react-router-dom';
import SurahPicker from './SurahPicker';
import BookmarkButton from './BookmarkButton';
import AudioControl from '../ui/AudioControl';
import { useLanguage } from '../../context/LanguageContext';
import { getSurahName, getSurahMeaning } from '../../i18n/content';

export default function SurahToolbar({
  surah,
  data,
  playing,
  onPlay,
  onPause,
  onSelectSurah,
  mode = 'mushaf',
}) {
  const { t, lang } = useLanguage();

  return (
    <div className="mb-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SurahPicker currentSurah={surah} onSelect={onSelectSurah} />
        <div className="flex flex-wrap items-end justify-end gap-2">
          <BookmarkButton surahNumber={surah} className="h-11 w-11" />
        </div>
      </div>

      <div className="ayah-card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-start">
          <p className="section-label mb-1">
            {t('surah.label')} {surah}
          </p>
          <h1 className="arabic-text text-2xl sm:text-3xl">
            {data.asma.ar.long}
          </h1>
          <p className="text-sm font-medium text-quran-muted">
            {getSurahName(data, lang, 'long')} · {getSurahMeaning(data, lang)}
          </p>
        </div>
        <AudioControl playing={playing} onPlay={onPlay} onPause={onPause} />
      </div>

      <div className="flex flex-wrap gap-2">
        {mode === 'mushaf' ? (
          <Link to={`/surah/${surah}/scroll`} className="btn-outline text-sm">
            {t('surah.scrollView')}
          </Link>
        ) : (
          <Link
            to={`/surah/${surah}/page/1`}
            className="btn-primary text-sm"
          >
            {t('surah.mushafPages')}
          </Link>
        )}
        <Link to={`/ayah/${surah}/1`} className="btn-outline text-sm">
          {t('surah.ayahMode')} →
        </Link>
      </div>
    </div>
  );
}
