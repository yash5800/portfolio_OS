import React from 'react'
import MainContext, { ContainerContext } from '../context/mainContext';
import { LuMinimize } from 'react-icons/lu';
import { FiMaximize } from 'react-icons/fi';
import { IoIosCloseCircle } from 'react-icons/io';

const Container = ({children,title}) => {
  const {setPage} = React.useContext(MainContext);
  const [full,setFull] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 500);

  React.useEffect(()=>{
     const handleResize = () => {
       setIsMobile(window.innerWidth < 500);
     };

     window.addEventListener('resize', handleResize);

     return () => {
       window.removeEventListener('resize', handleResize);
     };
  },[])
  return (
    <ContainerContext.Provider value={{isMobile,setMobile:setIsMobile}}>
        <div className={` ${full ? 'h-[90%] w-[90%]' : isMobile ? `w-[300px] h-[90%]` : 'h-[90%] w-[500px]'} bg-gray-800 text-white p-2 rounded-xl flex justify-start items-center flex-col absolute z-100 gap-2`}>
          <div className={`flex justify-between items-center border-b border-gray-600 px-3 w-full top-0 relative`}>
            <h1 className='text-lg ByteBounce '>/{title}</h1>
            <div className='flex justify-center items-center gap-3'>
              { isMobile ? '' : full ? <LuMinimize className='text-[18px] cursor-pointer hover:scale-110' color='yellow' onClick={() => setFull(false)} title='Minimize' /> : <FiMaximize className='text-[18px] cursor-pointer hover:scale-110' color='yellow' onClick={() => setFull(true)} title='Maximize' />}
              <IoIosCloseCircle className='text-xl cursor-pointer hover:scale-110' color='red' onClick={() => setPage('')} title='Close' />
            </div>
          </div>
          <div className='relative h-full w-full overflow-scroll overflow-x-hidden'>
            {children}
          </div>
         </div>
    </ContainerContext.Provider>
  )
}

export default Container