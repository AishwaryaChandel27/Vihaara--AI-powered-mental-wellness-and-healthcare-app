import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BookOpen,
  ChartNoAxesCombined,
  Heart,
  House,
  Info,
  Leaf,
  Menu,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { Lotus } from "./GardenArt";
import { useSettings } from "@/contexts/SettingsContext";
const routes = [
  { path: "/", label: "My sanctuary", short: "Home", icon: House },
  {
    path: "/journal",
    label: "Reflection journal",
    short: "Journal",
    icon: BookOpen,
  },
  {
    path: "/mood",
    label: "Mood garden",
    short: "Mood",
    icon: ChartNoAxesCombined,
  },
  { path: "/chat", label: "AI companion", short: "Chat", icon: MessageCircle },
  { path: "/mental-peace", label: "Quiet room", short: "Unwind", icon: Leaf },
  {
    path: "/health-advice",
    label: "Everyday wellbeing",
    short: "Wellbeing",
    icon: Heart,
  },
];
export default function Layout({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const [menu, setMenu] = useState(false);
  const { theme, toggleTheme } = useSettings();
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMenu(false);
    scroll.current?.scrollTo(0, 0);
  }, [path]);
  const nav = (
    <>
      <p className="nav-label">YOUR PERSONAL SPACE</p>
      {routes.map(({ path: href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={path === href ? "page" : undefined}
          className={`nav-item ${path === href ? "active" : ""}`}
        >
          <Icon size={19} />
          <span>{label}</span>
          {path === href && <span className="nav-dot" />}
        </Link>
      ))}
    </>
  );
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <aside className="sanctuary-sidebar">
        <Link href="/" className="brand">
          <Lotus size={42} />
          <div>
            vihaara<span>COME BACK TO YOURSELF</span>
          </div>
        </Link>
        <nav aria-label="Main navigation">{nav}</nav>
        <div className="sidebar-note">
          <Leaf size={24} />
          <p>
            A little space.
            <br />A softer pace.
          </p>
          <span>You’re welcome just as you are.</span>
        </div>
        <div className="sidebar-bottom">
          <Link href="/about" className="nav-item">
            <Info size={18} />
            About Vihaara
          </Link>
          <Link href="/settings" className="nav-item">
            <Settings size={18} />
            Settings & privacy
          </Link>
          <button onClick={toggleTheme} className="nav-item">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}{" "}
            {theme === "dark" ? "Daylight" : "Evening"} mode
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <Link href="/" className="mobile-brand">
            <Lotus size={30} />
            vihaara
          </Link>
          <div className="desktop-breadcrumb">
            Your space <span>/</span>{" "}
            {routes.find((r) => r.path === path)?.label ||
              (path === "/settings" ? "Settings & privacy" : "About Vihaara")}
          </div>
          <div className="flex items-center gap-3">
            <span className="privacy-pill">
              <ShieldCheck size={14} />
              <span>On your device</span>
            </span>
            <button
              className="mobile-menu"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? "Close navigation" : "Open navigation"}
              aria-expanded={menu}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </header>
        {menu && (
          <nav className="mobile-drawer" aria-label="Mobile navigation">
            {nav}
            <Link href="/settings" className="nav-item">
              <Settings size={18} />
              Settings & privacy
            </Link>
            <Link href="/about" className="nav-item">
              <Info size={18} />
              About Vihaara
            </Link>
            <button className="nav-item" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}Switch
              appearance
            </button>
          </nav>
        )}
        <div className="page-scroll" ref={scroll}>
          <main
            id="main-content"
            tabIndex={-1}
            className="page-content"
            key={path}
          >
            {children}
          </main>
          <footer className="page-footer">
            <Lotus size={21} />
            <span>Small moments. Room to grow.</span>
            <Link href="/about">Privacy & care</Link>
          </footer>
        </div>
        <nav className="bottom-nav" aria-label="Quick navigation">
          {routes.slice(0, 5).map(({ path: href, short, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={href === path ? "page" : undefined}
              className={href === path ? "active" : ""}
            >
              <Icon size={20} />
              <span>{short}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
