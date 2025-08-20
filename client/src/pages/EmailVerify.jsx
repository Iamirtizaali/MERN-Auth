import React, { use, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'


const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, setIsLoggedIn, userData, setUserData, getUserData } = React.useContext(AppContext);
  axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const inputsRef = React.useRef([]);

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    if (value && idx < 5) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      inputsRef.current[5].focus();
      e.preventDefault();
    }
  };

  const onSubmitHandler=async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    try {
      const response = await axios.post(`${backendUrl}/api/auth/verify-email`, { otp: otpCode });
      if (response.data.success) {
        toast.success('OTP verified successfully!');
        navigate('/');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    }
  };
  useEffect(() => {
isLoggedIn && userData && userData.isAccountVerified && navigate('/');
  }, [getUserData,isLoggedIn]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br w-full from-blue-400 via-purple-400 to-pink-400'>
      <img src={assets.logo} onClick={() => navigate('/')} alt="" className='w-28 sm:w-32 cursor-pointer absolute top-4 left-4' />
      <form className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-4'>Verify Your Email</h2>
        <p className='mb-4'>Please enter the OTP sent to your email address.</p>
        <div className="flex gap-2 mb-4 justify-center">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="border border-gray-300 p-2 rounded-lg w-10 text-center text-lg"
              value={digit}
              onChange={e => handleChange(e, idx)}
              onKeyDown={e => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              ref={el => inputsRef.current[idx] = el}
              autoFocus={idx === 0}
            />
          ))}
        </div>
        <button type="submit" className='bg-blue-500 text-white py-2 px-4 rounded-lg' 
        onClick={onSubmitHandler}>Verify</button>
      </form>
    </div>
  )
}

export default EmailVerify