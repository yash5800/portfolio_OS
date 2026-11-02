import React, { useMemo, useRef, useState } from "react";
import MainContext from "../context/mainContext";
import AppIcon from "./AppIcon";
import { appMap, apps, site } from "../libs/data";
import { resolveIcon } from "../libs/visuals";

const Dock = () => {
  const { openApp, windows, restoreWindow, focusWindow, isMobile, settings } =
    React.useContext(MainContext);
  const [pointerX, setPointerX] = useState(null);
  const [bouncing, setBouncing] = useState(null);
  const itemRefs = useRef({});
  const bounceTimer = useRef(null);

  // Dock layout comes from site.json; apps flagged `"dock": true` in
  // apps.json are inserted automatically, so a new app can add itself.
  const items = useMemo(() => {
    const configured = site.dock.items;
    const listed = new Set(
      configured.filter((item) => item.type === "app").map((item) => item.app)
    );
    const extras = apps
      .filter((app) => app.dock && !app.hidden && !listed.has(app.id))
      .map((app) => ({ type: "app", app: app.id }));

    if (extras.length === 0) return configured;
    const divider = configured.findIndex((item) => item.type === "divider");
    const at = divider === -1 ? configured.length : divider;
    return [...configured.slice(0, at), ...extras, ...configured.slice(at)];
  }, []);

  const scaleFor = (id) => {
    if (pointerX == null || isMobile) return 1;
    const node = itemRefs.current[id];
    if (!node) return 1;
    const rect = node.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const distance = Math.abs(pointerX - center);
    return 1 + 0.55 * Math.exp(-Math.pow(distance / 90, 2));
  };

  const windowsByApp = useMemo(() => {
    const map = {};
    windows.forEach((win) => {
      map[win.app] = map[win.app] || [];
      map[win.app].push(win);
    });
    return map;
  }, [windows]);

  const bounce = (id) => {
    setBouncing(id);
    clearTimeout(bounceTimer.current);
    bounceTimer.current = setTimeout(() => setBouncing(null), 760);
  };

  const launch = (appId) => {
    const open = windowsByApp[appId] || [];
    if (open.length === 0) {
      bounce(appId);
      openApp(appId);
      return;
    }
    const minimized = open.find((win) => win.minimized);
    if (minimized) {
      restoreWindow(minimized.id);
      return;
    }
    focusWindow(open[open.length - 1].id);
  };

  const tooltip =
    "pointer-events-none absolute -top-8 whitespace-nowrap border border-[var(--line-strong)] bg-[#050912]/95 px-2 py-1 font-arcade text-[9px] text-white/85 opacity-0 shadow-[3px_3px_0_rgba(0,0,0,0.5)] transition-opacity duration-150 group-hover:opacity-100";

  if (!settings.showDock) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-[9000] flex justify-center px-3 sm:bottom-3">
      <div
        className="glass-dock no-scrollbar pointer-events-auto relative flex max-w-full items-end gap-1.5 overflow-x-auto px-2 py-1.5 sm:gap-2 sm:overflow-visible sm:px-2.5"
        onPointerMove={(event) => setPointerX(event.clientX)}
        onPointerLeave={() => setPointerX(null)}
        role="toolbar"
        aria-label="Dock"
      >
        {items.map((item, index) => {
          if (item.type === "divider") {
            return (
              <span
                key={`divider-${index}`}
                className="mb-2 h-9 w-px self-end bg-white/20"
                aria-hidden="true"
              />
            );
          }

          if (item.type === "link") {
            const visual = resolveIcon(item.icon, item.image);
            const label = item.label || "Link";
            const scale = scaleFor(`link-${index}`);
            return (
              <a
                key={`link-${index}`}
                ref={(node) => {
                  itemRefs.current[`link-${index}`] = node;
                }}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="group relative flex shrink-0 origin-bottom flex-col items-center"
                style={{
                  transform: `scale(${scale}) translateY(${-(scale - 1) * 14}px)`,
                  transition: "transform 120ms ease-out",
                }}
              >
                <span className={tooltip}>{label}</span>
                <AppIcon
                  icon={visual.icon}
                  tint={visual.tint}
                  image={visual.image}
                  size={isMobile ? 40 : 46}
                  alt={label}
                />
                <span className="mt-1 h-[3px] w-[3px]" aria-hidden="true" />
              </a>
            );
          }

          const app = appMap[item.app];
          if (!app) return null;
          const scale = scaleFor(`app-${app.id}`);
          const running = (windowsByApp[app.id] || []).length > 0;

          return (
            <button
              key={`app-${app.id}`}
              type="button"
              ref={(node) => {
                itemRefs.current[`app-${app.id}`] = node;
              }}
              onClick={() => launch(app.id)}
              aria-label={`Open ${app.title}`}
              className="group relative flex shrink-0 origin-bottom flex-col items-center"
              style={{
                transform: `scale(${scale}) translateY(${-(scale - 1) * 14}px)`,
                transition: "transform 120ms ease-out",
              }}
            >
              <span className={tooltip}>{app.title}</span>
              <span className={bouncing === app.id ? "dock-bounce block" : "block"}>
                <AppIcon
                  icon={app.icon}
                  tint={app.tint}
                  image={app.image}
                  size={isMobile ? 40 : 46}
                />
              </span>
              <span
                className={`mt-1 h-[3px] rounded-full transition-all duration-300 ${
                  running ? "dock-running w-[5px]" : "w-0"
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
