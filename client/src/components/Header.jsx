import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
const Header = () => {
  const {userData}=useContext(AppContext);
  // console.log(userData);
  return (
    <div className='flex flex-col items-center gap-2 justify-center text-center h-screen'>
        <img src={assets.header_img} alt="header" 
        className='w-36 h-36 rounded-full mb-6'/>
        <h1 className='text-3xl font-bold flex items-center'>Hey {userData ? userData.name : "Developer"} <img src={assets.hand_wave} alt="" className='ml-2' /></h1>
        <h2 className='text-2xl'>Welcome to Our App</h2>
        <p className='text-lg'>We're glad to have you here. Let's build something amazing!</p>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Get Started</button>
    </div>
  )
}

export default Header