import express from "express";
// import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from "../controllers/authController.js";
import { login, logout, register, sendResetOtp, verifyResetOtp, resetPassword } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
import verify from "jsonwebtoken";

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
// authRouter.post('/send-verify-otp', sendVerifyOtp);
// authRouter.post('/verify-account', verifyEmail);
// authRouter.post('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/verify-reset-otp', verifyResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;