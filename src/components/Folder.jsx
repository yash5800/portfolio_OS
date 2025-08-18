import React from 'react'
import Container from './Container'
import Projects from './folder_tabs/Projects'
import Packages from './folder_tabs/Packages'

const Folder = ({foldertab,id}) => {
  return (
    <Container title={foldertab} id={id}>
       <div className='flex justify-center items-center h-full w-full'>
             {foldertab === 'projects' && <Projects />}
             {foldertab === 'packages' && <Packages />}
       </div>
    </Container>
  )
}

export default Folder