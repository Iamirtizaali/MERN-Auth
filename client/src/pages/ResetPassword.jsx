import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const ResetPassword = () => {
  const { backendUrl } = React.useContext(AppContext);
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState(Array(6).fill(''));
  const [stage, setStage] = React.useState('request'); // 'request' | 'otp' | 'reset'
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  // OTP helpers
  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) {
      const next = document.getElementById(`otp-input-${idx + 1}`);
      if (next) next.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const prev = document.getElementById(`otp-input-${idx - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste) {
      const values = paste.split('').slice(0, 6);
      while (values.length < 6) values.push('');
      setOtp(values);
    }
  };

  // Send reset OTP
  const sendResetOtp = async (e) => {
    e?.preventDefault();
    if (!email) return toast.error('Please enter your email');
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Reset OTP sent');
        setStage('otp');
      } else {
        toast.error(response.data?.message || 'Failed to send reset OTP');
      }
    } catch (err) {
      console.error('sendResetOtp error', err);
      toast.error(err.response?.data?.message || 'Error sending reset OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP locally and show reset form
  const verifyOtp = (e) => {
    e?.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Please enter the 6-digit OTP');
    // We don't have a dedicated verify endpoint; allow user to proceed to set new password
    setStage('reset');
    toast.info('OTP entered. Now set your new password');
  };

  // Submit new password with email and otp
  const submitNewPassword = async (e) => {
    e?.preventDefault();
    const newPassword = document.getElementById('new-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    const code = otp.join('');
    if (!newPassword || !confirmPassword) return toast.error('Please enter and confirm your new password');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (code.length !== 6) return toast.error('Please enter the 6-digit OTP');
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/auth/reset-password`, { email, otp: code, newPassword });
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Password reset successfully');
        navigate('/login');
      } else {
        toast.error(response.data?.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('reset-password error', err);
      toast.error(err.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br w-full from-blue-400 via-purple-400 to-pink-400'>
      <img src={assets.logo} onClick={() => navigate('/')} alt="" className='w-28 sm:w-32 cursor-pointer absolute top-4 left-4' />

      {/* Request OTP */}
      {stage === 'request' && (
        <form onSubmit={sendResetOtp} className='bg-pink-400 p-8 rounded-lg shadow-md w-full max-w-md'>
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Reset Password</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {loading ? 'Sending...' : 'Send Reset OTP'}
          </button>
        </form>
      )}

      {/* Enter OTP */}
      {stage === 'otp' && (
        <form onSubmit={verifyOtp} className='bg-purple-400 mt-8 p-8 rounded-lg shadow-md w-full max-w-md'>
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Enter OTP</h2>
          <div className="flex justify-between mb-6">
            {otp.map((_, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                maxLength={1}
                className="w-10 h-12 text-center text-xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otp[idx]}
                onChange={(e) => handleOtpChange(e, idx)}
                onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                onPaste={idx === 0 ? handleOtpPaste : undefined}
                autoComplete="one-time-code"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Verify OTP
          </button>
        </form>
      )}

      {/* Reset Password */}
      {stage === 'reset' && (
        <form onSubmit={submitNewPassword} className='bg-blue-400 mt-8 p-8 rounded-lg shadow-md w-full max-w-md'>
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Set New Password</h2>
          <div className="mb-4">
            <label htmlFor="new-password" className="block text-white mb-2">New Password</label>
            <input
              type="password"
              id="new-password"
              name="new-password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new password"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirm-password" className="block text-white mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ResetPassword