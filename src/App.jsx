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
    let interval;
    const fetchWallpaper = async () => {
      try {
        const wallpaper = await getWallpaper();
        setWallpaper(wallpaper);
      } catch (error) {
        console.error("Error fetching wallpaper:", error);
      } finally {
        interval = setInterval(()=>{
          setLoading(false);
        },2000)
      }
    };
    fetchWallpaper();
    return () => clearInterval(interval);
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
    setOrder((prev) => [...prev.filter((wid) => wid !== id), id]);
  };

  const removeWindow = (id) => {
    setPage('')
    setWindows((prev) => prev.filter((win) => win.id !== id));
    setOrder((prev) => prev.filter((wid) => wid !== id));
  };

  const handleDrag = (e, id) => {
      e.preventDefault();
      bringToFront(id);

      const winIndex = windows.findIndex((w) => w.id === id);
      if (winIndex === -1) return;

      // Detect whether it's touch or mouse
      const startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const startY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

      const startTop = windows[winIndex].top || 100;
      const startLeft = windows[winIndex].left || 100;

      const handleMove = (ev) => {
        const clientX = ev.type === "touchmove" ? ev.touches[0].clientX : ev.clientX;
        const clientY = ev.type === "touchmove" ? ev.touches[0].clientY : ev.clientY;

        const newTop = startTop + (clientY - startY);
        const newLeft = startLeft + (clientX - startX);

        setWindows((prev) =>
          prev.map((w, i) =>
            i === winIndex ? { ...w, top: newTop, left: newLeft } : w
          )
        );
      };

      const handleEnd = () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);
  };

  return (
    <MainContext.Provider value={{ wallpaper, setWallpaper, page, setPage, windows, setWindows, order, setOrder, addWindow, bringToFront, removeWindow, handleDrag }}>
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
