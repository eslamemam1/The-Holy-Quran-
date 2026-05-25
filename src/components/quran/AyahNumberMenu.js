import { useEffect, useRef } from 'react';

export default function AyahNumberMenu({
  ayahNum,
  isPlaying,
  isSelected,
  open,
  onToggle,
  onClose,
  onListen,
  onGoToAyah,
  t,
  lang,
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const displayNum = ayahNum.toLocaleString(
    lang === 'ar' ? 'ar-u-nu-arab' : 'en'
  );

  let stateClass = '';
  if (isPlaying) stateClass = ' reader-ayah-num--active';
  else if (isSelected) stateClass = ' reader-ayah-num--selected';

  return (
    <span className="reader-ayah-num-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`reader-ayah-num${stateClass}`}
        title={t('reader.ayahMenuTitle')}
        aria-label={t('reader.ayahMenuTitleN', { n: ayahNum })}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
      >
        {displayNum}
      </button>
      {open && (
        <div
          className="reader-ayah-menu"
          role="menu"
          aria-label={t('reader.ayahMenuTitleN', { n: ayahNum })}
        >
          <button
            type="button"
            role="menuitem"
            className="reader-ayah-menu-item"
            onClick={() => {
              onListen(ayahNum);
              onClose();
            }}
          >
            <span className="reader-ayah-menu-icon" aria-hidden>
              ▶
            </span>
            {t('reader.menuListen')}
          </button>
          <button
            type="button"
            role="menuitem"
            className="reader-ayah-menu-item"
            onClick={() => {
              onGoToAyah(ayahNum);
              onClose();
            }}
          >
            <span className="reader-ayah-menu-icon" aria-hidden>
              ↗
            </span>
            {t('reader.menuGoToAyah')}
          </button>
        </div>
      )}
    </span>
  );
}
