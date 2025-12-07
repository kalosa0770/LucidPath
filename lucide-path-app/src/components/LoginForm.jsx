import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContent';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LogInIcon } from 'lucide-react';
import logo from '../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const { backendUrl, setIsLoggedin, getUserData, fetchAdminData, recordLogin } = useContext(AppContent);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profession, setProfession] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // --- STATE FOR LOGIN TOGGLE ---
    // Start with Client (I Receive Care) active by default for a B2C app
    const [isReceiveCare, setIsReceiveCare] = useState(true);
    const [isGiveCare, setisGiveCare] = useState(false);

    const receiveCare = () => {
        setisGiveCare(false);
        setIsReceiveCare(true);
        setError(''); // Clear error on switch
        setPassword(''); // Clear password on switch
    };

    const giveCare = () => {
        setIsReceiveCare(false);
        setisGiveCare(true);
        setError(''); // Clear error on switch
        setPassword(''); // Clear password on switch
    };
    // ------------------------------


    // client login (handleSubmit is correct)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError("Please enter both your email and password.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(
                backendUrl + "/api/auth/login",
                { email: email.trim(), password },
                { withCredentials: true }
            );
            if (res.data.success) {
                setIsLoggedin(true);
                const user = await getUserData();
                try { recordLogin(); } catch { /* ignore */ }
                toast.success(`Welcome back ${user?.title ? user.title + ' ' : ''}${user?.firstName || "User"}!`,{
                    className: "bg-gold text-dark-teal shadow-lg rounded-xl border-2 border-teal",
                    bodyClassName: "font-nunito font-bold text-lg",
                    progressClassName: "bg-dark-teal",
                    autoClose: 2500,
                });
                setTimeout(() => {
                    navigate('/dashboard', { state: { fromLogin: true } });
                }, 1500);
            } else {
                toast.error(res.data.message || "Login failed.");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Server error during login.");
        } finally {
            setLoading(false);
        }
    };

    // handle health provider login (handleProviderSubmit is correct)
    const handleProviderSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Corrected logic: check if email, password, AND profession are entered
        if (!email || !password || !profession) {
            setError("Please enter your email, profession, and password.");
            return;
        }
        setLoading(true);

        try {
            const res = await axios.post(
                backendUrl + "/api/providers/login",
                { email: email.trim(), password },
                { withCredentials: true }
            );

            if (res.data.success) {
                setIsLoggedin(true);
                const admin = await fetchAdminData();
                try { 
                    recordLogin(); 
                } catch { 
                    /* ignore */ 
                }
                const salutation = admin?.title ? admin.title : '';
                toast.success(`Welcome back ${salutation} ${admin?.firstName || 'Admin'}!`,{
                    className: "bg-gold text-dark-teal shadow-lg rounded-xl border-2 border-teal",
                    bodyClassName: "font-nunito font-bold text-lg",
                    progressClassName: "bg-dark-teal",
                    autoClose: 2000,
                });
                setTimeout(() => {
                    navigate('/provider-dashboard', { state: { fromLogin: true } });
                }, 900);
            } else {
                toast.error(res.data.message || "Login failed.");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Server error during login.");
        } finally {
            setLoading(false);
        }
    }

    const inputBase =
    "block w-full py-3 px-0 text-lg text-white bg-transparent appearance-none focus:outline-none focus:ring-0 peer placeholder-transparent border-b border-gray-600 focus:border-gold";

     const labelBase =
     "absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-4 z-10 origin-[0] peer-focus:text-gold peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-0";
    
     // Note: assuming 'teal' is defined for text-teal and 'dark-teal' for bg-[#0a1f1f]
     const activeReceiveBtnClass = "bg-gold text-teal shadow-lg border border-gold";
     const inactiveReceiveBtnClass = "bg-transparent text-gold border border-gold hover:bg-white/10";
    
     const activeGiveBtnClass = "bg-gold text-teal shadow-lg border border-gold";
     const inactiveGiveBtnClass = "bg-transparent text-teal border border-teal hover:bg-white/10";


    return (
        <div className="flex flex-col min-h-screen w-full items-center justify-center bg-[#0a1f1f] font-nunito p-4">
        
            {/* Header for desktop */}
            <div className="absolute top-0 w-full max-w-7xl flex justify-between items-center py-6 px-4">
                <h1 className="text-3xl font-extrabold text-gold">Lucid Path</h1>
                {/* Optional: Add navigation links or branding here */}
            </div>
        
            {/* Main Content Wrapper */}
            <div className="flex flex-col items-center p-4 w-full max-w-lg lg:max-w-xl">

                {/* Logo */}
                <div className="mb-4">
                    <img src={logo} alt="Lucid Path Logo" className="w-16 h-16 rounded-full shadow-xl border-2 border-gold" />
                </div>

                {/* Login Card */}
                <div className="flex flex-col w-full bg-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl backdrop-blur-sm border border-gold/20"> 
                    {/* Header */}
                    <h1 className="text-4xl font-extrabold text-gold mb-2 text-center">Welcome Back</h1>
                    <p className="text-base text-white mb-6 text-center">
                        Log in to your {isReceiveCare ? "Client" : "Provider"} Portal.
                    </p>

                    {/* Dual Login Toggle */}
                    <div className="flex justify-center gap-4 mb-8 p-1 bg-white/5 rounded-full border border-white/10">
                        <button 
                            className={`flex-1 rounded-full py-2 px-6 text-center font-extrabold transition duration-300 
                            ${isReceiveCare ? activeReceiveBtnClass : inactiveReceiveBtnClass}`} 
                            onClick={receiveCare}
                        >
                        I Receive Care
                        </button>
                        <button 
                            className={`flex-1 rounded-full py-2 px-6 text-center font-extrabold transition duration-300
                            ${isGiveCare ? activeGiveBtnClass : inactiveGiveBtnClass}`} 
                            onClick={giveCare}
                        >
                            I Offer Care
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-800/20 border border-danger text-white rounded-lg text-sm text-center font-semibold">
                            {error}
                        </div>
                    )}

                    {/* --- CLIENT LOGIN FORM --- */}
                    {isReceiveCare && (
                        <form onSubmit={handleSubmit} className="flex flex-col items-start gap-8 w-full">
                            {/* Email Input */}
                            <div className="relative w-full group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputBase}
                                    placeholder=" "
                                    required
                                />
                                <label className={labelBase}>Email Address</label>
                            </div>

                            {/* Password Input */}
                            <div className="relative w-full group mb-2">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputBase}
                                    placeholder=" "
                                    required
                                />
                                <label className={labelBase}>Password</label>
                            </div>
                            
                            {/* Checkbox & Forgot Password */}
                            <div className="w-full flex justify-between items-center -mt-4">
                                <div className="text-sm flex items-center">
                                    <input type="checkbox" id="showPasswordClient" className="mr-2 accent-gold h-4 w-4" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                                    <label htmlFor="showPasswordClient" className="text-white text-sm">Show Password</label>
                                </div>
                                <Link
                                    to="/forgot-password"
                                    className="text-gold font-extrabold hover:text-[#FFD700]/80 transition duration-150"
                                >
                                    Forgot Password?
                                </Link>
                            </div>  
                            
                            {/* Submit Button */}
                            <button 
                                type="submit"    
                                disabled={loading}  
                                className="w-full rounded-full py-3 px-4 text-lg font-extrabold shadow-md bg-gold text-[#0a1f1f] hover:bg-[#FFD700]/80 transition duration-300 mt-6 flex items-center justify-center gap-2"
                            >
                                {loading && (
                                    <div className="w-5 h-5 border-2 border-[#062b2b] border-t-transparent rounded-full animate-spin"></div>
                                )}
                                {loading ? "Logging In..." : <p className='text-teal'>Client Login</p>}
                            </button>
                        </form>
                    )}

                    {/* --- PROVIDER LOGIN FORM --- */}
                    {isGiveCare && (
                        <form onSubmit={handleProviderSubmit} className="flex flex-col items-start gap-8 w-full">
                        {/* Email Input */}
                            <div className="relative w-full group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputBase}
                                    placeholder=" "
                                    required
                                />
                                <label className={labelBase}>Email Address</label>
                            </div>

                            {/* Profession Input */}
                            <div className="relative w-full group">
                                <input
                                    type="text"
                                    value={profession}
                                    onChange={(e) => setProfession(e.target.value)}
                                    className={inputBase}
                                    placeholder=" "
                                    required
                                />
                                <label className={labelBase}>Your Profession (e.g., Clinical Psychologist)</label>
                            </div>

                            {/* Password Input */}
                            <div className="relative w-full group mb-2">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputBase}
                                    placeholder=" "
                                    required
                                />
                                <label className={labelBase}>Password</label>
                            </div>

                            {/* Checkbox & Forgot Password */}
                            <div className="w-full flex justify-between items-center -mt-4">
                                <div className="text-sm flex items-center">
                                    <input type="checkbox" id="showPasswordProvider" className="mr-2 accent-gold h-4 w-4" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                                    <label htmlFor="showPasswordProvider" className="text-white text-sm">Show Password</label> 
                                </div>
                                <Link
                                    to="/forgot-password"
                                    className="text-gold font-extrabold hover:text-[#FFD700]/80 transition duration-150"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            
                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-full py-3 px-4 text-lg font-extrabold shadow-md bg-gold text-[#0a1f1f] hover:bg-[#FFD700]/80 transition duration-300 mt-6 flex items-center justify-center gap-2"
                            >
                                {loading && (
                                    <div className="w-5 h-5 border-2 border-[#062b2b] border-t-transparent rounded-full animate-spin"></div>
                                )}
                                {loading ? "Authenticating..." : <p className='text-teal'>Provider Login</p>}
                            </button>
                            
                        </form>
                    )}

                    {/* Provider Sign Up Link */}
                    {isGiveCare && (
                        <p className="text-center text-sm text-white mt-6">
                            Not registered as a professional? 
                            <Link to="/provider-register" className="text-teal font-extrabold hover:text-dark-teal ml-1">
                                Join Our Network
                            </Link>
                        </p>
                    )}

                    {/* General Sign Up Link (for Clients) */}
                    {isReceiveCare && (
                        <p className="text-center text-sm text-white mt-6">
                            Don't have an account? 
                            <Link to="/register" className="text-gold font-extrabold hover:text-[#FFD700]/80 ml-1">
                                Sign Up
                            </Link>
                        </p>
                    )}
                    
                </div>
            </div>
        </div>
    );
};

export default Login;