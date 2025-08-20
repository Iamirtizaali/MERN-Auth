import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import ResetPassword from './ResetPassword'
import EmailVerify from './EmailVerify'

const Home = () => {
  return (
    <div className='bg-[url(/bg_img.png)] flex flex-col items-center justify-center min-h-screen bg-cover bg-center'>
        <Navbar />
        <Header />
    </div>
  )
}

export default Home