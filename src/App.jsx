import React, { useCallback, useEffect, useRef, useState } from "react";
import MainContext from "./context/mainContext";
import Desktop from "./components/Desktop";
import Spotlight from "./components/Spotlight";
import BootScreen from "./components/BootScreen";
import {
  accents,
  appMap,
  defaultWallpaperId,
  getWallpaper,
  settingsStorageKey,
  wallpapers,
  wallpaperBackground,
} from "./libs/data";

const MOTION_KEY = "pixelify.booted";

const defaultSettings = {
  wallpaper: defaultWallpaperId,
  accent: "cyan",
  reduceMotion: false,
  crt: true,
  retro: false,
  sound: false,
  showDock: true,
  bootEnabled: true,
  light: false,
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(settingsStorageKey);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return {
      wallpaper: wallpapers.some((item) => item.id === parsed.wallpaper)
        ? parsed.wallpaper
        : defaultSettings.wallpaper,
      accent: accents.some((item) => item.id === parsed.accent)
        ? parsed.accent
        : defaultSettings.accent,
      reduceMotion: Boolean(parsed.reduceMotion),
      crt: parsed.crt === undefined ? defaultSettings.crt : Boolean(parsed.crt),
      retro: Boolean(parsed.retro),
      sound: Boolean(parsed.sound),
      showDock: parsed.showDock === undefined ? true : Boolean(parsed.showDock),
      bootEnabled: parsed.bootEnabled === undefined ? true : Boolean(parsed.bootEnabled),
      light: Boolean(parsed.light),
    };
  } catch {
    return defaultSettings;
  }
};

const computeSpawnRect = (app, openCount, isMobile) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight - 32;

  if (isMobile) {
    return { x: 4, y: 4, w: viewportWidth - 8, h: viewportHeight - 84 };
  }

  const margin = 20;
  const width = Math.min(app.size.width, viewportWidth - margin * 2);
  const height = Math.min(app.size.height, viewportHeight - 118);
  const cascade = (openCount % 5) * 24;

  return {
    x: Math.max(margin, Math.round((viewportWidth - width) / 2 - 24 + cascade)),
    y: Math.max(12, Math.round((viewportHeight - height) / 2 - 20 + cascade)),
    w: width,
    h: height,
  };
};

const initialBoot = () => {
  try {
    return !sessionStorage.getItem(MOTION_KEY);
  } catch {
    return true;
  }
};

