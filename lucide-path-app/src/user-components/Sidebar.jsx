import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart, Book, Video, Calendar, MessageCircle } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: BarChart, label: 'Track Mood', path: '/track' },
        { icon: Book, label: 'Explore', path: '/explore' },
        { icon: Calendar, label: 'Appointments', path: '/appointments' },
        { icon: MessageCircle, label: 'Community', path: '/community' }
    ];

    return (
        <div className="hidden md:flex flex-col w-[250px] py-6 px-5 items-start sticky top-0 h-screen rounded-2xl bg-teal/30 backdrop-blur-sm ">
            {/* Logo Section */}
            <div className="mb-12 pt-4 pb-6 border-b border-[#FFD700]/40 w-full">
                <h1 className="text-2xl font-extrabold tracking-wide text-gold drop-shadow-md">
                    Lucid Path
                </h1>
                <p className="text-sm text-white mt-2 italic font-light">
                    Where clarity meets calm
                </p>
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col gap-4 w-full">
                {menuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className="flex items-center gap-4 text-white hover:text-[#FFD700] 
                                     hover:bg-[#FFD700]/10 transition-all duration-200 rounded-xl 
                                     py-3 px-4 w-full group"
                        >
                            <IconComponent className="w-5 h-5 group-hover:text-[#FFD700] group-hover:scale-110 transition-transform duration-200" />
                            <span className="text-base font-medium group-hover:translate-x-1 transition-transform duration-200">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="mt-auto pt-6 border-t border-gold/30 w-full">
                <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gold/15">
                    <div className="w-10 h-10 bg-teal rounded-full flex items-center justify-center shadow-md">
                        <span className="text-gold font-bold text-sm">U</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">Welcome back!</span>
                        <span className="text-white text-xs">User</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
