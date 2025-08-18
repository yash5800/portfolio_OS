import React from 'react'
import { wally } from '../../libs/desktop'
import { ContainerContext } from '../../context/mainContext';

const Wallpapers = ({  wallpaper, handleClickWal }) => {
  const {isMobile} = React.useContext(ContainerContext);
  return (
          <div className='flex justify-center items-center flex-col gap-4 '>
            <div className='flex justify-center items-center gap-3 max-sm:flex-col'>
              <img src={`wallpapers/${wallpaper}`} alt="Preview" className={`${isMobile ? 'w-[150px] h-[150px]' : 'w-[230px] h-[200px]'} object-cover rounded-lg`} 
                draggable={false}
                onContextMenu={(e) => e.preventDefault()} // disable right click
              />
              <p className='ArcadeClassic text-blue-400 myshadow'>Active Wallpaper</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center items-center ">
              {
                wally.map((img, index) => (
                  <img
                    key={index}
                    onClick={() => handleClickWal(img)}
                    src={`wallpapers/${img}`}
                    alt={`Wallpaper ${index + 1}`}
                    className={`${isMobile?'w-[70px] h-[70px]':'w-[100px] h-[100px]'} object-cover rounded-lg hover:scale-110 transition-all duration-200`}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()} // disable right click
                  />
                ))
              }
            </div>
         </div>
  )
}

export default Wallpapers