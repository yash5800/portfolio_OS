import React, { useEffect } from 'react'
import Container from './Container'
import { skills } from '../libs/desktop'

const About = ({id}) => {
   const [profileImage, setProfileImage] = React.useState('icon.webp');

  useEffect(()=>{
     const name = document.querySelector('.name');
     const name1 = document.querySelector('.name1');
     const animate = setInterval(()=>{
            name.classList.toggle('text-yellow-500');
            name.classList.toggle('text-green-400');
            name1.classList.toggle('text-red-500');
            name1.classList.toggle('text-green-400');
     },1000)

     const profileHover = document.querySelector('.profile');
     profileHover.addEventListener('mouseover',()=>{
       setProfileImage('items/profile.jpg');
    })
    profileHover.addEventListener('mouseout',()=>{
        setProfileImage('icon.webp');
     })
     return () =>{
       clearInterval(animate);
       profileHover.removeEventListener('mouseover', profileHover);
       profileHover.removeEventListener('mouseout', profileHover);
     }
  },[])


  return (
    <Container title="about" id={id}>
      <div className='flex justify-start items-center flex-col gap-4 px-4 '>
        <div className='w-40 h-40 rounded-full overflow-hidden shadow-md shadow-blue-500 border-2 border-blue-500 profile'>
           <img src={profileImage} alt="About" className='w-full h-full object-cover scale-150'
            draggable={false}
            onContextMenu={(e) => e.preventDefault()} // disable right click
           />
        </div>
        <h1 className='text-3xl max-sm:flex-col font-bold text-center text-blue-500 gap-3 flex ArcadeClassic myshadow'>
          Hi, I'm 
          <span className='text-green-400 name'>
            Yaswanth
          </span>
          <span className='text-green-400 name1'>
            Kiran
          </span>
        </h1>
        <p className='text-center text-blue-300 myborder ByteBounce text-xl'>
          I'm a passionate developer with a love for creating beautiful and functional user experiences applications. I enjoy solving complex problems and continuously learning new technologies to enhance my skills.
        </p>
        <div className='w-full'>
           <h1 className='text-2xl font-bold text-blue-500 ArcadeClassic myborder'>Skills & Interests</h1>
           {
            Object.keys(skills).map((key,index)=>(
                <div className='flex flex-col justify-center items-start gap-2 px-3 mt-3 ArcadeClassic' key={`skills-${index}`}>
                  <p className='text-yellow-300'>{key.charAt(0).toUpperCase() + key.slice(1)}:</p>
                  <div className='flex flex-wrap gap-2'>
                    {
                      skills[key].map((item, index) => (
                        <span key={index} className='text-blue-300 bg-black p-2 rounded-xl min-w-[40px] text-center'>{item}</span>
                      ))
                    }
                  </div>
              </div>
            ))
           }
        </div>
      </div>
    </Container>
  )
}

export default About