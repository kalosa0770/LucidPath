import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContent';

const AdminRegister = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', title: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/super-admin/create`, form, { withCredentials: true });
      if (data.success) {
        toast.success('Super admin account created');
        navigate('/admin-dashboard');
      } else {
        toast.error(data.message || 'Failed to create super admin');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error');
      console.error('AdminRegister error', err);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-gradient-to-b from-[#0a1f1f] to-[#062b2b]">
      <div className="w-full max-w-md p-8 bg-white/10 rounded-2xl">
        <h2 className="text-gold text-2xl font-extrabold mb-4">Create Admin</h2>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full p-3 bg-transparent border-b border-gray-600 text-white" name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
          <input className="w-full p-3 bg-transparent border-b border-gray-600 text-white" name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
          <input className="w-full p-3 bg-transparent border-b border-gray-600 text-white" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input className="w-full p-3 bg-transparent border-b border-gray-600 text-white" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input className="w-full p-3 bg-transparent border-b border-gray-600 text-white" name="title" placeholder="Title (optional)" value={form.title} onChange={handleChange} />
          <input className="w-full p-3 bg-transparent border-b border-gray-600 text-white" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-gold font-bold text-teal-900">{loading ? 'Creating...' : 'Create Admin'}</button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
