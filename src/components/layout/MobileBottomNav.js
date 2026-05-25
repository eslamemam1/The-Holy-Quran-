import { NavLink } from 'react-router-dom';
import { useQuran } from '../../context/QuranContext';
import { useLanguage } from '../../context/LanguageContext';
import { IconHome, IconBook } from '../ui/Icons';

const tabClass = ({ isActive }) =>
  `mobile-tab ${isActive ? 'mobile-tab-active' : ''}`;

export default function MobileBottomNav() {
  const { lastRead } = useQuran();
  const { t } = useLanguage();

  const readPath =
    lastRead.view === 'verse'
      ? `/surah/${lastRead.surah}/verse/${lastRead.ayah}`
      : `/surah/${lastRead.surah}/reading/page/${lastRead.mushafPage || 1}`;

  return (
    <nav
      className="mobile-bottom-nav md:hidden"
      aria-label={t('nav.mobile')}
    >
      <NavLink to="/" end className={tabClass}>
        <IconHome className="h-5 w-5" />
        <span>{t('nav.home')}</span>
      </NavLink>
      <NavLink to={readPath} className={tabClass}>
        <IconBook className="h-5 w-5" />
        <span>{t('nav.read')}</span>
      </NavLink>
    </nav>
  );
}
