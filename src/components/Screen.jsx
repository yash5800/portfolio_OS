import React, { useRef } from 'react'
import MainContext, { ContainerContext } from '../context/mainContext';
import { desktop } from '../libs/desktop';
import Folder from './Folder';

const Screen = () => {
  const { wallpaper, page, setPage } = React.useContext(MainContext);
  const [folder, setFolder] = React.useState('projects');
  const { windows, order, addWindow, bringToFront, removeWindow, setWindows } = React.useContext(MainContext);
  const { isMobile, full } = React.useContext(ContainerContext);

  // Drag logic
  const handleDrag = (e, id) => {
    e.preventDefault();
    bringToFront(id); // bring window to top when dragging

    const winIndex = windows.findIndex((w) => w.id === id);
    if (winIndex === -1) return;

    const startX = e.clientX;
    const startY = e.clientY;

    const startTop = windows[winIndex].top || 100;
    const startLeft = windows[winIndex].left || 100;

    const handleMouseMove = (ev) => {
      const newTop = startTop + (ev.clientY - startY);
      const newLeft = startLeft + (ev.clientX - startX);

      // Update window position
      setWindows((prev) =>
        prev.map((w, i) =>
          i === winIndex ? { ...w, top: newTop, left: newLeft } : w
        )
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className='w-full h-full bg-gray-900 rounded-t-2xl relative flex justify-center items-center overflow-hidden'>
      <img
        src={`wallpapers/${wallpaper}`}
        alt="Screen"
        className='w-full h-full absolute object-cover opacity-80 -z-0'
      />

      {/* Desktop icons */}
      <div className='w-full h-full flex justify-start items-center relative'>
        <div className='absolute flex flex-col flex-wrap h-full px-2'>
          {desktop.map((file, index) => (
            <div
              key={index}
              className='flex justify-center items-center flex-col text-amber-300 hover:text-blue-400 cursor-pointer hover:scale-110 transition-all duration-300'
              onClick={() => {
                const id = Date.now();
                setFolder(file);
                addWindow(<Folder foldertab={file} id={id} />, id);
              }}
            >
              <img
                src={`items/pixel-art-blue-folder-icon.webp`}
                alt={file}
                className='w-20 h-20 hover:scale-110'
              />
              <h1 className='text-lg font-medium -mt-5 ByteBounce myborder'>{file}</h1>
            </div>
          ))}
        </div>
      </div>

      {/* Open windows */}
      {/* {page === 'settings' && <Settings />}
      {page === 'about' && <About />}
      {page === 'contact' && <Contact />}
      {folder && page === 'folder' && <Folder foldertab={folder} />} */}
        {order.map((id, index) => {
          const win = windows.find((w) => w.id === id);
          if (!win) return null;
          return (
            <div
              key={id}
              className={`${full ? 'h-[90%] w-[90%]' : isMobile ? `w-[300px] h-[90%]` : 'h-[90%] w-[500px]'}`}
              style={{
                position: "absolute",
                top: win.top ?? 100,
                left: win.left ?? 100,
                zIndex: index + 1
              }}
              onMouseDown={(e) => handleDrag(e, id)}
              onDoubleClick={() => bringToFront(id)}
            >
              {win.comp}
            </div>
          );
        })}
      </div>
  );
};

export default Screen;
