import { useQuran } from '../../context/QuranContext';
import { useLanguage } from '../../context/LanguageContext';
import { clampSurah } from '../../utils/storage';
import { getSurahName, getSurahMeaning } from '../../i18n/content';

export default function SurahPicker({ currentSurah, onSelect, className = '' }) {
  const { surahList, listLoading } = useQuran();
  const { t, lang } = useLanguage();

  if (listLoading || !surahList?.length) return null;

  return (
    <label className={`block ${className}`}>
      <span className="section-label mb-1 block">{t('surah.jumpTo')}</span>
      <select
        value={clampSurah(currentSurah)}
        onChange={(e) => onSelect(parseInt(e.target.value, 10))}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-base font-medium text-quran-navy shadow-sm outline-none focus:border-quran-primary focus:ring-2 focus:ring-quran-primary/20"
      >
        {surahList.map((s, i) => (
          <option key={s.slug ?? i} value={i + 1}>
            {i + 1}. {getSurahName(s, lang)} — {getSurahMeaning(s, lang)}
          </option>
        ))}
      </select>
    </label>
  );
}
