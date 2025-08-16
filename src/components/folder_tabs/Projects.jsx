import React from 'react'
import MainContext, { ContainerContext } from '../../context/mainContext';
import { projectsData } from '../../libs/projects';


const Projects = () => {
  const {isMobile} = React.useContext(ContainerContext);
  const [selectedProject, setSelectedProject] = React.useState(projectsData[0]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };
  return (
    <div className={`flex justify-start items-start  gap-3 ${isMobile ? 'flex-col' : 'flex-row'} absolute  inset-0 `}>

      <div className={`flex ${isMobile ? 'flex-row border-b-1 w-full px-3' : 'flex-col border-r-2 pr-4 w-[150px] h-full'} min-h-[50px] border-gray-600  py-3 gap-3 justify-start items-center overflow-y-hidden overflow-x-auto ArcadeClassic`}>
        {projectsData.map((project, index) => (
          <div key={index} className='cursor-pointer' onClick={() => handleProjectClick(project)}>
            <h2 className={`text-lg myborder ${selectedProject.title === project.title ? 'text-purple-500' : 'text-yellow-300'}`}>{project.title}</h2>
          </div>
        ))}
      </div>
      <div className='flex flex-col justify-start items-start gap-3 overflow-y-auto overflow-scroll overflow-x-hidden h-full w-full p-3'>
          <div className='flex justify-between items-center w-full ArcadeClassic gap-3'>
             <h2 className='text-2xl myshadow text-blue-400 '>{selectedProject.title}</h2>
             {selectedProject.duration && <span className='text-sm text-gray-300 flex justify-center items-center '>
              <img src='items/calendar.webp' alt='Calendar' className='w-6 h-6 -mt-1' />
              {selectedProject.duration.start} - {selectedProject.duration.end}</span>}
          </div>
          <div className='flex gap-2 flex-row flex-wrap justify-center items-start'>
            {selectedProject.images.map((image) => (
              <img key={image} src={image} alt={selectedProject.title} className='w-50 h-50 object-cover' />
            ))}
          </div>
          <p className='text-sm text-gray-300'>{selectedProject.Description}</p>
          <div className='flex justify-start items-start gap-3 flex-col'>
            <h3 className='text-lg text-blue-400'>Skills Used:</h3>
            <div className='flex flex-wrap gap-2'>
              {selectedProject.skills?.map((skill, index) => (
                <p key={index} className='text-sm text-gray-300 p-2 rounded-xl bg-black hover:text-blue-400 hover:shadow-sm shadow-blue-600 cursor-pointer'>{skill}</p>
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}


export default Projects