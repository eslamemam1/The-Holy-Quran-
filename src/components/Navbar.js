import { NavLink, Link } from 'react-router-dom';
import icon from '../icon.png';
import { useQuran } from '../context/QuranContext';

const navClass = ({ isActive }) =>
  `nav-link ${isActive ? 'nav-link-active' : ''}`;

export default function Navbar() {
  const { lastRead } = useQuran();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <img
            src={icon}
            alt="Quran Kareem"
            className="h-8 w-10 shrink-0 object-contain"
          />
          <span className="truncate text-base font-bold text-quran-primary sm:text-lg">
            Quran Kareem
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to={`/surah/${lastRead.surah}`} className={navClass}>
            Surah
          </NavLink>
          <NavLink
            to={`/ayah/${lastRead.surah}/${lastRead.ayah}`}
            className={navClass}
          >
            Ayah
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
