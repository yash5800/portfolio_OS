import React, { createContext } from "react";

const MainContext = createContext({
  windows: [],
  focusedId: null,
  isMobile: false,
  openApp: () => {},
  closeWindow: () => {},
  focusWindow: () => {},
  minimizeWindow: () => {},
  restoreWindow: () => {},
  toggleMaximize: () => {},
  moveWindow: () => {},
  resizeWindow: () => {},
  windowsForApp: () => [],
  closeAllWindows: () => {},
  spotlightOpen: false,
  setSpotlightOpen: () => {},
  settings: { wallpaper: "arcade", accent: "cyan", reduceMotion: false, crt: true },
  setWallpaper: () => {},
  setAccent: () => {},
  setReduceMotion: () => {},
  setCrt: () => {},
  setRetro: () => {},
  setSound: () => {},
  setShowDock: () => {},
  setBootEnabled: () => {},
  setLight: () => {},
  canInstall: false,
  promptInstall: async () => false,
});

export default MainContext;
