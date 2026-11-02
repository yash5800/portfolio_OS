import appsData from "../data/apps.json";
import siteData from "../data/site.json";
import profileData from "../data/profile.json";
import projectsData from "../data/projects.json";
import packagesData from "../data/packages.json";
import wallpapersData from "../data/wallpapers.json";

/**
 * Everything the desktop renders comes from src/data/*.json.
 * Edit those files to add projects, packages, apps, wallpapers or desktop
 * icons — no component changes required.
 */

export const site = siteData;
export const identity = siteData.identity;
export const siteLogo = siteData.identity.site.logo;
export const profile = profileData;
export const apps = appsData;

export const appMap = Object.fromEntries(appsData.map((app) => [app.id, app]));

export const projects = projectsData.items;
export const projectImageBase = projectsData.imageBase;

export const packages = packagesData;

export const wallpapers = wallpapersData.items;
export const defaultWallpaperId = wallpapersData.default;

export const getWallpaper = (id) =>
  wallpapers.find((w) => w.id === id) ||
  wallpapers.find((w) => w.id === defaultWallpaperId) ||
  wallpapers[0];

export const wallpaperBackground = (wallpaper) => {
  if (!wallpaper) return {};
  if (wallpaper.type === "image") {
    return { backgroundImage: `url("${asset(wallpaper.src)}")` };
  }
  return { backgroundImage: wallpaper.value };
};

/** Resolve a public asset path against Vite's deployed base path. */
export const asset = (path = "") => {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${String(path).replace(/^\/+/, "")}`;
};

/** Arcade accent presets, applied through the --accent CSS variables. */
export const accents = [
  { id: "cyan", name: "Cyan", color: "#22d3ee", soft: "rgba(34,211,238,0.18)" },
  { id: "magenta", name: "Magenta", color: "#f472b6", soft: "rgba(244,114,182,0.18)" },
  { id: "lime", name: "Lime", color: "#a3e635", soft: "rgba(163,230,53,0.18)" },
  { id: "amber", name: "Amber", color: "#fbbf24", soft: "rgba(251,191,36,0.18)" },
  { id: "violet", name: "Violet", color: "#a78bfa", soft: "rgba(167,139,250,0.18)" },
  { id: "ice", name: "Ice", color: "#7dd3fc", soft: "rgba(125,211,252,0.18)" },
];

export const settingsStorageKey = "portfolio-os.settings.v3";
