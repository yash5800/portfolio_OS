import React, { useEffect } from 'react'
import MainContext from '../context/mainContext';
import { pushWallpaper } from '../libs/DB_data';
import Wallpapers from './settings_tabs/Wallpapers';
import Container from './Container';

const Settings = ({id}) => {
  const {wallpaper,setWallpaper} = React.useContext(MainContext);
  const [tab,setTab] = React.useState('wallpapers');
  


  const handleClickWal = (img)=>{
    setWallpaper(img);
    pushWallpaper(img);
  }
  
  return (
    <Container title={"settings"} id={id}>
      <div className='flex justify-start items-start max-sm:flex-col flex-row '>
         <ul className='flex flex-col gap-2 px-3'>
           <li className='cursor-pointer PixelGame mystroke text-purple-500'>Wallpapers</li>
         </ul>
         <div className='absolute top-7 inset-0 overflow-scroll overflow-x-hidden'>
          {tab === 'wallpapers' && <Wallpapers wallpaper={wallpaper} handleClickWal={handleClickWal} />}
         </div>
      </div>
    </Container>
  )
}

export default Settings