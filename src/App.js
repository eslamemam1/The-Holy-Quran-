import './App.css';
import React from 'react';
import Surah from './Surah';
import Ayah from './Ayah';
import Home from './Home';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quran, setQuran] = useState([]);
  const [counter, setCounter] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://quran-endpoint.vercel.app/quran/${counter}`)
      .then((response) => {
        setLoading(false);
        setError('');
        setQuran(response.data);
      })
      .catch(() => {
        setLoading(false);
        setError('Something went wrong. Please try again.');
        setQuran([]);
      });
  }, [counter]);

  const next = () => {
    setCounter((c) => (c < 114 ? c + 1 : 114));
  };

  const Previous = () => {
    setCounter((c) => (c > 1 ? c - 1 : 1));
  };

  return (
    <div className="App min-h-screen flex flex-col">
      <ScrollToTop surahNumber={counter} />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                x={setCounter}
                loading={loading}
                error={error}
                quran={quran}
                counter={counter}
              />
            }
          />
          <Route
            path="/surah"
            element={
              <Surah
                Previous={Previous}
                next={next}
                loading={loading}
                error={error}
                quran={quran}
                counter={counter}
                setCounter={setCounter}
              />
            }
          />
          <Route
            path="/ayah"
            element={
              <Ayah
                Previous={Previous}
                next={next}
                loading={loading}
                error={error}
                quran={quran}
                counter={counter}
                setCounter={setCounter}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
