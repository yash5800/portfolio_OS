import React, { useEffect, useRef, useState } from "react";
import MainContext from "../context/mainContext";
import { appMap, identity, profile } from "../libs/data";
import { Icon } from "../libs/icons";
import AppIcon from "./AppIcon";

const useClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);
  return now;
};

const MenuItem = ({ children, onClick, icon, href }) => {
  const className =
    "flex w-full items-center justify-between gap-6 rounded px-2.5 py-1.5 text-left text-[12px] text-white/80 transition hover:bg-white/10 hover:text-white";
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        className={className}
      >
        <span>{children}</span>
        {icon && <Icon name={icon} size={12} className="text-white/35" />}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      <span>{children}</span>
      {icon && <Icon name={icon} size={12} className="text-white/35" />}
    </button>
  );
};

const MenuBar = () => {
  const {
    openApp,
    windows,
    focusedId,
    setSpotlightOpen,
    isMobile,
    closeAllWindows,
    minimizeWindow,
    settings,
    setCrt,
  } = React.useContext(MainContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);
  const now = useClock();

  const focusedWindow = windows.find((win) => win.id === focusedId);
  const activeApp = focusedWindow ? appMap[focusedWindow.app] : null;

  useEffect(() => {
    if (!menuOpen) return;
    const onClickAway = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const time = now.toLocaleTimeString(navigator.language || "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const date = now.toLocaleDateString(navigator.language || "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const openItem = (appId) => {
    setMenuOpen(false);
    openApp(appId);
  };

  return (
    <header className="glass-bar relative z-[9500] flex h-8 shrink-0 select-none items-center justify-between gap-3 px-2.5 text-[12px]">
      <div className="flex min-w-0 items-center gap-1.5" ref={menuRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className={`flex items-center gap-1.5 rounded px-1.5 py-1 transition hover:bg-white/10 ${
              menuOpen ? "bg-white/10" : ""
            }`}
          >
            <span className="flex h-4 w-4 items-center justify-center bg-[var(--accent)] text-[10px] font-bold leading-none text-black">
              ▚
            </span>
            <span className="font-arcade text-[10px] leading-none text-white/90">
              {identity.handle}
            </span>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="menu-in absolute left-0 top-[calc(100%+6px)] w-60 rounded-lg border border-[var(--line-strong)] bg-[#070c16]/95 p-1.5 shadow-[5px_5px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            >
              <p className="label px-2.5 pb-1 pt-1">session</p>
              <MenuItem onClick={() => openItem("home")} icon="home">
                Home
              </MenuItem>
              <MenuItem onClick={() => openItem("projects")} icon="folder">
                Projects
              </MenuItem>
              <MenuItem onClick={() => openItem("packages")} icon="box">
                Packages
              </MenuItem>
              <MenuItem onClick={() => openItem("terminal")} icon="terminal">
                Terminal
              </MenuItem>
              <div className="my-1 h-px bg-white/10" />
              <p className="label px-2.5 pb-1 pt-1">you</p>
              <MenuItem onClick={() => openItem("about")} icon="user">
                About {profile.name.split(" ")[0]}
              </MenuItem>
              <MenuItem onClick={() => openItem("contact")} icon="mail">
                Contact
              </MenuItem>
              <MenuItem onClick={() => openItem("settings")} icon="settings">
                Settings
              </MenuItem>
              <div className="my-1 h-px bg-white/10" />
              <MenuItem href={profile.socials[0]?.href} icon="github">
                GitHub
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMenuOpen(false);
                  closeAllWindows();
                }}
                icon="close"
              >
                Close all windows
              </MenuItem>
            </div>
          )}
        </div>

        <span className="mx-0.5 h-3.5 w-px bg-white/12" aria-hidden="true" />

        <span className="truncate font-mono text-[11px] uppercase tracking-[0.08em] text-white/45">
          {activeApp ? activeApp.title : "desktop"}
        </span>

        {!isMobile && (
          <nav className="relative ml-2 hidden items-center gap-0.5 md:flex">
            {["File", "Edit", "View", "Window", "Help"].map((label) => (
              <button key={label} type="button" onClick={() => setActiveMenu(activeMenu === label ? null : label)} className={`rounded px-2 py-1 font-mono text-[10px] text-white/50 transition hover:bg-white/10 hover:text-white ${activeMenu === label ? "bg-white/10 text-white" : ""}`}>{label}</button>
            ))}
            {activeMenu && <div className="menu-in absolute left-0 top-[calc(100%+7px)] z-[9600] w-52 rounded-lg border border-[var(--line-strong)] bg-[#070c16]/95 p-1.5 shadow-xl backdrop-blur-2xl">
              <p className="label px-2.5 pb-1 pt-1">{activeMenu}</p>
              {(activeMenu === "File" ? [["New Finder window","finder"],["Open Terminal","terminal"],["Open Settings","settings"]] : activeMenu === "Edit" ? [["Search portfolio","search"],["Copy email","contact"]] : activeMenu === "View" ? [["Projects","projects"],["Stack Atlas","stack-atlas"],["Project Timeline","timeline"],["Arcade","games"],["System Monitor","monitor"]] : activeMenu === "Window" ? [["Minimize all", "minimize"],["Close all windows","closeall"]] : [["About this portfolio","about"],["Contact","contact"],["Keyboard shortcuts","home"]]).map(([text, action]) => <button key={text} onClick={() => { setActiveMenu(null); if(action==="search") setSpotlightOpen(true); else if(action==="closeall") closeAllWindows(); else if(action==="minimize") windows.forEach(w=>!w.minimized && minimizeWindow(w.id)); else openApp(action); }} className="block w-full rounded px-2.5 py-1.5 text-left text-[11px] text-white/70 hover:bg-white/10">{text}</button>)}
            </div>}
          </nav>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {!isMobile && (
          <span className="mr-1 hidden items-center gap-1.5 font-mono text-[10px] text-lime-300/70 lg:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300" />
            {identity.status}
          </span>
        )}

        <button
          type="button"
          onClick={() => setSpotlightOpen(true)}
          aria-label="Spotlight search"
          className="flex items-center gap-1.5 rounded px-1.5 py-1 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <Icon name="search" size={12} />
          {!isMobile && (
            <span className="hidden font-mono text-[10px] text-white/35 lg:inline">
              ^K
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setCrt(!settings.crt)}
          aria-label="Toggle CRT scanlines"
          aria-pressed={settings.crt}
          className={`hidden rounded p-1 transition hover:bg-white/10 sm:block ${
            settings.crt ? "text-[var(--accent)]" : "text-white/30"
          }`}
        >
          <Icon name="monitor" size={12} />
        </button>

        {!isMobile && (
          <div className="mx-0.5 flex items-center gap-1.5 text-white/45">
            <Icon name="wifi" size={12} />
            <Icon name="battery" size={14} />
          </div>
        )}

        {!isMobile && (
          <span className="hidden font-mono text-[10px] text-white/40 sm:inline">
            {date}
          </span>
        )}
        <span className="font-arcade text-[10px] leading-none text-white/85">{time}</span>

        <button
          type="button"
          onClick={() => openApp("settings")}
          aria-label="Open settings"
          className="rounded p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <Icon name="settings" size={12} />
        </button>

        <button
          type="button"
          onClick={() => openItem("about")}
          aria-label="About me"
          className="rounded p-0.5 transition hover:bg-white/10"
        >
          <AppIcon icon="user" tint={["#a3e635", "#3f6212"]} size={17} />
        </button>
      </div>
    </header>
  );
};

export default MenuBar;
