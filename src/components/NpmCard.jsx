import React from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import MainContext from '../context/mainContext';
import { packages } from '../libs/packages';
import { FaNpm } from "react-icons/fa";
import Codepart from './Codepart';
import { FiMaximize } from 'react-icons/fi';
import { LuMinimize } from 'react-icons/lu';


const NpmCard = ({id,index}) => {
  const { removeWindow,handleDrag } = React.useContext(MainContext);
  const [full,setFull] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 500);
  return (
    <div className={` ${full ? 'h-[85%] w-[80%]' : isMobile ? `w-[300px] h-[90%]` : 'h-[80%] w-[450px]'}  flex flex-col justify-start items-center absolute z-10 rounded-xl overflow-hidden`}>
      <div className='w-full flex justify-between items-center px-2 bg-gray-800'>
          <div className='flex flex-row justify-center items-center gap-2'>
            <FaNpm color='red' className='w-5 h-5' />
            <p className='text-base text-white ByteBounce'>{packages[index].name.replace('@yash580o/', '')}</p>
          </div>
          <div className='absolute w-full top-0 left-0 hover:cursor-grab active:cursor-grabbing'
                  onMouseDown={(e) => handleDrag(e, id)}
                  onTouchStart={(e) => handleDrag(e, id)}
          >
            <p className='text-transparent'>grab</p>
          </div>
          <div className='flex flex-row gap-2 justify-center items-center'>
            { isMobile ? '' : full ? <LuMinimize className='text-[18px] cursor-pointer hover:scale-110 z-1' color='yellow' onClick={() => setFull(false)} title='Minimize' /> : <FiMaximize className='text-[18px] cursor-pointer hover:scale-110 z-1' color='yellow' onClick={() => setFull(true)} title='Maximize' />}
            <IoIosCloseCircle className='text-xl cursor-pointer hover:scale-110 z-1' color='red' onClick={() => {removeWindow(id)}} title='Close' />
          </div>
      </div>
      <div className='w-full h-full flex justify-start items-start px-3 bg-gradient-to-tr from-gray-800 to-slate-900 py-4 flex-col gap-4 overflow-x-hidden overflow-scroll'>
        <p className='text-sm text-gray-100 bg-gray-800 p-2'>{packages[index].description.text}</p>
        <div
          className='flex flex-col justify-start items-start gap-2 w-full'
        >
          <p className='text-3xl myshadow text-purple-400 ByteBounce '>Usage:</p>
             <Codepart code={packages[index].description.usage} />
        </div>
        <div className='w-full h-full flex flex-col justify-start items-start gap-2 mt-2 '>
           <img src="https://img.shields.io/npm/dt/@yash580o/full-pad" alt="Monthly Downloads" />
        </div>
        <a href={packages[index].npmlink} target="_blank" rel="noopener noreferrer">
          <FaNpm color='red' className='w-9 h-9' />
        </a>
      </div>
    </div>
  )
}

export default NpmCard