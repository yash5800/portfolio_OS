import React, { useEffect, useMemo, useRef, useState } from "react";
import MainContext from "../context/mainContext";
import { Icon } from "../libs/icons";
import { identity, apps, packages, projects } from "../libs/data";
import AppIcon from "./AppIcon";

const Spotlight = () => {
  const { spotlightOpen, setSpotlightOpen, openApp, windows, closeAllWindows } =
    React.useContext(MainContext);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!spotlightOpen) return;
    setQuery("");
    setActive(0);
    const timer = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(timer);
  }, [spotlightOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = [];

    apps
      .filter((app) => !app.hidden)
      .forEach((app) => {
        items.push({
          id: `app-${app.id}`,
          title: app.title,
          subtitle: "app",
          icon: app.icon,
          tint: app.tint,
          image: app.image,
          keywords: app.title,
          run: () => openApp(app.id),
        });
      });

    projects.forEach((project, index) => {
      items.push({
        id: `project-${index}`,
        title: project.title,
        subtitle: "project",
        icon: "folder",
        tint: ["#fbbf24", "#b45309"],
        keywords: `${project.title} ${(project.skills || []).join(" ")}`,
        run: () => openApp("projects", { index }),
      });
    });

    packages.forEach((pkg, index) => {
      items.push({
        id: `package-${index}`,
        title: pkg.name,
        subtitle: "npm",
        icon: "npm",
        tint: ["#22d3ee", "#0f766e"],
        keywords: `${pkg.name} ${(pkg.tags || []).join(" ")} npm package`,
        run: () => openApp("package", { index, title: pkg.name }),
      });
    });

    items.push({
      id: "action-settings",
      title: "Change wallpaper",
      subtitle: "system",
      icon: "settings",
      tint: ["#94a3b8", "#334155"],
      keywords: "wallpaper background appearance settings theme",
      run: () => openApp("settings", { tab: "wallpapers" }),
    });

    items.push({
      id: "action-terminal",
      title: "Open terminal",
      subtitle: "system",
      icon: "terminal",
      tint: ["#1f2a3d", "#060a12"],
      keywords: "terminal shell command line",
      run: () => openApp("terminal"),
    });

    if (windows.length > 0) {
      items.push({
        id: "action-close-all",
        title: "Close all windows",
        subtitle: "system",
        icon: "close",
        tint: ["#64748b", "#1f2937"],
        keywords: "close all windows clean desktop",
        run: closeAllWindows,
      });
    }

    if (!q) return items.filter((item) => item.subtitle !== "system").slice(0, 7);

    return items
      .map((item) => {
        const haystack = `${item.title} ${item.subtitle} ${item.keywords}`.toLowerCase();
        if (!haystack.includes(q)) return null;
        const starts = item.title.toLowerCase().startsWith(q);
        const words = item.title.toLowerCase().split(/\s+/).some((word) => word.startsWith(q));
        return { ...item, score: starts ? 3 : words ? 2 : 1 };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [query, openApp, windows, closeAllWindows]);

  useEffect(() => {
    setActive((current) => Math.min(current, Math.max(0, results.length - 1)));
  }, [results.length]);

  if (!spotlightOpen) return null;

  const activate = (index) => {
    const item = results[index];
    if (!item) return;
    item.run();
    setSpotlightOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[9800] flex items-start justify-center px-4 pt-[14vh]"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) setSpotlightOpen(false);
      }}
    >
      <div
        className="overlay-fade absolute inset-0 bg-black/50"
        aria-hidden="true"
        onPointerDown={() => setSpotlightOpen(false)}
      />

      <div
        className="spotlight-in relative w-full max-w-[600px] overflow-hidden rounded-lg border border-[var(--line-strong)] bg-[#060b16]/96 shadow-[0_0_0_1px_rgba(0,0,0,0.6),6px_6px_0_rgba(0,0,0,0.5),0_40px_110px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
        role="dialog"
        aria-label="Spotlight search"
      >
        <div className="flex items-center gap-2.5 border-b border-[var(--line)] px-3.5 py-3">
          <span className="font-arcade text-[12px] leading-none text-[var(--accent)]">&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setSpotlightOpen(false);
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((current) => (current + 1) % Math.max(1, results.length));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive(
                  (current) => (current - 1 + results.length) % Math.max(1, results.length)
                );
              }
              if (event.key === "Enter") activate(active);
            }}
            placeholder="search apps, projects, packages…"
            aria-label="Search"
            className="w-full bg-transparent font-mono text-[14px] text-white placeholder:text-white/25 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setSpotlightOpen(false)}
            className="border border-white/12 px-1.5 py-0.5 font-arcade text-[8px] text-white/40 transition hover:border-white/30 hover:text-white/80"
          >
            esc
          </button>
        </div>

        <div className="os-scroll max-h-[46vh] overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="font-mono text-[12px] text-rose-300/80">
                no matches for “{query.trim()}”
              </p>
              <p className="mt-1 font-mono text-[10.5px] text-white/25">
                try “projects”, “react” or “theme”
              </p>
            </div>
          ) : (
            results.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onPointerEnter={() => setActive(index)}
                onClick={() => activate(index)}
                className={`flex w-full items-center gap-3 rounded px-2 py-2 text-left transition ${
                  active === index ? "bg-white/10" : "hover:bg-white/[0.05]"
                }`}
              >
                <span
                  className={`font-arcade text-[8px] ${
                    active === index ? "text-[var(--accent)]" : "text-white/25"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <AppIcon icon={item.icon} tint={item.tint} image={item.image} size={26} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-mono text-[12.5px] text-white/90">
                    {item.title}
                  </span>
                  <span className="label block">{item.subtitle}</span>
                </span>
                {active === index && (
                  <span className="border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/40">
                    enter
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--line)] px-3.5 py-1.5">
          <span className="font-mono text-[10px] text-white/30">
            {identity.host}:~ $
          </span>
          <span className="flex items-center gap-3 font-arcade text-[8px] text-white/30">
            <span>↑↓ move</span>
            <span>↵ open</span>
            <span className="hidden sm:inline">^k toggle</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Spotlight;
