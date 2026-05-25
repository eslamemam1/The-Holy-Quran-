import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const ReaderMobileChromeContext = createContext(null);

export function ReaderMobileChromeProvider({ children }) {
  const [pageNav, setPageNavState] = useState(null);

  const setPageNav = useCallback((next) => {
    setPageNavState(next);
  }, []);

  const clearPageNav = useCallback(() => {
    setPageNavState(null);
  }, []);

  const value = useMemo(
    () => ({ pageNav, setPageNav, clearPageNav }),
    [pageNav, setPageNav, clearPageNav]
  );

  return (
    <ReaderMobileChromeContext.Provider value={value}>
      {children}
    </ReaderMobileChromeContext.Provider>
  );
}

export function useReaderMobileChrome() {
  const ctx = useContext(ReaderMobileChromeContext);
  if (!ctx) {
    throw new Error(
      'useReaderMobileChrome must be used within ReaderMobileChromeProvider'
    );
  }
  return ctx;
}
