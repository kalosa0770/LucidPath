import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContent';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LogInIcon } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData, fetchAdminData } = useContext(AppContent);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profession, setProfession] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  // client login
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
      
        // Get the user object from getUserData
        const user = await getUserData();
      
        // Show toast with correct first name
        toast.success(`Welcome Back, ${user?.firstName || "User"}!`,{
            className: "bg-gold text-dark-teal shadow-lg rounded-xl border-2 border-teal",
            bodyClassName: "font-nunito font-bold text-lg",
            progressClassName: "bg-dark-teal",
            autoClose: 2500,
        });
      
        setTimeout(() => {
          navigate('/dashboard', { state: { fromLogin: true } });
        }, 2000);
      } else {
        toast.error(res.data.message || "Login failed.");
      }
      
    
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error during login.");
    } finally {
      setLoading(false);
    }
  };

  //handle health provinder login
 const handleProviderSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !profession | !password) {
      setError("Please enter both your email and password.");
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
      
        // Get the user object from getAdminData
         const admin = await fetchAdminData();
      
        // Show toast with correct first name
        toast.success(`Welcome Back, ${admin?.title || ""} ${admin?.firstName || "Admin"}!!!`,{
            className: "bg-gold text-dark-teal shadow-lg rounded-xl border-2 border-teal",
            bodyClassName: "font-nunito font-bold text-lg",
            progressClassName: "bg-dark-teal",
            autoClose: 2500,
        });
      
        setTimeout(() => {
          navigate('/admin-dashboard', { state: { fromLogin: true } });
        }, 2000);
      } else {
        toast.error(res.data.message || "Login failed.");
      }
      
    
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error during login.");
    } finally {
      setLoading(false);
    }
  }

  // Tailwind class shortcuts for gold-teal palette
  const inputBase =
  "block w-full py-3 px-0 text-lg text-white bg-transparent appearance-none focus:outline-none focus:ring-0 peer placeholder-transparent border-b border-gray-600 focus:border-gold";

  const labelBase =
  "absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-4 z-10 origin-[0] peer-focus:text-gold peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-0";
  
  const bgColor = "bg-white";
  const [isReceiveCare, setIsReceiveCare] = useState(false);
  const [isGiveCare, setisGiveCare] = useState(false);

  const receiveCare = () => {
    setisGiveCare(false);
    setIsReceiveCare(true)
  }

  const giveCare = () => {
    setIsReceiveCare(false);
    setisGiveCare(true)
    
  }
  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#0a1f1f] to-[#062b2b] font-nunito p-4">
      <div className="flex flex-col w-full max-w-md bg-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-gold mb-2 text-center">Welcome Back</h1>
        <p className="text-base text-white mb-2 text-center">
          Let us know you more
        </p>

        <div className="flex mb-8">
          <button className={`rounded-full py-1 px-4 ${isReceiveCare ? bgColor : "bg-gold"} text-teal text-center font-extrabold mx-auto`} onClick={receiveCare}>I Receive Care</button>
          <button className={`rounded-full py-1 px-4 ${isGiveCare ? bgColor : "bg-teal"} text-center text-gold font-extrabold mx-auto`} onClick={giveCare}>I Offer Care</button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {isReceiveCare && (
          <>
            {/* User Dashboard Form */}
            <form onSubmit={handleSubmit} className="flex flex-col items-start gap-6 w-full">
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
              <div className="text-sm text-whutw flex items-center">
                  <input type="checkbox" id="showPassword" className="mr-2" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                  <label htmlFor="showPassword" className="text-white text-sm">Show Password</label>  
              </div>


              {/* Forgot Password */}
              <div className="w-full text-right text-sm">
                <Link
                  to="/forgot"
                  className="text-gold font-extrabold hover:text-dark-gold transition duration-150"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 px-4 text-lg font-extrabold shadow-md bg-gold text-white hover:bg-[#FFD700]/80 transition duration-300 mt-6 flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="w-5 h-5 border-2 border-[#062b2b] border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? "" : "Login"}
              </button>
              
            </form>
          </>
          )}

          {isGiveCare && (
          <>
            {/* Admin dashboard Form */}
            <form onSubmit={handleProviderSubmit} className="flex flex-col items-start gap-6 w-full">
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
                <label className={labelBase}>Your profession</label>
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
              <div className="text-sm text-whutw flex items-center">
                  <input type="checkbox" id="showPassword" className="mr-2" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                  <label htmlFor="showPassword" className="text-white text-sm">Show Password</label>  
              </div>

              {/* Forgot Password */}
              <div className="w-full text-right text-sm">
                <Link
                  to="/forgot-password"
                  className="text-gold font-extrabold hover:text-dark-gold transition duration-150"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 px-4 text-lg font-extrabold shadow-md bg-gold text-white hover:bg-[#FFD700]/80 transition duration-300 mt-6 flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="w-5 h-5 border-2 border-[#062b2b] border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? "" : "Login"}
              </button>
              
            </form>
          </>
          )}

        {/* Sign Up Link */}
        <p className="text-center text-sm text-white mt-6">
          Don't have an account? 
          <Link to="/register" className="text-gold font-extrabold hover:text-dark-gold ml-1">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
