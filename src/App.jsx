import React, { useEffect, useState } from 'react';
// import Desktop from './components/Desktop';
import { getWallpaper } from './libs/DB_data';
import MainContext from './context/mainContext';
import Desktop from './components/Desktop';
// import Desktop from './Sample';

export const defaultWallpaper = "1.webp";

const App = () => {
  const [wallpaper, setWallpaper] = useState(defaultWallpaper);
  const [page, setPage] = useState('');
  const [loading, setLoading] = useState(true); 
  const [windows,setWindows] = React.useState([]);
  const [order, setOrder] = React.useState([]);

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

    const addWindow = (window, id) => {
      const index = windows.length;

      const newWin = {
        id,
        comp: window,
        top: 3 + index * 10,
        left: 5 + index * 20,
      };

      setWindows([...windows, newWin]);
      setOrder([...order, id]);
    };

  const bringToFront = (id) => {
    console.log("Bringing window to front:", id);
    setOrder((prev) => [...prev.filter((wid) => wid !== id), id]);
  };

  const removeWindow = (id) => {
    console.log("Removing window:", id);
    setWindows((prev) => prev.filter((win) => win.id !== id));
    setOrder((prev) => prev.filter((wid) => wid !== id));
  };

  return (
    <MainContext.Provider value={{ wallpaper, setWallpaper, page, setPage, windows, setWindows, order, setOrder, addWindow, bringToFront, removeWindow}}>
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
    // <Desktop />
  );
};

export default App;
