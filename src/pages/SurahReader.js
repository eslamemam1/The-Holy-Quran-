import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
  useOutletContext,
} from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBanner from '../components/ui/ErrorBanner';
import SurahReaderHeader from '../components/quran/SurahReaderHeader';
import ReadingModeView from '../components/quran/ReadingModeView';
import VerseModeView from '../components/quran/VerseModeView';
import { useQuran } from '../context/QuranContext';
import { clampSurah, clampAyah } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import { groupAyahsByMushafPage, clampSurahPage } from '../utils/mushaf';
import { getSurahRecitationUrl } from '../i18n/content';

function useSurahData(surah) {
  const { loadSurah, loadingSurah, fetchError, surahCache } = useQuran();
  const [quran, setQuran] = useState(() => surahCache[surah] ?? null);
  const cacheRef = useRef(surahCache);

  cacheRef.current = surahCache;

  useEffect(() => {
    let active = true;
    const cached = cacheRef.current[surah];

    if (cached) {
      setQuran(cached);
    } else {
      setQuran(null);
    }

    loadSurah(surah).then((d) => {
      if (active && d) setQuran(d);
    });

    return () => {
      active = false;
    };
  }, [surah, loadSurah]);

  return {
    quran,
    data: quran?.data,
    loading: loadingSurah === surah && !quran,
    fetchError,
  };
}

export function SurahReaderLayout() {
  const { surahId } = useParams();
  const { t } = useLanguage();
  const { goToSurah, goToVerse, remember } = useQuran();
  const location = useLocation();
  const surah = clampSurah(surahId);
  const { quran, data, loading, fetchError } = useSurahData(surah);

  const [playing, setPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const audioRef = useRef();
  const continueListeningRef = useRef(false);

  const stopAudio = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setPlaying(false);
  }, []);

  const handleSelectSurah = useCallback(
    (n) => {
      const next = clampSurah(n);
      if (next === surah) return;
      continueListeningRef.current = playing;
      stopAudio();
      if (location.pathname.includes('/verse/')) {
        goToVerse(next, 1);
      } else {
        goToSurah(next, 1);
      }
    },
    [surah, playing, stopAudio, location.pathname, goToVerse, goToSurah]
  );

  useEffect(() => {
    const el = audioRef.current;
    const src = getSurahRecitationUrl(data);
    if (!el || !src) return;

    if (continueListeningRef.current) {
      continueListeningRef.current = false;
      el.load();
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
      return;
    }

    el.pause();
    el.currentTime = 0;
    setPlaying(false);
  }, [surah, data?.recitation?.full]);

  const outletContext = useMemo(
    () => ({
      surah,
      quran,
      data,
      showTranslation,
      remember,
      goToSurah,
      goToVerse,
    }),
    [surah, quran, data, showTranslation, remember, goToSurah, goToVerse]
  );

  if (loading) {
    return (
      <div className="reader-page min-h-[60vh]">
        <LoadingSpinner label={t('surah.loading')} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="reader-page min-h-[60vh] px-4">
        <ErrorBanner message={fetchError || t('surah.notFound')} />
      </div>
    );
  }

  return (
    <div className="reader-page min-h-screen bg-quran-cream pb-16">
      <SurahReaderHeader
        surah={surah}
        data={data}
        playing={playing}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation((v) => !v)}
        onPlay={() => {
          audioRef.current?.play();
          setPlaying(true);
        }}
        onPause={() => {
          audioRef.current?.pause();
          setPlaying(false);
        }}
        onSelectSurah={handleSelectSurah}
      />
      <audio
        ref={audioRef}
        src={getSurahRecitationUrl(data)}
        className="hidden"
        onEnded={() => setPlaying(false)}
      />
      <Outlet context={outletContext} />
    </div>
  );
}

export function useReaderOutlet() {
  return useOutletContext();
}

export function SurahReadingRoute() {
  const { pageNum } = useParams();
  const { surah, data, showTranslation, remember } = useReaderOutlet();
  const navigate = useNavigate();

  const pages = useMemo(() => groupAyahsByMushafPage(data.ayahs), [data.ayahs]);
  const totalPages = pages.length || 1;
  const currentPage = clampSurahPage(pageNum, totalPages);
  const pageMismatch =
    pages.length > 0 && pageNum && String(currentPage) !== String(pageNum);

  useEffect(() => {
    if (pageMismatch) return;
    remember({
      surah,
      ayah: 1,
      view: 'reading',
      mushafPage: currentPage,
    });
  }, [surah, currentPage, remember, pageMismatch]);

  const goPage = useCallback(
    (p) => {
      const next = clampSurahPage(p, totalPages);
      navigate(`/surah/${surah}/reading/page/${next}`);
    },
    [surah, totalPages, navigate]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') goPage(currentPage - 1);
      if (e.key === 'ArrowRight') goPage(currentPage + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentPage, goPage]);

  if (pageMismatch) {
    return (
      <Navigate
        to={`/surah/${surah}/reading/page/${currentPage}`}
        replace
      />
    );
  }

  return (
    <ReadingModeView
      surah={surah}
      data={data}
      pageNum={currentPage}
      totalPages={totalPages}
      showTranslation={showTranslation}
      onPageChange={goPage}
    />
  );
}

export function SurahVerseRoute() {
  const { ayahId } = useParams();
  const { surah, quran, data, showTranslation, remember } = useReaderOutlet();
  const ayahCount = data.ayahs.length;
  const ayah = clampAyah(ayahId, ayahCount);
  const ayahMismatch = String(ayah) !== String(ayahId);

  useEffect(() => {
    if (ayahMismatch) return;
    remember({ surah, ayah, view: 'verse', mushafPage: 1 });
  }, [surah, ayah, remember, ayahMismatch]);

  if (ayahMismatch) {
    return (
      <Navigate to={`/surah/${surah}/verse/${ayah}`} replace />
    );
  }

  return (
    <VerseModeView
      surah={surah}
      ayah={ayah}
      ayahCount={ayahCount}
      quran={quran}
      data={data}
      showTranslation={showTranslation}
    />
  );
}

export default SurahReaderLayout;
