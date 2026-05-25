import { useEffect, useState } from 'react';

/** Matches Tailwind `md` — below 768px = mobile, 768px+ = desktop */
export const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function useIsDesktop() {
  return useMediaQuery(DESKTOP_MEDIA_QUERY);
}

export function useIsMobile() {
  return !useMediaQuery(DESKTOP_MEDIA_QUERY);
}
