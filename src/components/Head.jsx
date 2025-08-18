import React, { useEffect } from 'react'
import { IoIosSettings } from "react-icons/io";
import MainContext from '../context/mainContext';
import About from './About';
import Contact from './Contact';
import Settings from './Settings';

const Head = () => {
  const [date, setDate] = React.useState(new Date());
  const {page,setPage,addWindow,setWindows} = React.useContext(MainContext);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className='w-full bg-gray-800 flex justify-between items-center max-sm:flex-col px-2 relative'>
      <ul className='flex justify-center items-center flex-row gap-3 px-3 mt-1 text-white text-[19px] ByteBounce'>
        <img src="icon.webp" alt="pic" className='w-[25px] cursor-pointer rounded-full max-sm:absolute max-sm:w-[40px] max-sm:top-5 max-sm:left-5 hover:scale-110'
         onClick={() => {}}
         draggable={false}
         onContextMenu={(e) => e.preventDefault()} // disable right click
         />
        <li className='cursor-pointer hover:text-red-500' onClick={() => {
          const id = Date.now();
          addWindow(<About id={id} />, id);
        }}>About</li>
        <li className='cursor-pointer hover:text-red-500' onClick={() => {
          const id = Date.now();
          addWindow(<Contact id={id} />, id);
        }}>Contact</li>
      </ul>
      <p className='text-white text-[18px] ByteBounce cursor-pointer'>
        <span className='hover:text-orange-300' onClick={() => {
          setWindows([]);
          setPage('')
        }}>~/home</span>
        <span className='hover:text-orange-300'>{page?'/' + page:''}</span>
      </p>
      <ul className='flex justify-center items-center flex-row gap-2 px-3 text-white text-[17px] ByteBounce'>
         <li>{date && date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</li>
         <li className='rotate cursor-pointer hover:scale-110' onClick={() => {
           const id = Date.now();
           addWindow(<Settings id={id} />, id);
         }}><IoIosSettings color='red'/></li>
      </ul>
    </div>
  )
}

export default Head