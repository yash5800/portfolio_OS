import React from 'react'
import MainContext from '../context/mainContext';
import { desktop } from '../libs/desktop';
import Settings from './Settings';
import Folder from './Folder';
import About from './About';
import Contact from './Contact';

const Screen = () => {
  const { wallpaper, page,setPage } = React.useContext(MainContext);
  const [folder,setFolder] = React.useState('projects');
  return (
    <div
      className='w-full h-full bg-gray-900 rounded-t-2xl relative flex justify-center items-center overflow-hidden'
    >
      <img src={`wallpapers/${wallpaper}`} alt="Screen" className='w-full h-full absolute object-cover opacity-80 -z-0' />
      <div className='w-full h-full flex justify-start items-center relative'>
        <div className='absolute flex flex-col flex-wrap h-full px-2'>
        {desktop.map((file, index) => (
            <div key={index} className='flex justify-center items-center flex-col text-amber-300 hover:text-blue-400 cursor-pointer hover:scale-110 transition-all duration-300' onClick={() => {
              setPage('folder')
              setFolder(file)
              }}>
              <img src={`items/pixel-art-blue-folder-icon.webp`} alt={file} className='w-20 h-20 hover:scale-110' />
              <h1 className='text-lg  font-medium -mt-5 ByteBounce myborder'>{file}</h1>
            </div>
          ))}
        </div>
      </div>

      {page === 'settings' && <Settings />}
      {page === 'about' && <About />}
      {page === 'contact' && <Contact />}
      {folder && page === 'folder' && <Folder foldertab={folder} />}


    </div>
  )
}

export default Screen