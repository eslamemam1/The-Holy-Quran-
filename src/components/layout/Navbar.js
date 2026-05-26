import { NavLink, Link } from "react-router-dom";
import icon from "../../assets/images/icon.png";
import { useQuran } from "../../context/QuranContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import { IconHome, IconBook } from "../ui/Icons";

const navClass = ({ isActive }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`;

export default function Navbar() {
  const { lastRead } = useQuran();
  const { t } = useLanguage();

  const readPath =
    lastRead.view === "verse"
      ? `/surah/${lastRead.surah}/verse/${lastRead.ayah}`
      : `/surah/${lastRead.surah}/reading/page/${lastRead.mushafPage || 1}`;

  return (
    <header className="site-navbar">
      <nav className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <img
            src={icon}
            alt={t("appName")}
            className="h-9 w-9 shrink-0 rounded-xl object-contain opacity-80"
          />
          <span className="hidden truncate text-base font-bold text-quran-primary md:inline md:text-lg">
            {t("appName")}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1 md:gap-2">
          <NavLink to="/" end className={`${navClass} md:hidden`}>
            <IconHome className="nav-link-icon h-[1.125rem] w-[1.125rem]" />
            <span className="sr-only">{t("nav.home")}</span>
          </NavLink>
          <LanguageToggle />
          <div className="hidden md:flex md:items-center md:gap-2">
            <NavLink to="/" end className={navClass}>
              <IconHome className="nav-link-icon h-[1.125rem] w-[1.125rem]" />
              <span>{t("nav.home")}</span>
            </NavLink>
            <NavLink to={readPath} className={navClass}>
              <IconBook className="nav-link-icon h-[1.125rem] w-[1.125rem]" />
              <span>{t("nav.read")}</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
