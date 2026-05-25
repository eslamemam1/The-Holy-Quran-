import { useQuran } from '../context/QuranContext';

export default function ContinueReading() {
  const { lastRead, goToSurah, goToAyah, getSurahMeta } = useQuran();
  const meta = getSurahMeta(lastRead.surah);
  const name = meta?.asma?.en?.short ?? `Surah ${lastRead.surah}`;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-10 -mt-6 rounded-2xl border border-quran-gold/30 bg-white p-5 shadow-card sm:p-6">
        <p className="section-label mb-1">Continue reading</p>
        <p className="text-lg font-bold text-quran-navy">
          {name}
          {lastRead.view === 'ayah' && (
            <span className="font-normal text-quran-muted">
              {' '}
              · Ayah {lastRead.ayah}
            </span>
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              lastRead.view === 'ayah'
                ? goToAyah(lastRead.surah, lastRead.ayah)
                : goToSurah(lastRead.surah)
            }
          >
            Resume
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => goToSurah(lastRead.surah)}
          >
            Open surah
          </button>
        </div>
      </div>
    </div>
  );
}
