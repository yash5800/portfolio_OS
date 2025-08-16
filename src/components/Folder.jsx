import React from 'react'
import Container from './Container'
import Projects from './folder_tabs/Projects'

const Folder = ({foldertab,id}) => {
  return (
    <Container title={foldertab} id={id}>
       <div className='flex justify-center items-center h-full w-full'>
             {foldertab === 'projects' && <Projects />}
       </div>
    </Container>
  )
}

export default Folder