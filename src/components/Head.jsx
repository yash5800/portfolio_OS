import React, { useEffect } from 'react'
import { IoIosSettings } from "react-icons/io";
import MainContext from '../context/mainContext';
import About from './About';
import Contact from './Contact';
import Settings from './Settings';

const Head = () => {
  const [date, setDate] = React.useState(new Date());
  const {page,setPage,addWindow} = React.useContext(MainContext);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className='w-full bg-gray-800 flex justify-between items-center max-sm:flex-col px-2 relative'>
      <ul className='flex justify-center items-center flex-row gap-3 px-3 mt-1 text-white text-[19px] ByteBounce'>
        <img src="items\home.webp" alt="Home" className='w-[14px] h-[14px] cursor-pointer' onClick={() => setPage('')} />
        <li className='cursor-pointer hover:text-red-500' onClick={() => addWindow(<About />, Date.now())}>About</li>
        <li className='cursor-pointer hover:text-red-500' onClick={() => addWindow(<Contact />, Date.now())}>Contact</li>
      </ul>
      <p className='text-white text-[18px] ByteBounce cursor-pointer'>
        <span className='hover:text-orange-300' onClick={() => setPage('')}>~/home</span>
        <span className='hover:text-orange-300'>{page?'/' + page:''}</span>
      </p>
      <ul className='flex justify-center items-center flex-row gap-2 px-3 text-white text-[17px] ByteBounce'>
         <li>{date && date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</li>
         <li className='rotate cursor-pointer hover:scale-110' onClick={() => addWindow(<Settings />, Date.now())}><IoIosSettings color='red'/></li>
      </ul>
    </div>
  )
}

export default Head