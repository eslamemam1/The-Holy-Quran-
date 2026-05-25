import { NavLink, Link } from 'react-router-dom';
import icon from '../../assets/images/icon.png';
import { useQuran } from '../../context/QuranContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { IconHome, IconBook } from '../ui/Icons';

const navClass = ({ isActive }) =>
  `nav-link ${isActive ? 'nav-link-active' : ''}`;

export default function Navbar() {
  const { lastRead } = useQuran();
  const { t } = useLanguage();

  const readPath =
    lastRead.view === 'verse'
      ? `/surah/${lastRead.surah}/verse/${lastRead.ayah}`
      : `/surah/${lastRead.surah}/reading/page/${lastRead.mushafPage || 1}`;

  return (
    <header className="sticky top-0 z-50 border-b border-quran-border bg-quran-surface/98 shadow-card backdrop-blur-md">
      <nav className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <img
            src={icon}
            alt={t('appName')}
            className="h-9 w-9 shrink-0 rounded-xl object-contain"
          />
          <span className="truncate text-base font-bold text-quran-primary sm:text-lg">
            {t('appName')}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageToggle />
          <NavLink to="/" end className={navClass}>
            <IconHome className="nav-link-icon h-[1.125rem] w-[1.125rem]" />
            <span className="hidden sm:inline">{t('nav.home')}</span>
          </NavLink>
          <NavLink to={readPath} className={navClass}>
            <IconBook className="nav-link-icon h-[1.125rem] w-[1.125rem]" />
            <span className="hidden sm:inline">{t('nav.read')}</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
