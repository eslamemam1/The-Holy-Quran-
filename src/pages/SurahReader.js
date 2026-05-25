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
import { ReaderMobileChromeProvider } from '../context/ReaderMobileChromeContext';
import { useReadingAyahAudio } from '../hooks/useReadingAyahAudio';

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
  const { surahId, pageNum } = useParams();
  const { t } = useLanguage();
  const { goToSurah, goToVerse, remember } = useQuran();
  const location = useLocation();
  const navigate = useNavigate();
  const surah = clampSurah(surahId);
  const { quran, data, loading, fetchError } = useSurahData(surah);

  const isReadingMode = location.pathname.includes('/reading');
  const isVerseMode = location.pathname.includes('/verse/');

  const pages = useMemo(
    () => groupAyahsByMushafPage(data?.ayahs ?? []),
    [data?.ayahs]
  );
  const totalPages = pages.length || 1;
  const currentPage = clampSurahPage(pageNum, totalPages);

  const [showTranslation, setShowTranslation] = useState(false);
  const continueReadingAudioRef = useRef(false);
  const [selectedAyahInsurah, setSelectedAyahInsurah] = useState(null);

  const goReadingPage = useCallback(
    (p) => {
      const next = clampSurahPage(p, totalPages);
      navigate(`/surah/${surah}/reading/page/${next}`);
    },
    [surah, totalPages, navigate]
  );

  const {
    audioRef: readingAudioRef,
    playing: readingPlaying,
    activeAyahInsurah,
    start: startReadingAudio,
    playSingle: playSingleAyah,
    stop: stopReadingAudio,
    pause: pauseReadingAudio,
    resume: resumeReadingAudio,
  } = useReadingAyahAudio({
    enabled: isReadingMode && !!data?.ayahs?.length,
    pages,
    currentPage,
    totalPages,
    onAdvancePage: goReadingPage,
    startFromInsurah: selectedAyahInsurah,
  });

  useEffect(() => {
    if (!isReadingMode || !pages.length) return;
    const first = pages[currentPage - 1]?.ayahs?.[0]?.number?.insurah;
    setSelectedAyahInsurah(first ?? null);
  }, [surah, currentPage, pages, isReadingMode]);

  const handlePlayFromAyah = useCallback(
    (insurah) => {
      setSelectedAyahInsurah(insurah);
      startReadingAudio(insurah);
    },
    [startReadingAudio]
  );

  const handlePlayAyahOnly = useCallback(
    (insurah) => {
      setSelectedAyahInsurah(insurah);
      playSingleAyah(insurah);
    },
    [playSingleAyah]
  );

  const handleSelectSurah = useCallback(
    (n) => {
      const next = clampSurah(n);
      if (next === surah) return;

      if (isReadingMode) {
        continueReadingAudioRef.current = readingPlaying;
        stopReadingAudio();
      } else {
        stopReadingAudio();
      }

      if (isVerseMode) {
        goToVerse(next, 1);
      } else {
        goToSurah(next, 1);
      }
    },
    [
      surah,
      isReadingMode,
      isVerseMode,
      readingPlaying,
      stopReadingAudio,
      goToVerse,
      goToSurah,
    ]
  );

  useEffect(() => {
    if (!isReadingMode) stopReadingAudio();
  }, [isReadingMode, stopReadingAudio]);

  useEffect(() => {
    if (!isReadingMode || !data?.ayahs?.length) return;
    if (continueReadingAudioRef.current) {
      continueReadingAudioRef.current = false;
      startReadingAudio();
    }
  }, [surah, data?.ayahs, isReadingMode, startReadingAudio]);

  const handleReadingPlay = useCallback(() => {
    if (readingPlaying) resumeReadingAudio();
    else startReadingAudio(selectedAyahInsurah);
  }, [
    readingPlaying,
    resumeReadingAudio,
    startReadingAudio,
    selectedAyahInsurah,
  ]);

  const handleReadingPause = useCallback(() => {
    pauseReadingAudio();
  }, [pauseReadingAudio]);

  const outletContext = useMemo(
    () => ({
      surah,
      quran,
      data,
      showTranslation,
      remember,
      goToSurah,
      goToVerse,
      activeAyahInsurah,
      selectedAyahInsurah,
      onPlayAyah: handlePlayFromAyah,
      onPlayAyahOnly: handlePlayAyahOnly,
    }),
    [
      surah,
      quran,
      data,
      showTranslation,
      remember,
      goToSurah,
      goToVerse,
      activeAyahInsurah,
      selectedAyahInsurah,
      handlePlayFromAyah,
      handlePlayAyahOnly,
    ]
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
    <ReaderMobileChromeProvider>
      <div className="reader-page reader-page--mobile-dock min-h-screen bg-quran-cream md:pb-16">
        <SurahReaderHeader
          surah={surah}
          data={data}
          showTranslation={showTranslation}
          showListen={isReadingMode}
          playing={readingPlaying}
          onToggleTranslation={() => setShowTranslation((v) => !v)}
          onPlay={handleReadingPlay}
          onPause={handleReadingPause}
          onSelectSurah={handleSelectSurah}
        />
        {isReadingMode && (
          <audio ref={readingAudioRef} className="hidden" preload="auto" />
        )}
        <Outlet context={outletContext} />
      </div>
    </ReaderMobileChromeProvider>
  );
}

export function useReaderOutlet() {
  return useOutletContext();
}

export function SurahReadingRoute() {
  const { pageNum } = useParams();
  const {
    surah,
    data,
    showTranslation,
    remember,
    activeAyahInsurah,
    selectedAyahInsurah,
    onPlayAyah,
    onPlayAyahOnly,
  } = useReaderOutlet();
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
      activeAyahInsurah={activeAyahInsurah}
      selectedAyahInsurah={selectedAyahInsurah}
      onPlayAyah={onPlayAyah}
      onPlayAyahOnly={onPlayAyahOnly}
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
