import { clampSurahPage } from '../../utils/mushaf';
import { useLanguage } from '../../context/LanguageContext';

export default function MushafPagination({
  currentPage,
  totalPages,
  mushafPageNumber,
  juz,
  onPageChange,
  onPrevSurah,
  onNextSurah,
  canPrevSurah,
  canNextSurah,
}) {
  const { t } = useLanguage();
  const page = clampSurahPage(currentPage, totalPages);

  return (
    <div className="mushaf-pager sticky bottom-0 z-10 -mx-4 border-t border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-quran-muted">
          <span>
            {t('mushaf.pageOfSurah', { current: page, total: totalPages })}
          </span>
          <span>
            {t('mushaf.mushafPage', { page: mushafPageNumber })}
            {juz ? ` · ${t('mushaf.juz', { juz })}` : ''}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="btn-outline px-3 py-2 text-sm"
            onClick={onPrevSurah}
            disabled={!canPrevSurah && page <= 1}
            title={t('surah.prevSurah')}
          >
            ⟨ {t('surah.label')}
          </button>
          <button
            type="button"
            className="btn-outline px-3 py-2 text-sm"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
          >
            {t('mushaf.first')}
          </button>
          <button
            type="button"
            className="btn-outline px-4 py-2 text-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            {t('mushaf.prevPage')}
          </button>

          <label className="flex items-center gap-1.5 text-sm font-medium">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={page}
              onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
              className="w-14 rounded-lg border border-slate-200 px-2 py-1.5 text-center outline-none focus:border-quran-primary"
              aria-label={t('mushaf.page')}
            />
          </label>

          <button
            type="button"
            className="btn-primary px-4 py-2 text-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            {t('mushaf.nextPage')}
          </button>
          <button
            type="button"
            className="btn-outline px-3 py-2 text-sm"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
          >
            {t('mushaf.last')}
          </button>
          <button
            type="button"
            className="btn-outline px-3 py-2 text-sm"
            onClick={onNextSurah}
            disabled={!canNextSurah && page >= totalPages}
            title={t('surah.nextSurah')}
          >
            {t('surah.label')} ⟩
          </button>
        </div>
      </div>
    </div>
  );
}
