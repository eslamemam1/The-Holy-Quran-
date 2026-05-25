import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  clampSurah,
  getBookmarks,
  getLastRead,
  setLastRead,
  toggleBookmark as toggleBookmarkStorage,
} from '../utils/storage';

const QuranContext = createContext(null);

export function QuranProvider({ children }) {
  const navigate = useNavigate();
  const [surahList, setSurahList] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [surahCache, setSurahCache] = useState({});
  const [loadingSurah, setLoadingSurah] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [bookmarks, setBookmarks] = useState(getBookmarks);
  const [lastRead, setLastReadState] = useState(getLastRead);

  useEffect(() => {
    axios
      .get('https://quran-endpoint.vercel.app/quran/')
      .then((res) => {
        setSurahList(res.data?.data ?? []);
        setListError('');
        setListLoading(false);
      })
      .catch(() => {
        setListError('errors.loadList');
        setListLoading(false);
      });
  }, []);

  const remember = useCallback(({ surah, ayah, view }) => {
    const saved = setLastRead({ surah, ayah, view });
    setLastReadState(saved);
    return saved;
  }, []);

  const loadSurah = useCallback(async (surahNum) => {
    const n = clampSurah(surahNum);
    let cached = null;
    setSurahCache((prev) => {
      if (prev[n]) cached = prev[n];
      return prev;
    });
    if (cached) {
      setFetchError('');
      return cached;
    }
    setLoadingSurah(n);
    setFetchError('');
    try {
      const res = await axios.get(
        `https://quran-endpoint.vercel.app/quran/${n}`
      );
      const data = res.data;
      setSurahCache((prev) => ({ ...prev, [n]: data }));
      setLoadingSurah(null);
      return data;
    } catch {
      setFetchError('errors.loadSurah');
      setLoadingSurah(null);
      return null;
    }
  }, []);

  const goToSurah = useCallback(
    (surahNum, mushafPage = 1) => {
      const n = clampSurah(surahNum);
      const p = Math.max(1, parseInt(mushafPage, 10) || 1);
      remember({ surah: n, ayah: 1, view: 'reading', mushafPage: p });
      navigate(`/surah/${n}/reading/page/${p}`);
    },
    [navigate, remember]
  );

  const goToReading = useCallback(
    (surahNum, page = 1) => {
      goToSurah(surahNum, page);
    },
    [goToSurah]
  );

  const goToVerse = useCallback(
    (surahNum, ayahNum = 1) => {
      const s = clampSurah(surahNum);
      const a = Math.max(1, parseInt(ayahNum, 10) || 1);
      remember({ surah: s, ayah: a, view: 'verse', mushafPage: 1 });
      navigate(`/surah/${s}/verse/${a}`);
    },
    [navigate, remember]
  );

  const goToAyah = goToVerse;

  const toggleBookmark = useCallback((surahNum) => {
    const next = toggleBookmarkStorage(surahNum);
    setBookmarks(next);
    return next;
  }, []);

  const getSurahMeta = useCallback(
    (surahNum) => {
      const n = clampSurah(surahNum);
      return surahList?.find((_, i) => i + 1 === n) ?? null;
    },
    [surahList]
  );

  const value = useMemo(
    () => ({
      surahList,
      listLoading,
      listError,
      surahCache,
      loadingSurah,
      fetchError,
      bookmarks,
      lastRead,
      loadSurah,
      goToSurah,
      goToReading,
      goToVerse,
      goToAyah,
      remember,
      toggleBookmark,
      getSurahMeta,
      isLoading: (n) => loadingSurah === clampSurah(n),
    }),
    [
      surahList,
      listLoading,
      listError,
      surahCache,
      loadingSurah,
      fetchError,
      bookmarks,
      lastRead,
      loadSurah,
      goToSurah,
      goToReading,
      goToVerse,
      goToAyah,
      remember,
      toggleBookmark,
      getSurahMeta,
    ]
  );

  return (
    <QuranContext.Provider value={value}>{children}</QuranContext.Provider>
  );
}

export function useQuran() {
  const ctx = useContext(QuranContext);
  if (!ctx) throw new Error('useQuran must be used within QuranProvider');
  return ctx;
}
