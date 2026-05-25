export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-quran-primary/20 border-t-quran-primary"
        role="status"
        aria-label={label}
      />
      <p className="text-sm font-medium text-quran-muted">{label}</p>
    </div>
  );
}
