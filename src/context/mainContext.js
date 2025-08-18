import React, { createContext } from "react";

const MainContext = React.createContext({
  wallpaper: '',
  setWallpaper: () => {},
  page: '',
  setPage: () => {},
  windows: [],
  setWindows: () => {},
  order: [],
  setOrder: () => {},
  addWindow: () => {},
  bringToFront: () => {},
  removeWindow: () => {},
  handleDrag: () => {},
});

export const ContainerContext = createContext({
    isMobile: false,
    setMobile:()=>{}
})

export default MainContext;
