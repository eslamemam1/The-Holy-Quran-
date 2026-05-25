/** Outline icons — Quran Kareem Radio Cairo style */

function IconBase({ className = 'h-5 w-5', children, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconHome({ className }) {
  return (
    <IconBase className={className}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
    </IconBase>
  );
}

export function IconBook({ className }) {
  return (
    <IconBase className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </IconBase>
  );
}

export function IconPlay({ className }) {
  return (
    <IconBase className={className}>
      <polygon points="8 5 19 12 8 19 8 5" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function IconPause({ className }) {
  return (
    <IconBase className={className}>
      <rect x="7" y="5" width="4" height="14" fill="currentColor" stroke="none" />
      <rect x="13" y="5" width="4" height="14" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function IconHeadphones({ className }) {
  return (
    <IconBase className={className}>
      <path d="M3 14v3a3 3 0 0 0 3 3h1v-8H5a2 2 0 0 0-2 2z" />
      <path d="M21 14v3a3 3 0 0 1-3 3h-1v-8h1a2 2 0 0 1 2 2z" />
      <path d="M3 14h18" />
    </IconBase>
  );
}

export function IconBookmark({ className, filled = false }) {
  if (filled) {
    return (
      <IconBase className={className}>
        <path
          d="M6 2h12v20l-6-4-6 4V2z"
          fill="currentColor"
          stroke="currentColor"
        />
      </IconBase>
    );
  }
  return (
    <IconBase className={className}>
      <path d="M6 2h12v20l-6-4-6 4V2z" />
    </IconBase>
  );
}

export function IconOpenAyah({ className }) {
  return (
    <IconBase className={className}>
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M5 7v14h14" />
    </IconBase>
  );
}

export function IconOneAyah({ className }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" strokeWidth="2" />
    </IconBase>
  );
}

export function IconTranslation({ className }) {
  return (
    <IconBase className={className}>
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2H2v5" />
      <path d="m22 16-6-6" />
      <path d="m22 10-6 6-2 3" />
      <path d="M12 19h10" />
      <path d="M17 22v-5" />
    </IconBase>
  );
}

export function IconSearch({ className }) {
  return (
    <IconBase className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

export function IconChevronLeft({ className }) {
  return (
    <IconBase className={className}>
      <path d="m15 6-6 6 6 6" />
    </IconBase>
  );
}

export function IconChevronRight({ className }) {
  return (
    <IconBase className={className}>
      <path d="m9 6 6 6-6 6" />
    </IconBase>
  );
}
