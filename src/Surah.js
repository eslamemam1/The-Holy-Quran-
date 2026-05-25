import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import image from './473.png';
import numberAyah from './ayahNumber.png';
import Play from './Play';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner';
import AudioControl from './components/AudioControl';
import SurahPicker from './components/SurahPicker';
import BookmarkButton from './components/BookmarkButton';
import { useQuran } from './context/QuranContext';
import { clampSurah } from './utils/storage';

const Surah = () => {
  const { surahId } = useParams();
  const surah = clampSurah(surahId);
  const {
    loadSurah,
    goToSurah,
    goToAyah,
    remember,
    fetchError,
    loadingSurah,
    surahCache,
  } = useQuran();

  const [quran, setQuran] = useState(() => surahCache[surah] ?? null);
  const [playing, setPlaying] = useState(false);
  const currentAudio = useRef();

  useEffect(() => {
    let active = true;
    if (surahCache[surah]) {
      setQuran(surahCache[surah]);
    } else {
      setQuran(null);
    }
    loadSurah(surah).then((data) => {
      if (active && data) setQuran(data);
    });
    remember({ surah, ayah: 1, view: 'surah' });
    return () => {
      active = false;
    };
  }, [surah, loadSurah, remember, surahCache]);

  const loading = loadingSurah === surah && !quran;

  const play = () => {
    currentAudio.current?.play();
    setPlaying(true);
  };

  const pause = () => {
    currentAudio.current?.pause();
    setPlaying(false);
  };

  if (loading) {
    return (
      <div className="bg min-h-[60vh]">
        <LoadingSpinner label="Loading surah..." />
      </div>
    );
  }

  if (!quran?.data) {
    return (
      <div className="bg min-h-[60vh] px-4">
        <ErrorBanner message={fetchError || 'Surah not found.'} />
      </div>
    );
  }

  const { data } = quran;

  return (
    <div className="bg pb-12">
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <SurahPicker currentSurah={surah} onSelect={goToSurah} />
          <div className="flex items-end justify-between gap-2">
            <Link
              to={`/ayah/${surah}/1`}
              onClick={() => goToAyah(surah, 1)}
              className="btn-outline text-sm"
            >
              Ayah-by-ayah mode →
            </Link>
            <BookmarkButton surahNumber={surah} className="h-11 w-11" />
          </div>
        </div>

        <div className="ayah-card mb-8 text-center">
          <p className="section-label mb-2">Surah {surah}</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <h1 className="arabic-text text-3xl sm:text-4xl">
              {data.asma.ar.long}
            </h1>
            <AudioControl playing={playing} onPlay={play} onPause={pause} />
            <audio
              src={data.recitation?.full}
              ref={currentAudio}
              className="hidden"
            />
          </div>
          <p className="mt-2 text-lg font-semibold text-quran-muted">
            {data.asma.en.long} · {data.asma.translation.en}
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <img
            src={image}
            alt="Bismillah"
            className="mx-auto max-w-xs opacity-90 sm:max-w-sm"
          />
        </div>

        <ErrorBanner message={fetchError} />

        <div className="space-y-6">
          {data.ayahs.map((ayahs, id) => (
            <article key={id} className="ayah-card">
              <div className="mb-4 flex items-start justify-between gap-4">
                <Play quran={quran} loading={false} id={id} />
                <div className="flex flex-1 flex-row-reverse items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={numberAyah}
                      alt=""
                      className="h-10 w-8 object-contain"
                      aria-hidden
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-quran-primary">
                      {(id + 1).toLocaleString('ar-u-nu-arab')}
                    </span>
                  </div>
                  <p className="arabic-text flex-1 text-2xl sm:text-3xl">
                    {ayahs.text.ar}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="section-label mb-1">Translation</p>
                  <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
                    {ayahs.text.read}
                  </p>
                </div>
                <div>
                  <p className="section-label mb-1">Tafsir</p>
                  <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
                    {ayahs.translation.en}
                  </p>
                </div>
                <Link
                  to={`/ayah/${surah}/${id + 1}`}
                  onClick={() => goToAyah(surah, id + 1)}
                  className="text-sm font-semibold text-quran-primary hover:underline"
                >
                  Open in ayah mode →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="btn-outline"
            onClick={() => goToSurah(surah - 1)}
            disabled={surah <= 1}
          >
            ← Previous Surah
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => goToSurah(surah + 1)}
            disabled={surah >= 114}
          >
            Next Surah →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Surah;
