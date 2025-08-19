import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate=useNavigate();

  return (
    <div className='flex absolute top-0 justify-between items-center p-4 bg-gray-800 text-white w-full'>
      <img src={assets.logo} alt="Logo" className='w-28 sm:w-32' />
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      onClick={() => navigate('/login')}>
        Login
        <img src={assets.arrow_icon} alt="" className='inline-block ml-2' />
      </button>
    </div>
  )
}

export default Navbar