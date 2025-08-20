import React, { useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const Login = () => {
    const navigate =useNavigate();
    const { backendUrl, isLoggedIn, setIsLoggedIn, userData, setUserData,getUserData } = React.useContext(AppContext);
    const [state,setState]=useState("Sign Up");
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const onSubmitHandler=async (e)=>{
        e.preventDefault();
        const url = `${backendUrl}/api/auth/${state === "Sign Up" ? "register" : "login"}`;
        console.log(url);
        try {
            axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
            const response = await axios.post(url, { name, email, password });
            // console.log(response);
            if (response.data.success) {
                // after successful login/register, refresh server user data
                setIsLoggedIn(true);
                try { await getUserData(); } catch (e) { /* ignore */ }
                navigate("/");
            }
            else{
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
       

    const handleToggle=()=>{
        setState((prevState)=>(prevState==="Sign Up"?"Login":"Sign Up"));
    }
return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400'>
     <img src={assets.logo} onClick={() => navigate('/')} alt="" className='w-28 sm:w-32 cursor-pointer absolute top-4 left-4' />
     <div className='bg-pink-400 p-8 rounded-2xl shadow-md w-md'>
            <h2 className='text-white font-bold text-xl text-center'>{state==="Sign Up"?"Create an Account":"Login to your Account"}</h2>
            <p className='text-white text-center mb-2'>
                    {state==="Sign Up"?"Create your Account":"Login to your Account"}
            </p>
                        <form onSubmit={onSubmitHandler} className=' flex flex-col gap-4'>
                                {state === "Sign Up" && (
                                    <div className={` items-center border-b border-gray-300 py-2 bg-[#ffffff] rounded-2xl p-3 flex`}>
                                        <img src={assets.person_icon} alt="" className='mr-2' />
                                        <input
                                            onChange={(e)=>setName(e.target.value)}
                                            value={name}
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder='Full Name'
                                            required
                                            className='flex-1 outline-none'
                                        />
                                    </div>
                                )}
                <div className='flex items-center border-b border-gray-300 py-2 bg-[#ffffff] rounded-2xl p-3 mt-4'>
                    <img src={assets.mail_icon} alt="" className='mr-2' />
                    <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" name="email" id="email" placeholder='Email' required className='flex-1 outline-none' />
                </div>
                <div className='flex items-center border-b border-gray-300 py-2 bg-[#ffffff] rounded-2xl p-3 mt-4'>
                    <img src={assets.lock_icon} alt="" className='mr-2' />
                    <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" name="password" id="password" placeholder='Password' required className='flex-1 outline-none' />
                </div>
                <p className='text-white text-center  mt-1 cursor-pointer hover:underline' onClick={() => navigate('/reset-password')}>Forgot Password?</p>
                <button type='submit' className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-2 px-4 rounded-2xl '>
                    {state==="Sign Up"?"Create Account":"Login"}
                </button>
            </form>
            <p className='text-white text-center mb-2 mt-1'>{state==="Sign Up"?"Already have an account?":"Don't have an account?"}<span onClick={handleToggle} className='text-blue-200 cursor-pointer'>{state==="Sign Up"?"Login":"Sign Up"}</span></p>
     </div>
    </div>
)
}

export default Login