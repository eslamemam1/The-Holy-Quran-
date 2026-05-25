import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Surah from '../pages/Surah';
import Ayah from '../pages/Ayah';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';
import { QuranProvider, useQuran } from '../context/QuranContext';

function RedirectToLastSurah() {
  const { lastRead } = useQuran();
  return <Navigate to={`/surah/${lastRead.surah}`} replace />;
}

function RedirectToLastAyah() {
  const { lastRead } = useQuran();
  return (
    <Navigate
      to={`/ayah/${lastRead.surah}/${lastRead.ayah}`}
      replace
    />
  );
}

function AppRoutes() {
  return (
    <div className="App flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surah/:surahId" element={<Surah />} />
          <Route path="/surah" element={<RedirectToLastSurah />} />
          <Route path="/ayah/:surahId/:ayahId" element={<Ayah />} />
          <Route path="/ayah" element={<RedirectToLastAyah />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QuranProvider>
      <AppRoutes />
    </QuranProvider>
  );
}

export default App;
