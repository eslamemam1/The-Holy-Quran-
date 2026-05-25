import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll to top when route or surah number changes */
export default function ScrollToTop({ surahNumber }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname, surahNumber]);

  return null;
}
