import React, { createContext } from "react";

const MainContext = React.createContext({
  wallpaper: '',
  setWallpaper: () => {},
  page: '',
  setPage: () => {}
});

export const ContainerContext = createContext({
    isMobile: false,
    setMobile:()=>{}
})

export default MainContext;
