import { useCallback, useEffect, useRef, useState } from 'react';
import { getAyahAudioUrl } from '../i18n/content';

function buildPageQueue(pageAyahs) {
  if (!pageAyahs?.length) return [];
  return pageAyahs
    .map((ayah) => ({
      insurah: ayah.number?.insurah,
      url: getAyahAudioUrl(ayah),
    }))
    .filter((item) => item.url && item.insurah != null);
}

function sliceQueueFromAyah(queue, fromInsurah) {
  if (fromInsurah == null) return queue;
  const idx = queue.findIndex((q) => q.insurah === fromInsurah);
  if (idx < 0) return queue;
  return queue.slice(idx);
}

/**
 * Plays ayah audio for the current mushaf page, then advances to the next
 * reading page until the surah ends.
 */
export function useReadingAyahAudio({
  enabled,
  pages,
  currentPage,
  totalPages,
  onAdvancePage,
  startFromInsurah,
}) {
  const audioRef = useRef(null);
  const queueRef = useRef([]);
  const pageIndexRef = useRef(0);
  const autoAdvanceRef = useRef(false);
  const playingRef = useRef(false);
  const prevPageRef = useRef(currentPage);
  const startFromRef = useRef(startFromInsurah);

  startFromRef.current = startFromInsurah;

  const [playing, setPlaying] = useState(false);
  const [activeAyahInsurah, setActiveAyahInsurah] = useState(null);

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.onended = null;
      el.removeAttribute('src');
    }
    queueRef.current = [];
    autoAdvanceRef.current = false;
    playingRef.current = false;
    setPlaying(false);
    setActiveAyahInsurah(null);
  }, []);

  const playNextRef = useRef(() => {});

  playNextRef.current = () => {
    const el = audioRef.current;
    if (!el || !playingRef.current) return;

    const queue = queueRef.current;
    if (!queue.length) {
      const nextPageIndex = pageIndexRef.current + 1;
      if (nextPageIndex < totalPages) {
        autoAdvanceRef.current = true;
        onAdvancePage(nextPageIndex + 1);
      } else {
        playingRef.current = false;
        setPlaying(false);
        setActiveAyahInsurah(null);
      }
      return;
    }

    const item = queue.shift();
    queueRef.current = queue;
    setActiveAyahInsurah(item.insurah);
    el.src = item.url;
    el.load();
    el.onended = () => playNextRef.current();
    el.play().catch(() => stop());
  };

  const startPage = useCallback(
    (pageIndex, fromInsurah = null) => {
      const pageAyahs = pages[pageIndex]?.ayahs ?? [];
      const fullQueue = buildPageQueue(pageAyahs);
      const queue = sliceQueueFromAyah(fullQueue, fromInsurah ?? startFromRef.current);
      if (!queue.length) return false;

      pageIndexRef.current = pageIndex;
      queueRef.current = [...queue];
      playingRef.current = true;
      setPlaying(true);
      playNextRef.current();
      return true;
    },
    [pages]
  );

  const start = useCallback(
    (fromInsurah = null) => {
      stop();
      return startPage(currentPage - 1, fromInsurah ?? startFromRef.current);
    },
    [currentPage, startPage, stop]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    playingRef.current = false;
    setPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (
      playingRef.current === false &&
      (queueRef.current.length > 0 || activeAyahInsurah != null)
    ) {
      playingRef.current = true;
      setPlaying(true);
      audioRef.current?.play().catch(() => stop());
      return;
    }
    start();
  }, [activeAyahInsurah, start, stop]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else resume();
  }, [playing, pause, resume]);

  useEffect(() => {
    if (!enabled) stop();
  }, [enabled, stop]);

  useEffect(() => {
    if (!enabled || !playingRef.current) {
      prevPageRef.current = currentPage;
      return;
    }
    if (autoAdvanceRef.current) {
      prevPageRef.current = currentPage;
      return;
    }
    if (prevPageRef.current !== currentPage) {
      prevPageRef.current = currentPage;
      startPage(currentPage - 1, startFromRef.current);
    }
  }, [currentPage, enabled, startPage]);

  useEffect(() => {
    if (!enabled || !autoAdvanceRef.current || !playingRef.current) return;
    autoAdvanceRef.current = false;
    prevPageRef.current = currentPage;
    const firstAyah = pages[currentPage - 1]?.ayahs?.[0]?.number?.insurah ?? null;
    startPage(currentPage - 1, firstAyah);
  }, [currentPage, enabled, startPage, pages]);

  return {
    audioRef,
    playing,
    activeAyahInsurah,
    start,
    stop,
    pause,
    resume,
    toggle,
  };
}
