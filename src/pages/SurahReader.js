import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
  Outlet,
  useOutletContext,
} from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBanner from '../components/ui/ErrorBanner';
import SurahReaderHeader from '../components/quran/SurahReaderHeader';
import ReadingModeView from '../components/quran/ReadingModeView';
import VerseModeView from '../components/quran/VerseModeView';
import { useQuran } from '../context/QuranContext';
import { clampSurah } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import { groupAyahsByMushafPage, clampSurahPage } from '../utils/mushaf';

function useSurahData(surah) {
  const { loadSurah, loadingSurah, fetchError, surahCache } = useQuran();
  const [quran, setQuran] = useState(() => surahCache[surah] ?? null);

  useEffect(() => {
    let active = true;
    if (surahCache[surah]) setQuran(surahCache[surah]);
    else setQuran(null);
    loadSurah(surah).then((d) => {
      if (active && d) setQuran(d);
    });
    return () => {
      active = false;
    };
  }, [surah, loadSurah, surahCache]);

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
        onSelectSurah={(n) =>
          location.pathname.includes('/verse/')
            ? goToVerse(n, 1)
            : goToSurah(n, 1)
        }
      />
      <audio
        ref={audioRef}
        src={data.recitation?.full}
        className="hidden"
        onEnded={() => setPlaying(false)}
      />
      <Outlet
        context={{
          surah,
          quran,
          data,
          showTranslation,
          remember,
          goToSurah,
          goToVerse,
        }}
      />
    </div>
  );
}

export function useReaderOutlet() {
  return useOutletContext();
}

export function SurahReadingRoute() {
  const { pageNum } = useParams();
  const { surah, quran, data, showTranslation, remember } = useReaderOutlet();
  const navigate = useNavigate();

  const pages = useMemo(() => groupAyahsByMushafPage(data.ayahs), [data.ayahs]);
  const totalPages = pages.length || 1;
  const currentPage = clampSurahPage(pageNum, totalPages);

  useEffect(() => {
    if (pages.length && pageNum && String(currentPage) !== String(pageNum)) {
      navigate(`/surah/${surah}/reading/page/${currentPage}`, { replace: true });
    }
  }, [pages.length, currentPage, pageNum, surah, navigate]);

  useEffect(() => {
    remember({
      surah,
      ayah: 1,
      view: 'reading',
      mushafPage: currentPage,
    });
  }, [surah, currentPage, remember]);

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

  return (
    <ReadingModeView
      surah={surah}
      quran={quran}
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

  return (
    <VerseModeView
      surah={surah}
      ayahId={ayahId}
      quran={quran}
      data={data}
      showTranslation={showTranslation}
      onVerseChange={(a) =>
        remember({ surah, ayah: a, view: 'verse', mushafPage: 1 })
      }
    />
  );
}

export default SurahReaderLayout;
