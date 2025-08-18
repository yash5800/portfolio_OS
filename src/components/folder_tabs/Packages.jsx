import React, { useContext } from 'react'
import { packages } from '../../libs/packages'
import { RiNpmjsLine } from "react-icons/ri";
import MainContext from '../../context/mainContext';
import NpmCard from '../NpmCard';

const Packages = () => {
  const {addWindow} = useContext(MainContext);
  return (
    <div className='w-full h-full flex flex-col justify-start items-start gap-4 p-4'>
      {packages.map((pkg,index) => (
        <div key={`pkg-${index}`} className='flex items-center bg-gray-800 p-4 rounded-lg flex-col cursor-pointer'
         onClick={()=>{
           const id = Date.now();
           addWindow(<NpmCard id={id} index={index} />, id);
         }}
        >
            <RiNpmjsLine color='yellow' className='w-14 h-14 ' />
            <h3 className='text-xl myshadow text-white ByteBounce'>{pkg.name.replace('@yash580o/', '')}</h3>
        </div>
      ))}
    </div>
  )
}

export default Packages
