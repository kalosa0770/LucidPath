import React, { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import PopularContent from './PopularContent';
import MoodEntry from './MoodEntry';
import TodaysSelection from './TodaysSelection';
import WeeklyMoodTracker from './WeeklyMoodTracker';
import SearchByTopicCards from './SearchByTopicCards';
import { Outlet } from 'react-router-dom';
import FooterNav from './FooterNav';
import { AppContent } from "../context/AppContent";
// import { toast } from 'react-toastify';

const UserDashboard = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const { userData} = useContext(AppContent);
  

  return (
    <div className="flex min-h-screen font-nunito bg-gradient-to-b from-[#0a1f1f] to-[#062b2b]">
      <Sidebar firstName={userData?.firstName || "Guest"} />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <div className="py-5 px-6 w-full">
          <Header firstName={userData?.firstName || "Guest"} />
        </div>
        <main className="flex flex-col flex-1 gap-8 px-6 md:px-10 py-8 overflow-y-auto no-scrollbar w-full max-w-7xl mx-auto">
          <MoodEntry onMoodSelect={setSelectedMood} />
          <PopularContent />
          <TodaysSelection mood={selectedMood?.name} />
          <WeeklyMoodTracker />
          <SearchByTopicCards />
          <Outlet />
          <div className="mb-10"></div>
        </main>
        <FooterNav firstName={userData?.firstName || "Guest"}/>
      </div>
    </div>
  );
};

export default UserDashboard;
