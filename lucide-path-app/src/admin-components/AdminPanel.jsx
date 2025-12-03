import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import ProviderApprovalList from './ProviderApprovalList';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  return (
    <div className="flex min-h-screen font-nunito bg-gradient-to-b from-[#071b1b] to-[#062b2b] text-white">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminHeader />

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-6">
          <div className="text-center text-sm text-gray-300 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>

          {/* Provider Approvals (Admin Panel) */}
          <div className="flex items-center justify-between">
            <h2 className="text-gold font-extrabold text-xl">Provider Approvals</h2>
            <Link to="/admin-register" className="text-sm text-teal bg-gold/10 px-3 py-1 rounded-md">Create Admin</Link>
          </div>
          <div>
            <ProviderApprovalList />
          </div>

        </main>

        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminPanel;
