import React, { useEffect, useState } from 'react';
import Desktop from './components/Desktop';
import { getWallpaper } from './libs/DB_data';
import MainContext from './context/mainContext';

export const defaultWallpaper = "1.webp";

const App = () => {
  const [wallpaper, setWallpaper] = useState(defaultWallpaper);
  const [page, setPage] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchWallpaper = async () => {
      try {
        const wallpaper = await getWallpaper();
        setWallpaper(wallpaper);
      } catch (error) {
        console.error("Error fetching wallpaper:", error);
      } finally {
        setLoading(false); 
      }
    };
    fetchWallpaper();
  }, []);

  return (
    <MainContext.Provider value={{ wallpaper, setWallpaper, page, setPage }}>
      {loading ? (
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-black text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : (
        <div className="h-screen w-screen flex justify-center items-center">
          <img
            src={`wallpapers/${wallpaper}`}
            alt="wallpapers"
            className="absolute inset-0 object-cover w-full h-full -z-10 blur-[5px]"
          />
          <Desktop />
        </div>
      )}
    </MainContext.Provider>
  );
};

export default App;