const App = () => {
  const [settings, setSettings] = useState(loadSettings);
  const [windows, setWindows] = useState([]);
  const [focusedId, setFocusedId] = useState(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 820
  );
  const [installEvent, setInstallEvent] = useState(null);
  const [boot] = useState(() => initialBoot() && loadSettings().bootEnabled);

  const zCounter = useRef(10);
  const windowCounter = useRef(0);
  const autoOpened = useRef(false);

  const wallpaper = getWallpaper(settings.wallpaper);

  /* ---------------- settings: CSS variables + persistence ---------------- */
  useEffect(() => {
    const accent = accents.find((item) => item.id === settings.accent) ?? accents[0];
    document.documentElement.style.setProperty("--accent", accent.color);
    document.documentElement.style.setProperty("--accent-soft", accent.soft);
    document.documentElement.dataset.motion = settings.reduceMotion ? "reduced" : "full";
    document.documentElement.dataset.retro = settings.retro ? "on" : "off";
    document.documentElement.dataset.appearance = settings.light ? "light" : "dark";
  }, [settings.accent, settings.reduceMotion, settings.retro, settings.light]);

  useEffect(() => {
    try {
      localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
    } catch {
      /* ignore unavailable storage */
    }
  }, [settings]);

  /* ---------------- responsive ---------------- */
  useEffect(() => {
    const query = window.matchMedia("(max-width: 819px)");
    const onChange = (event) => setIsMobile(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  /* ---------------- install prompt ---------------- */
  useEffect(() => {
    try {
      sessionStorage.setItem(MOTION_KEY, "1");
    } catch {
      /* ignore */
    }
    const onPrompt = (event) => {
      event.preventDefault();
      setInstallEvent(event);
    };
    const onInstalled = () => setInstallEvent(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installEvent) return false;
    installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    return choice?.outcome === "accepted";
  }, [installEvent]);

  /* ---------------- window manager ---------------- */
  const openApp = useCallback(
    (appId, payload) => {
      const app = appMap[appId];
      if (!app) return;

      const existing = windows.find(
        (win) =>
          win.app === appId &&
          (appId !== "package" || win.payload?.index === payload?.index)
      );

      if (existing) {
        zCounter.current += 1;
        const z = zCounter.current;
        setWindows((current) =>
          current.map((win) =>
            win.id === existing.id
              ? {
                  ...win,
                  minimized: false,
                  z,
                  payload: payload ?? win.payload,
                  title: payload?.title ?? win.title,
                }
              : win
          )
        );
        setFocusedId(existing.id);
        return;
      }

      windowCounter.current += 1;
      const id = windowCounter.current;
      zCounter.current += 1;
      const rect = computeSpawnRect(app, windows.length, isMobile);

      setWindows((current) => [
        ...current,
        {
          id,
          app: appId,
          payload,
          title: payload?.title,
          ...rect,
          z: zCounter.current,
          minimized: false,
          maximized: false,
        },
      ]);
      setFocusedId(id);
    },
    [windows, isMobile]
  );

  const focusWindow = useCallback(
    (id) => {
      const target = windows.find((win) => win.id === id);
      if (!target) return;
      if (focusedId === id && !target.minimized && !target.closing) return;
      zCounter.current += 1;
      const z = zCounter.current;
      setWindows((current) =>
        current.map((win) =>
          win.id === id ? { ...win, z, minimized: false } : win
        )
      );
      setFocusedId(id);
    },
    [windows, focusedId]
  );

  const closeWindow = useCallback(
    (id) => {
      const remaining = windows.filter((win) => win.id !== id);
      setWindows(remaining);
      setFocusedId((current) => {
        if (current !== id) return current;
        const visible = remaining.filter((win) => !win.minimized);
        return visible.length ? visible[visible.length - 1].id : null;
      });
    },
    [windows]
  );

  const minimizeWindow = useCallback(
    (id) => {
      const remaining = windows.filter((win) => win.id !== id && !win.minimized);
      setWindows((current) =>
        current.map((win) => (win.id === id ? { ...win, minimized: true } : win))
      );
      setFocusedId((current) =>
        current === id ? (remaining.length ? remaining[remaining.length - 1].id : null) : current
      );
    },
    [windows]
  );

  const restoreWindow = useCallback((id) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((current) =>
      current.map((win) => (win.id === id ? { ...win, minimized: false, z } : win))
    );
    setFocusedId(id);
  }, []);

  const toggleMaximize = useCallback((id) => {
    setWindows((current) =>
      current.map((win) =>
        win.id === id ? { ...win, maximized: !win.maximized } : win
      )
    );
  }, []);

  const moveWindow = useCallback((id, x, y) => {
    setWindows((current) =>
      current.map((win) => (win.id === id ? { ...win, x, y } : win))
    );
  }, []);

  const resizeWindow = useCallback((id, w, h) => {
    setWindows((current) =>
      current.map((win) => (win.id === id ? { ...win, w, h } : win))
    );
  }, []);

  const closeAllWindows = useCallback(() => {
    setWindows([]);
    setFocusedId(null);
  }, []);

  const windowsForApp = useCallback(
    (appId) => windows.filter((win) => win.app === appId),
    [windows]
  );

  /* ---------------- open the portfolio home once per session ---------------- */
  useEffect(() => {
    if (autoOpened.current) return;
    autoOpened.current = true;
    openApp("home");
  }, [openApp]);

  /* ---------------- keyboard shortcuts ---------------- */
  useEffect(() => {
    const onKeyDown = (event) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSpotlightOpen((open) => !open);
        return;
      }
      if (meta && event.code === "Space") {
        event.preventDefault();
        setSpotlightOpen((open) => !open);
        return;
      }
      if (meta && event.altKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        openApp("terminal");
        return;
      }
      if (meta && event.key.toLowerCase() === "w" && focusedId != null) {
        event.preventDefault();
        closeWindow(focusedId);
      }
      if (meta && event.key.toLowerCase() === "m" && focusedId != null) {
        event.preventDefault();
        minimizeWindow(focusedId);
      }
      if (event.key === "Escape") {
        setSpotlightOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusedId, closeWindow, openApp, minimizeWindow]);

  const contextValue = {
    windows,
    focusedId,
    isMobile,
    openApp,
    closeWindow,
    focusWindow,
    minimizeWindow,
    restoreWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
    windowsForApp,
    closeAllWindows,
    spotlightOpen,
    setSpotlightOpen,
    settings,
    setWallpaper: (id) => setSettings((current) => ({ ...current, wallpaper: id })),
    setAccent: (id) => setSettings((current) => ({ ...current, accent: id })),
    setReduceMotion: (value) =>
      setSettings((current) => ({ ...current, reduceMotion: value })),
    setCrt: (value) => setSettings((current) => ({ ...current, crt: value })),
    setRetro: (value) => setSettings((current) => ({ ...current, retro: value })),
    setSound: (value) => setSettings((current) => ({ ...current, sound: value })),
    setShowDock: (value) => setSettings((current) => ({ ...current, showDock: value })),
    setBootEnabled: (value) => setSettings((current) => ({ ...current, bootEnabled: value })),
    setLight: (value) => setSettings((current) => ({ ...current, light: value })),
    canInstall: Boolean(installEvent),
    promptInstall,
  };

  return (
    <MainContext.Provider value={contextValue}>        <div
        className="relative h-[100dvh] w-full select-none overflow-hidden bg-[#04060d]"
        data-motion={settings.reduceMotion ? "reduced" : "full"}
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            key={wallpaper.id}
            className={`absolute inset-0 animate-[fade-in_700ms_ease] ${
              wallpaper.type === "image"
                ? "wallpaper-art"
                : `bg-cover bg-center ${settings.reduceMotion ? "" : "wallpaper-drift"}`
            }`}
            style={wallpaperBackground(wallpaper)}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,10,0.45)_0%,rgba(2,4,10,0.08)_30%,rgba(2,4,10,0.5)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
        </div>

        <div className="relative z-10 h-full w-full">
          <Desktop />
        </div>

        <Spotlight />

        {settings.crt && (
          <div className="pointer-events-none fixed inset-0 z-[9600]" aria-hidden="true">
            <div className="scanlines absolute inset-0" />
            <div className="crt-vignette absolute inset-0" />
          </div>
        )}

        {boot && <BootScreen />}
      </div>
    </MainContext.Provider>
  );
};

export default App;
