import React, { useEffect, useRef } from 'react'
import MainContext, { ContainerContext } from '../context/mainContext';
import { desktop } from '../libs/desktop';
import Folder from './Folder';
import NpmCard from './NpmCard';

const Screen = () => {
  const { wallpaper } = React.useContext(MainContext);
  const [folder, setFolder] = React.useState('projects');
  const { windows, order, addWindow} = React.useContext(MainContext);

  return (
    <div className='w-full h-full bg-gray-900 rounded-t-2xl relative  flex justify-center items-center overflow-hidden'>
      <img
        src={`wallpapers/${wallpaper}`}
        alt="Screen"
        className='w-full h-full absolute object-cover opacity-80 -z-0'
        draggable={false}
        onContextMenu={(e) => e.preventDefault()} // disable right click
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
                draggable={false}
                onContextMenu={(e) => e.preventDefault()} // disable right click
              />
              <h1 className='text-lg font-medium -mt-5 ByteBounce myborder '>{file}</h1>
            </div>
          ))}
        </div>
      </div>

        {order.map((id, index) => {
          const win = windows.find((w) => w.id === id);
          if (!win) return null;
          return (
            <div
              key={id}
              className={' h-full w-full fixed'}
              style={{
                top: win.top ?? 100,
                left: win.left ?? 100,
                zIndex: index + 1
              }}
            >
              {win.comp}
            </div>
          );
        })}
    </div>
  );
};

export default Screen;
