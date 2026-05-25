import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import numberAyah from '../assets/images/ayahNumber.png';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AudioControl from '../components/ui/AudioControl';
import SurahPicker from '../components/quran/SurahPicker';
import BookmarkButton from '../components/quran/BookmarkButton';
import { useQuran } from '../context/QuranContext';
import { clampSurah, clampAyah } from '../utils/storage';

function Ayah() {
  const { surahId, ayahId } = useParams();
  const navigate = useNavigate();
  const surah = clampSurah(surahId);
  const { loadSurah, goToAyah, remember, fetchError, loadingSurah, surahCache } =
    useQuran();

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
    return () => {
      active = false;
    };
  }, [surah, loadSurah, surahCache]);

  const ayahCount = quran?.data?.ayahs?.length ?? 1;
  const ayah = clampAyah(ayahId, ayahCount);
  const ayahIndex = ayah - 1;

  useEffect(() => {
    if (quran && parseInt(ayahId, 10) !== ayah) {
      navigate(`/ayah/${surah}/${ayah}`, { replace: true });
    }
  }, [quran, ayahId, ayah, surah, navigate]);

  useEffect(() => {
    remember({ surah, ayah, view: 'ayah' });
  }, [surah, ayah, remember]);

  const goToAyahIndex = useCallback(
    (index) => {
      const next = clampAyah(index + 1, ayahCount);
      navigate(`/ayah/${surah}/${next}`, { replace: true });
    },
    [surah, ayahCount, navigate]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.key === 'ArrowRight' || e.key === 'j') goToAyahIndex(ayahIndex + 1);
      if (e.key === 'ArrowLeft' || e.key === 'k') goToAyahIndex(ayahIndex - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ayahIndex, goToAyahIndex]);

  const loading = loadingSurah === surah && !quran;

  const play = () => {
    currentAudio.current?.play();
    setPlaying(true);
  };

  const pause = () => {
    currentAudio.current?.pause();
    setPlaying(false);
  };

  const onAudioEnded = () => setPlaying(false);

  if (loading) {
    return (
      <div className="bg min-h-[60vh]">
        <LoadingSpinner label="Loading ayah..." />
      </div>
    );
  }

  if (!quran?.data?.ayahs?.[ayahIndex]) {
    return (
      <div className="bg min-h-[60vh] px-4 pt-8 text-center text-quran-muted">
        {fetchError || 'Ayah not found.'}
      </div>
    );
  }

  const { data } = quran;
  const currentAyah = data.ayahs[ayahIndex];

  return (
    <div className="bg min-h-[70vh] pb-12">
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <SurahPicker
            currentSurah={surah}
            onSelect={(n) => goToAyah(n, 1)}
          />
          <div className="flex items-end justify-between gap-2">
            <Link to={`/surah/${surah}`} className="btn-outline text-sm">
              ← Full surah
            </Link>
            <BookmarkButton surahNumber={surah} className="h-11 w-11" />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 sm:justify-between">
          <button
            type="button"
            className="btn-primary font-arabic text-base"
            onClick={() => goToAyah(surah - 1, 1)}
            disabled={surah <= 1}
          >
            السورة السابقة
          </button>
          <button
            type="button"
            className="btn-primary font-arabic text-base"
            onClick={() => goToAyah(surah + 1, 1)}
            disabled={surah >= 114}
          >
            السورة التالية
          </button>
        </div>

        <div className="ayah-card mb-6 text-center">
          <p className="section-label mb-1">
            Surah {surah} · Ayah {ayah} of {ayahCount}
          </p>
          <h1 className="arabic-text text-3xl">{data.asma.ar.long}</h1>
          <p className="mt-2 text-xs text-quran-muted">
            Tip: use ← → arrow keys to change ayah
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-quran-muted">
            Go to ayah
            <input
              type="number"
              min={1}
              max={ayahCount}
              value={ayah}
              onChange={(e) => goToAyahIndex(parseInt(e.target.value, 10) - 1)}
              className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-center text-quran-navy outline-none focus:border-quran-primary"
            />
          </label>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="btn-outline"
            onClick={() => goToAyahIndex(ayahIndex - 1)}
            disabled={ayah <= 1}
          >
            ← Previous Ayah
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => goToAyahIndex(ayahIndex + 1)}
            disabled={ayah >= ayahCount}
          >
            Next Ayah →
          </button>
        </div>

        <article className="ayah-card">
          <div className="mb-6 flex items-start justify-between gap-4">
            <AudioControl playing={playing} onPlay={play} onPause={pause} />
            <audio
              onEnded={onAudioEnded}
              src={currentAyah.audio?.url}
              ref={currentAudio}
              className="hidden"
            />
            <div className="flex flex-1 flex-row-reverse items-start gap-3">
              <div className="relative shrink-0">
                <img
                  src={numberAyah}
                  alt=""
                  className="h-10 w-8"
                  aria-hidden
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-quran-primary">
                  {ayah.toLocaleString('ar-u-nu-arab')}
                </span>
              </div>
              <p className="arabic-text flex-1 text-3xl leading-loose sm:text-4xl">
                {currentAyah.text.ar}
              </p>
            </div>
          </div>

          <div className="space-y-5 border-t border-slate-100 pt-5">
            <div>
              <p className="section-label mb-2">Translation</p>
              <p className="text-lg leading-relaxed text-slate-700">
                {currentAyah.text.read}
              </p>
            </div>
            <div>
              <p className="section-label mb-2">Tafsir</p>
              <p className="text-lg leading-relaxed text-slate-600">
                {currentAyah.translation.en}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default Ayah;
