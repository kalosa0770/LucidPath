import React from 'react';
import { Bell, Mail, Settings } from 'lucide-react';
import AdminBadge from './AdminBadge';

const AdminHeader = ({ providerName }) => {
  return (
    <header className="flex items-center justify-between gap-4 py-4 px-6 bg-gradient-to-r from-[#062b2b] to-[#0a1f1f] text-white sticky top-0 z-30 shadow-md">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Provider Dashboard</h1>
        <AdminBadge>{providerName || 'Provider'}</AdminBadge>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20">
          <Bell /> <span className="hidden md:inline">Alerts</span>
        </button>
        <button className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20">
          <Mail /> <span className="hidden md:inline">Messages</span>
        </button>
        <button className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20">
          <Settings />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
