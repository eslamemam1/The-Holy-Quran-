import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import qurankareem from '../assets/images/qurankareem.png';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBanner from '../components/ui/ErrorBanner';
import SearchBar from '../components/ui/SearchBar';
import ContinueReading from '../components/quran/ContinueReading';
import BookmarkButton from '../components/quran/BookmarkButton';
import { useQuran } from '../context/QuranContext';

function matchesSearch(surah, num, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (String(num) === q || String(num).startsWith(q)) return true;
  const fields = [
    surah.asma?.en?.short,
    surah.asma?.en?.long,
    surah.asma?.translation?.en,
    surah.asma?.ar?.short,
    surah.asma?.ar?.long,
  ];
  return fields.some((f) => f?.toLowerCase().includes(q));
}

function Home() {
  const { surahList, listLoading, listError, bookmarks, getSurahMeta, goToSurah } =
    useQuran();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!surahList) return [];
    return surahList
      .map((s, i) => ({ ...s, num: i + 1 }))
      .filter((s) => matchesSearch(s, s.num, search));
  }, [surahList, search]);

  const bookmarkedSurahs = useMemo(
    () =>
      bookmarks.map((num) => ({
        num,
        meta: getSurahMeta(num),
      })),
    [bookmarks, getSurahMeta]
  );

  return (
    <div className="w-full">
      <section className="hero-pattern relative mb-12 overflow-hidden px-4 py-16 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <img className="paner mb-6" src={qurankareem} alt="Holy Quran" />
          <h1 className="text-2xl font-bold text-white sm:text-4xl">
            Read & Listen to the Holy Quran
          </h1>
          <p className="mt-3 max-w-lg text-sm text-white/80 sm:text-base">
            Browse all 114 surahs with Arabic text, translation, and recitation.
          </p>
        </div>
      </section>

      <ContinueReading />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {bookmarkedSurahs.length > 0 && (
          <section className="mb-10">
            <p className="section-label mb-2">Bookmarks</p>
            <div className="flex flex-wrap gap-2">
              {bookmarkedSurahs.map(({ num, meta }) => (
                <Link
                  key={num}
                  to={`/surah/${num}`}
                  onClick={() => goToSurah(num)}
                  className="rounded-full bg-quran-primary/10 px-4 py-2 text-sm font-semibold text-quran-primary transition hover:bg-quran-primary hover:text-white"
                >
                  {num}. {meta?.asma?.en?.short ?? `Surah ${num}`}
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label">Browse</p>
            <h2 className="text-2xl font-bold text-quran-navy">All Surahs</h2>
          </div>
          <span className="shrink-0 rounded-full bg-quran-primary/10 px-3 py-1 text-sm font-semibold text-quran-primary">
            {listLoading ? '…' : `${filtered.length} shown`}
          </span>
        </div>

        <div className="mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, meaning, or number…"
          />
        </div>

        <ErrorBanner message={listError} />

        {listLoading ? (
          <LoadingSpinner label="Loading surahs..." />
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-quran-muted">
            No surahs match &ldquo;{search}&rdquo;
          </p>
        ) : (
          <div className="grid gap-3 pb-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((name) => (
              <Link
                key={name.num}
                to={`/surah/${name.num}`}
                onClick={() => goToSurah(name.num)}
                className="block no-underline"
              >
                <div className="surah-card group" title="Open this surah">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-quran-primary text-lg font-bold text-white shadow-sm transition-transform group-hover:scale-105">
                      {name.num}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="truncate font-bold text-quran-navy group-hover:text-quran-primary">
                        {name.asma.en.short}
                      </p>
                      <p className="truncate text-sm text-quran-muted">
                        {name.asma.translation.en}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <div className="text-right">
                      <p className="arabic-text text-lg leading-tight">
                        {name.asma.ar.long}
                      </p>
                      <p className="text-xs font-medium text-quran-muted">
                        {name.ayahCount} ayahs
                      </p>
                    </div>
                    <BookmarkButton surahNumber={name.num} />
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
