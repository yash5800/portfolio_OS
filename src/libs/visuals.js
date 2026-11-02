import { appMap, site } from "./data";
import { icons } from "./iconMap";

const fallbackTint = ["#334155", "#0b1020"];

/**
 * Resolve a JSON icon reference. `key` may be an app id ("projects"), the
 * special "brand" key, or any icon name registered in libs/iconMap.js.
 * An explicit `image` path always wins, so data can point at pixel art.
 */
export const resolveIcon = (key, image) => {
  if (image) return { image, icon: key || "folder", tint: fallbackTint };
  if (!key) return { icon: "folder", tint: fallbackTint };
  if (key === "brand") {
    return { image: site.identity.site.logo, icon: "brand", tint: fallbackTint };
  }

  const app = appMap[key];
  if (app) return { icon: app.icon, tint: app.tint, image: app.image };

  return {
    icon: icons[key] ? key : "folder",
    tint: fallbackTint,
  };
};
