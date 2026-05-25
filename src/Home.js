import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import qurankareem from './qurankareem.png';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner';

function Home(props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quran, setQuran] = useState([]);

  useEffect(() => {
    axios
      .get('https://quran-endpoint.vercel.app/quran/')
      .then((response) => {
        setLoading(false);
        setError('');
        setQuran(response.data);
      })
      .catch(() => {
        setLoading(false);
        setError('Could not load surahs. Please refresh the page.');
        setQuran([]);
      });
  }, []);

  const handleSurahClick = (e) => {
    const num = parseInt(
      e.target.getAttribute('data-surah') ||
        e.target.closest('[data-surah]')?.getAttribute('data-surah'),
      10
    );
    if (!Number.isNaN(num) && num >= 1 && num <= 114) {
      props.x(num);
    } else {
      props.x(1);
    }
  };

  return (
    <div className="w-full">
      <section className="hero-pattern relative mb-12 overflow-hidden px-4 py-16 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <img
            className="paner mb-6"
            src={qurankareem}
            alt="Holy Quran"
          />
          <h1 className="text-2xl font-bold text-white sm:text-4xl">
            Read & Listen to the Holy Quran
          </h1>
          <p className="mt-3 max-w-lg text-sm text-white/80 sm:text-base">
            Browse all 114 surahs with Arabic text, translation, and recitation.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="section-label">Browse</p>
            <h2 className="text-2xl font-bold text-quran-navy">All Surahs</h2>
          </div>
          <span className="rounded-full bg-quran-primary/10 px-3 py-1 text-sm font-semibold text-quran-primary">
            114 surahs
          </span>
        </div>

        <ErrorBanner message={error} />

        {loading ? (
          <LoadingSpinner label="Loading surahs..." />
        ) : (
          <div className="grid gap-3 pb-8 sm:grid-cols-2 lg:grid-cols-3">
            {quran.data?.map((name, id) => (
              <Link
                key={id}
                to="/surah"
                onClick={handleSurahClick}
                className="block no-underline"
              >
                <div
                  className="surah-card group"
                  data-surah={id + 1}
                  title="Open this surah"
                >
                  <div className="flex min-w-0 items-center gap-3" data-surah={id + 1}>
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-quran-primary text-lg font-bold text-white shadow-sm transition-transform group-hover:scale-105"
                      data-surah={id + 1}
                    >
                      <span data-surah={id + 1}>{id + 1}</span>
                    </div>
                    <div className="min-w-0 text-left" data-surah={id + 1}>
                      <p
                        className="truncate font-bold text-quran-navy group-hover:text-quran-primary"
                        data-surah={id + 1}
                      >
                        {name.asma.en.short}
                      </p>
                      <p
                        className="truncate text-sm text-quran-muted"
                        data-surah={id + 1}
                      >
                        {name.asma.translation.en}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right" data-surah={id + 1}>
                    <p
                      className="arabic-text text-lg leading-tight"
                      data-surah={id + 1}
                    >
                      {name.asma.ar.long}
                    </p>
                    <p className="text-xs font-medium text-quran-muted" data-surah={id + 1}>
                      {name.ayahCount} ayahs
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
