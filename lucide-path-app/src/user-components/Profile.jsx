import React, { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { AppContent } from "../context/AppContent";
import { UserCircle2, Lock, LogOut, Settings, Book, CheckCircle, FileText } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import FooterNav from "./FooterNav";


const Profile = () => {
  const { userData, getUserData, logout, moods, loginStreak } = useContext(AppContent);
  const navigate = useNavigate();

  const userDataEntriesCount = (u) => {
    // prefer explicit journals array if available, otherwise 0
    if (!u) return 0;
    return (u.journals && Array.isArray(u.journals) ? u.journals.length : 0);
  };

  useEffect(() => {
    if (!userData) {
      getUserData();
    }
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0a0a0a] text-white font-nunito">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-nunito bg-gradient-to-b from-[#0a1f1f] to-[#062b2b]">
      <Sidebar firstName={userData?.firstName || "Guest"} />
      <main className="flex flex-col flex-1 gap-8 px-6 md:px-10 py-8 overflow-y-auto no-scrollbar w-full max-w-7xl mx-auto text-white">
        <div className="w-full">

          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            {userData.profileImageUrl ? (
              <img src={userData.profileImageUrl} alt="profile" className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-gold" />
            ) : (
              <UserCircle2 size={90} className="text-gold mb-3" />
            )}
            <h2 className="text-3xl font-bold text-gold mb-1">
              {userData.firstName} {userData.lastName}
            </h2>
            <p className="text-gray-400 text-sm">{userData.email}</p>
            {userData.bio && <p className="text-gray-300 mt-2 text-sm max-w-lg text-center">{userData.bio}</p>}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mb-8 text-center">
            <div className="bg-white/10 p-4 rounded-xl">
              <Book className="mx-auto mb-2 text-gold" size={26} />
              <p className="text-xl font-bold">0</p>
              <p className="text-xs text-gray-400">Courses</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <FileText className="mx-auto mb-2 text-gold" size={26} />
              <p className="text-xl font-bold">{(userData && userDataEntriesCount(userData)) || 0}</p>
              <p className="text-xs text-gray-400">Entries</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <CheckCircle className="mx-auto mb-2 text-gold" size={26} />
              <p className="text-xl font-bold">{userData?.moodCount ?? 0}</p>
              <p className="text-xs text-gray-400">Mood Logs</p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gold mb-2">Personal Info</h3>
            <div className="bg-white/10 p-4 rounded-xl text-sm space-y-2">
              <p><span className="text-gray-400">Full Name:</span> {userData.firstName} {userData.lastName}</p>
              <p><span className="text-gray-400">Email:</span> {userData.email}</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gold mb-2">Mood entries</h3>
            <div className="bg-white/10 p-4 rounded-xl text-center text-gray-400">
              {moods && moods.length > 0 ? (
                <div>
                  <p className="text-2xl font-bold text-white">{moods.length}</p>
                  <p className="text-sm text-gray-300">Recorded moods</p>
                </div>
              ) : (
                <div>🏅 No entries yet. Log your mood to see your progress!</div>
              )}
            </div>
          </div>

          {/* Appointments Card */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gold mb-2">Appointments</h3>
            <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xl font-bold">Manage your bookings</p>
                <p className="text-sm text-gray-300">View upcoming appointments or book a new session</p>
              </div>
              <div className="flex flex-col items-end">
                <button
                  onClick={() => navigate('/appointments')}
                  className="py-2 px-4 bg-gold text-dark-teal font-semibold rounded-lg hover:opacity-90 transition"
                >
                  My Appointments
                </button>
                <p className="text-xs text-gray-400 mt-2">No sensitive data shown here</p>
              </div>
            </div>
          </div>

          {/* Settings and Actions */}
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-3 text-teal bg-white/10 hover:bg-white/20 transition p-3 rounded-xl">
              <Lock size={20} />
              Change Password
            </button>

            <button className="w-full flex items-center justify-center gap-3 text-teal bg-white/10 hover:bg-white/20 transition p-3 rounded-xl">
              <Settings size={20} />
              Account Settings
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              toast.info("Redirecting to login...");
              setTimeout(() => {
                window.location.href = "/login";
              }, 1500);
            }}
            className="mt-6 w-full bg-gold text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
        <div className="mb-10"></div>
        </main>
        <FooterNav/>
      
    </div>
  );
};

export default Profile;
