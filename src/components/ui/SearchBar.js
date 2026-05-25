import { IconSearch } from './Icons';

export default function SearchBar({ value, onChange, placeholder = 'Search surah...' }) {
  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-quran-muted"
        aria-hidden
      >
        <IconSearch className="h-5 w-5" />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-quran-border bg-quran-surface py-3 pl-11 pr-4 text-base shadow-card outline-none transition focus:border-quran-primary focus:ring-2 focus:ring-quran-primary/20"
        aria-label="Search surahs"
      />
    </div>
  );
}
