import React from 'react'
import Head from './Head'
import Screen from './Screen'

const Desktop = () => {
  return (
    <div
     className='h-[97vh] w-[97vw] bg-gray-800 rounded-lg shadow-lg shadow-slate-900 flex justify-center items-start overflow-hidden relative flex-col' 
    >
      <Head />
      <Screen />
    </div>
  )
}

export default Desktop