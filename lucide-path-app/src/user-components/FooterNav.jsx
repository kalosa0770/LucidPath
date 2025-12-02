import React, { useContext } from 'react';
import { Home, Zap, Lightbulb, Video, Book, UserCircle } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

import { AppContent } from '../context/AppContent';

const FooterNav = ( {firstName} ) => {
  const { userData } = useContext(AppContent);
  // prefer prop, fall back to context
  const name = firstName ?? userData?.firstName ?? '';

  const navItems = [
    { name: 'Dashboard', icon: Home, link: 'dashboard'},
    { name: 'Track Mood', icon: Lightbulb, link: 'track'},
    { name: 'Explore', icon: Book, link: 'explore'},
    // { name: 'Therapy', icon: Video},
    // { name: 'Circle', icon: Zap },
    { name: 'You', icon: UserCircle, link: 'profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-teal/30 backdrop-blur-sm text-white  shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pt-2 pb-safe md:hidden">
      <div className="flex justify-around items-center h-16 max-w-xl mx-auto">
        {navItems.map((item) => {

          return (
            <NavLink
                key={item.name}
                to={`/${item.link.toLowerCase()}`}
                className={({ isActive }) =>
                  `flex flex-col items-center p-2 rounded-lg transition duration-300 hover:bg-gray-100 active:bg-gray-200 ${
                    isActive
                      ? "text-gold font-extrabold"
                      : "text-white"
                  }`
                }
              >
                {item.name === 'You' && name  ? (
                  <div className="w-7 h-7 flex items-center justify-center rounded-full  border-1 border-white text-white font-extrabold text-sm">
                    {String(name).charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <item.icon size={24}  />
                )}
                <span className={`text-xs mt-1 `}>{item.name}</span>
            </NavLink>
            
          );
        })}
      </div>
    </div>
  );
};

export default FooterNav;
