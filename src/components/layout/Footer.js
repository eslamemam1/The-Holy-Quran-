export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/80">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold text-quran-primary">
          © {year} Quran Kareem. All rights reserved.
        </p>
        <p className="mt-1 text-sm text-quran-muted">
          Prepared by Eslam Emam
        </p>
      </div>
    </footer>
  );
}
