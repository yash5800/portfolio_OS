import React, { useEffect } from 'react';
import Desktop from './components/Desktop';
import { getWallpaper } from './libs/DB_data';
import MainContext from './context/mainContext';

export const defaultWallpaper = "1.webp";

const App = () => {
  const [wallpaper, setWallpaper] = React.useState(defaultWallpaper);
  const [page, setPage] = React.useState('');

  useEffect(() => {
    const fetchWallpaper = async () => {
      const wallpaper = await getWallpaper();
      setWallpaper(wallpaper);
    };
    fetchWallpaper();
  }, []);

  return (
  <MainContext.Provider value={{ wallpaper, setWallpaper, page, setPage }}>
    <div className='h-screen w-screen flex justify-center items-center'>
      <img src={`wallpapers/${wallpaper}`} alt="wallpapers" className='absolute inset-0 object-cover w-full h-full -z-10 blur-[5px]' />
      <Desktop />
    </div>
  </MainContext.Provider>
  )
}

export default App