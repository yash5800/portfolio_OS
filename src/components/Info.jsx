import React from 'react'
import MainContext from '../context/mainContext';
import { IoIosCloseCircle, IoMdInformationCircle } from "react-icons/io";

const Info = ({id}) => {
  const {removeWindow,handleDrag} = React.useContext(MainContext);
  const [full,setFull] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 500);
  
  return (
        <div className={` ${isMobile ? `w-[300px] h-[50%]` : 'h-[50%] w-[450px]'}  flex flex-col justify-start items-center absolute z-10 rounded-xl overflow-hidden shadow-2xl shadow-blue-400/60`}>
          <div className='w-full flex justify-between items-center px-2 bg-gray-900'>
              <div className='flex flex-row justify-center items-center gap-2'>
                <IoMdInformationCircle color='blue' className='w-4 h-4' />
                <p className='text-base text-white ByteBounce'>Info</p>
              </div>
              <div className='absolute w-full top-0 left-0 hover:cursor-grab active:cursor-grabbing'
                onMouseDown={(e) => handleDrag(e, id)}
                onTouchStart={(e) => handleDrag(e, id)}
              >
                <p className='text-transparent'>grab</p>
              </div>
              <div className='flex flex-row gap-2 justify-center items-center'>
                <IoIosCloseCircle className='text-xl cursor-pointer hover:scale-110 z-1' color='red' onClick={() => {removeWindow(id)}} title='Close' />
              </div>
          </div>
          <div
            className='w-full h-full bg-gradient-to-br from-violet-600 to-teal-400 px-4 py-2'
          >
            <p className='text-base font-medium text-slate-950 '>
              Hi,This is a simple OS built with React. It is a part of my portfolio to showcase my skills in web development. You can explore various features like npm packages, settings, and more. Feel free to reach out for any queries or collaborations.
            </p>
            <p className='text-center mt-5 text-slate-950 font-mono'>This site build with React,Tailwind CSS and Vite.</p>
          </div>
        </div>
  )
}

export default Info