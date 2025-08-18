import React from 'react'
import MainContext, { ContainerContext } from '../../context/mainContext';
import { projectsData } from '../../libs/projects';

const storebase = 'https://raw.githubusercontent.com/Hackeking/Store/main/'

const Projects = () => {
  const {isMobile} = React.useContext(ContainerContext);
  const [selectedProject, setSelectedProject] = React.useState(projectsData[0]);

  const handleProjectClick = (project) => {
    setSelectedProject("");
    setSelectedProject(project);
  };
  return (
    <div className={`flex justify-start items-start  gap-3 ${isMobile ? 'flex-col' : 'flex-row'} absolute  inset-0 `}>

      <div className={`flex 
        ${isMobile ? 
        'flex-row border-b-1 w-full px-3 overflow-auto overflow-y-hidden' 
        : 'flex-col border-r-2 pr-4 w-[150px] h-full overflow-scroll overflow-x-hidden'
        } 
        min-h-[50px] border-gray-600  py-3 gap-3 justify-start items-center  ArcadeClassic`}>
        {projectsData.map((project, index) => (
          <div key={index} className='cursor-pointer' onClick={() => handleProjectClick(project)}>
            <h2 className={`text-lg myborder ml-4 px-2 bg-amber-300 title ${selectedProject.title === project.title ? 'text-purple-500' : 'text-yellow-300'}`}>{project.title}</h2>
          </div>
        ))}
      </div>
      <div className='flex flex-col justify-start items-start gap-8 overflow-y-auto overflow-scroll overflow-x-hidden h-full w-full p-3'>
          <div className='flex justify-between items-center w-full ArcadeClassic gap-3'>
             <h2 className='text-2xl myshadow text-blue-400'>{selectedProject.title}</h2>
             {selectedProject.duration && <span className='text-sm text-gray-300 flex justify-center items-center '>
              <img src='items/calendar.webp' alt='Calendar' className='w-6 h-6 -mt-1' />
              {selectedProject.duration.start} - {selectedProject.duration.end}</span>}
          </div>
          {selectedProject.images && <div className='flex gap-2 flex-row flex-wrap justify-center items-start'>
            {selectedProject.images.map((image,index) => (
                <img key={`${selectedProject.title}-${index}`} src={storebase + image} alt={selectedProject.title} className='min-h-[170px] object-cover rounded-md shadow-sm hover:shadow-blue-500 hover:scale-105 transition-all duration-200' 
                draggable={false}
                onContextMenu={(e) => e.preventDefault()} // disable right click
                />
            ))}
          </div>}
          {(typeof selectedProject.Description) == 'string' ? (
          <p className='text-sm text-purple-400'>{selectedProject.Description}</p>
          ) : (
            <>
              <h4 className='text-md text-blue-400'>{selectedProject.Description.head}</h4>
              <ul className='list-disc list-inside'>
                {selectedProject.Description.points.map((point, index) => (
                  <li key={index} className='text-sm text-gray-300'>{point}</li>
                ))}
              </ul>
              <p className='text-sm text-gray-300'>{selectedProject.Description.footer}</p>
            </>
          )}
          {selectedProject.link && <a 
            href={selectedProject.link}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex justify-start items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <span className="live"></span>
            <p className="text-red-600 font-bold uppercase tracking-wide">LIVE</p>
          </a>}
          <div className='flex justify-start items-center w-full ArcadeClassic gap-3'>
             <div className='max-h-10 max-w-10 overflow-hidden rounded-full '>
                <img src="items/github.jpeg" alt="github"
                  className='h-full w-full object-cover cursor-pointer
                  scale-185'
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()} // disable right click
                />
             </div>
             <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-blue-400 myshadow cursor-pointer">View Code</a>
          </div>

          <div className='flex justify-start items-start gap-3 flex-col'>
            <h3 className='text-lg text-blue-400'>Skills Used:</h3>
            <div className='flex flex-wrap gap-2'>
              {selectedProject.skills?.map((skill, index) => (
                <p key={index} className='text-sm text-gray-300 p-2 rounded-xl bg-black hover:text-blue-400 hover:shadow-sm shadow-blue-600 cursor-pointer'>{skill}</p>
              ))}
            </div>
          </div>
          { selectedProject.contributer &&
          <div className='flex justify-start items-start gap-3 flex-col'>
             <h3 className='text-lg text-blue-400'>Contributors : </h3>
             <ul className='px-3'>
               {selectedProject.contributer.map((contributor, index) => (
                 <li key={index} className='text-xl text-gray-300 myborder ByteBounce'>
                   {contributor.name} - <span className='text-orange-400'>{contributor.role}</span>
                   {contributor.github && (
                     <a href={contributor.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                       (GitHub)
                     </a>
                   )}
                 </li>
               ))}
             </ul>
          </div>
          }
      </div>
    </div>
  )
}


export default Projects