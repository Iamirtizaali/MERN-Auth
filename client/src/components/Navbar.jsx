import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
const Navbar = () => {
    const navigate=useNavigate();
    const {userData, backendUrl,setUserData,setIsLoggedIn}=useContext(AppContext);

    const sendVerificationOtp=async()=>{
      try {
        // axios.defaults.withCredentials is set in AppContext; use axios to ensure cookies are sent
        const response = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, { userId: userData?.id });
        const data = response.data;
        if (data.success) {
          navigate('/email-verify');
          toast.success(data.message);
        } else {
          toast.error(data.message || 'Failed to send verification OTP');
        }
      } catch (error) {
        console.error('sendVerificationOtp error:', error);
        toast.error(error.response?.data?.message || 'Error sending verification OTP');
      }
    };

    const logout=async()=>{
      try {
        console.log("Logging out...");
        axios.defaults.withCredentials=true;
        const response=await fetch(`${backendUrl}/api/auth/logout`,{
          method:'POST',
          credentials:'include'
        });
        if(response.ok){
          setUserData(null);
          setIsLoggedIn(false);
          navigate('/');
        }
      } catch (error) {
        toast.error('Error logging out:', error);
      }
    }
    console.log('User Data:', userData);
  return (
    <div className='flex absolute top-0 justify-between items-center p-4 bg-gray-800 text-white w-full'>
      <img src={assets.logo} alt="Logo" className='w-28 sm:w-32' />
      {userData ? (
        <div className='flex items-center justify-center group w-8 h-8 rounded-full bg-blue-500 text-white font-bold cursor-pointer relative'>
        {
          // guard: userData.name might be undefined or empty
          (userData.name && userData.name.length > 0) ? userData.name[0].toUpperCase() : '?'
        }
        <div className="absolute hidden group-hover:block  text-white text-xs rounded-lg pt-10  top-0 right-0 z-10" >

          <ul className='list-none m-0 p-2 bg-gray-700 rounded-lg shadow-lg text-nowrap'>
            {userData.isAccountVerified ? (
              <li>Email Verified</li>
            ) : (
              <li onClick={sendVerificationOtp}>Verify Email</li>
            )}
            <li onClick={logout}>Logout</li>
          </ul>
        </div>
      </div>) : (
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => navigate('/login')}>
          Login
          <img src={assets.arrow_icon} alt="" className='inline-block ml-2' />
        </button>
      )}
    </div>
  )
}

export default Navbar