import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Surah from './Surah';
import Ayah from './Ayah';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { QuranProvider, useQuran } from './context/QuranContext';

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
