import React from 'react'
import Container from './Container'

const Contact = () => {
  return (
    <Container title="contact">
      <div className='flex justify-start items-center flex-col gap-4 px-4 '>
        <h1 className='text-3xl font-bold text-center text-blue-500 gap-3 flex ArcadeClassic myshadow'>
          Contact Me
        </h1>
        <p className='text-center text-blue-300 myborder ByteBounce text-xl'>
          Feel free to reach out to me via email at: <br />
          <a href="mailto:yaswanthjk580@gmail.com" className='text-blue-400 hover:underline'>yaswanthjk580@gmail.com</a>
        </p>
        <p className='text-center text-blue-300 myborder ByteBounce text-xl'>
          You can also find me on LinkedIn: <br />
          <a href="https://www.linkedin.com/in/alaparthi-yaswanth-kiran" 
          className='text-blue-400 hover:underline'
          target='_blank'>A. Yaswanth Kiran</a>
        </p>
        <p className='text-center text-blue-300 myborder ByteBounce text-xl'>
          You can also find me on GitHub: <br />
          <a href="https://github.com/yash5800" className='text-blue-400 hover:underline' target='_blank'>Yash5800</a>
        </p>
      </div>
    </Container>
  )
}

export default Contact
