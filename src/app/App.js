import './App.css';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Home from '../pages/Home';
import {
  SurahReaderLayout,
  SurahReadingRoute,
  SurahVerseRoute,
} from '../pages/SurahReader';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';
import { QuranProvider, useQuran } from '../context/QuranContext';
import { LanguageProvider } from '../context/LanguageContext';
import { clampSurah } from '../utils/storage';

function RedirectToLastRead() {
  const { lastRead } = useQuran();
  if (lastRead.view === 'verse') {
    return (
      <Navigate
        to={`/surah/${lastRead.surah}/verse/${lastRead.ayah}`}
        replace
      />
    );
  }
  const page = lastRead.mushafPage || 1;
  return (
    <Navigate
      to={`/surah/${lastRead.surah}/reading/page/${page}`}
      replace
    />
  );
}

function SurahIndexRedirect() {
  const { surahId } = useParams();
  const { lastRead } = useQuran();
  const surah = clampSurah(surahId);
  if (lastRead.surah === surah && lastRead.view === 'verse') {
    return (
      <Navigate
        to={`/surah/${surah}/verse/${lastRead.ayah}`}
        replace
      />
    );
  }
  const page =
    lastRead.surah === surah && lastRead.mushafPage
      ? lastRead.mushafPage
      : 1;
  return <Navigate to={`/surah/${surah}/reading/page/${page}`} replace />;
}

function LegacyRedirects() {
  const { surahId, pageNum, ayahId } = useParams();
  const s = clampSurah(surahId);
  if (ayahId) {
    return <Navigate to={`/surah/${s}/verse/${ayahId}`} replace />;
  }
  const p = pageNum || '1';
  return <Navigate to={`/surah/${s}/reading/page/${p}`} replace />;
}

function AppRoutes() {
  return (
    <div className="App flex min-h-screen flex-col bg-quran-cream">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/surah/:surahId" element={<SurahReaderLayout />}>
            <Route path="reading/page/:pageNum" element={<SurahReadingRoute />} />
            <Route
              path="reading"
              element={<Navigate to="page/1" replace />}
            />
            <Route path="verse/:ayahId" element={<SurahVerseRoute />} />
            <Route index element={<SurahIndexRedirect />} />
          </Route>

          <Route path="/surah" element={<RedirectToLastRead />} />

          {/* Legacy URLs */}
          <Route
            path="/surah/:surahId/page/:pageNum"
            element={<LegacyRedirects />}
          />
          <Route path="/surah/:surahId/scroll" element={<LegacyRedirects />} />
          <Route path="/ayah/:surahId/:ayahId" element={<LegacyRedirects />} />
          <Route path="/ayah" element={<RedirectToLastRead />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <QuranProvider>
        <AppRoutes />
      </QuranProvider>
    </LanguageProvider>
  );
}

export default App;
