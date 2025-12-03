import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContent';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, fetchAdminData, recordLogin } = useContext(AppContent);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter email and password');
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/super-admin/login`, { email: email.trim(), password }, { withCredentials: true });
      if (res.data.success) {
        setIsLoggedin(true);
        try { recordLogin(); } catch {}
        toast.success(`Welcome back, ${res.data.admin?.firstName || 'Admin'}!`, { autoClose: 2000 });
        setTimeout(() => navigate('/admin-dashboard'), 800);
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error during login.');
      console.error('AdminLogin error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#0a1f1f] to-[#062b2b] font-nunito p-4">
      <div className="flex flex-col w-full max-w-md bg-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-gold mb-2 text-center">Admin Sign In</h1>
        <p className="text-sm text-gray-300 mb-6 text-center">Sign in with your admin account to manage providers and moderation.</p>

        <form onSubmit={handleSubmit} className="flex flex-col items-start gap-6 w-full">
          <div className="relative w-full group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full py-3 px-0 text-lg text-white bg-transparent appearance-none focus:outline-none focus:ring-0 peer placeholder-transparent border-b border-gray-600 focus:border-gold"
              placeholder=" "
              required
            />
            <label className="absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-4 z-10 origin-[0] peer-focus:text-gold peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-0">Email Address</label>
          </div>

          <div className="relative w-full group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full py-3 px-0 text-lg text-white bg-transparent appearance-none focus:outline-none focus:ring-0 peer placeholder-transparent border-b border-gray-600 focus:border-gold"
              placeholder=" "
              required
            />
            <label className="absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-4 z-10 origin-[0] peer-focus:text-gold peer-focus:-translate-y-6 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-0">Password</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3 px-4 text-lg font-extrabold shadow-md bg-gold text-white hover:bg-[#FFD700]/80 transition duration-300 mt-6 flex items-center justify-center gap-2"
          >
            {loading && <div className="w-5 h-5 border-2 border-[#062b2b] border-t-transparent rounded-full animate-spin"></div>}
            {loading ? '' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
