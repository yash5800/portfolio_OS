import { defaultWallpaper } from "../App";

const end = 'http://192.168.1.12:3000';

export const getWallpaper = async () => {
      const response = await fetch(`${end}/settings`);
      const data = await response.json();
      console.log(data.settings)
      if (data.settings && data.settings.length > 0) {
        console.log(data.settings[0].wallpaper)
        return data.settings[0].wallpaper;
      }
      else{
        pushWallpaper(defaultWallpaper);
        return defaultWallpaper;
      }
};

export const pushWallpaper = async (newWallpaper) => {
  const response = await fetch(`${end}/settings/set`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wallpaper: newWallpaper }),
  });
  const data = await response.json();
  console.log(data.settings);
  return true;
};