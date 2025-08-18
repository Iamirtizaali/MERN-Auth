import express from 'express';
import { registerUser, loginUser, logoutUser,sendVerifyOtp,verifyEmail,isUserAuthenticated,sendResetOtp,resetPassword } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';
const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/logout', userAuth, logoutUser);
authRouter.post('/verify-email', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isUserAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;