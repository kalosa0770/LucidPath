import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, UserCircle, Zap, MessageSquare } from "lucide-react";
import { AppContent } from "../context/AppContent";



// Greeting function
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
};

// 50+ mental health quotes
const quotes = [
  "You are enough just as you are. — Lucid Path",
  "Progress, not perfection. — Lucid Path",
  "Every small step counts. Keep moving forward! — Lucid Path",
  "Your mental wellness journey is unique and valuable. — Lucid Path",
  "Breathe deeply and trust the process. — Lucid Path",
  "Focus on progress, not perfection. You're doing great! — Lucid Path",
  "Today is a new opportunity to grow and heal. — Lucid Path",
  "Be gentle with yourself during this journey. — Lucid Path",
  "Small steps every day lead to big changes. — Lucid Path",
  "You have the strength to overcome any challenge. — Lucid Path",
  "Your peace of mind is worth protecting. — Lucid Path",
  "Growth happens one breath at a time. — Lucid Path",
  "It's okay to rest. — Lucid Path",
  "Embrace the process, not just the outcome. — Lucid Path",
  "Self-care is not selfish. — Lucid Path",
  "Your feelings are valid. — Lucid Path",
  "Healing takes time, be patient with yourself. — Lucid Path",
  "Focus on what you can control. — Lucid Path",
  "You deserve happiness and peace. — Lucid Path",
  "Every day is a fresh start. — Lucid Path",
  "Celebrate small victories. — Lucid Path",
  "You are resilient and capable. — Lucid Path",
  "Mental health matters. — Lucid Path",
  "Your emotions are important. — Lucid Path",
  "Take a deep breath and release tension. — Lucid Path",
  "You are not alone in this. — Lucid Path",
  "Believe in your strength. — Lucid Path",
  "Prioritize yourself and your well-being. — Lucid Path",
  "Kindness begins with you. — Lucid Path",
  "Focus on the good things today. — Lucid Path",
  "Your journey is your own, honor it. — Lucid Path",
  "Let go of what you cannot change. — Lucid Path",
  "Keep going, even when it’s tough. — Lucid Path",
  "Your mind deserves peace. — Lucid Path",
  "Self-compassion is powerful. — Lucid Path",
  "You are stronger than you think. — Lucid Path",
  "Take time to listen to your inner self. — Lucid Path",
  "Every emotion has value. — Lucid Path",
  "Happiness is a journey, not a destination. — Lucid Path",
  "Focus on what nurtures you. — Lucid Path",
  "Your mental health is your priority. — Lucid Path",
  "Allow yourself to feel and heal. — Lucid Path",
  "Trust in your ability to cope. — Lucid Path",
  "You are worthy of love and care. — Lucid Path",
  "Take life one day at a time. — Lucid Path",
  "Rest is part of progress. — Lucid Path",
  "Be patient with your growth. — Lucid Path",
  "Mindfulness is a gift to yourself. — Lucid Path",
  "You are doing your best, and that is enough. — Lucid Path",
  "Cherish the little moments of joy. — Lucid Path",
  "Every challenge is an opportunity to grow. — Lucid Path",
];



// Get a deterministic "random" index based on today's date
const getTodaysQuote = () => {
  const today = new Date();
  const dayNumber = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = dayNumber % quotes.length; // ensures same quote for same day
  return quotes[index];
};

const Header = ({firstName}) => {
  const [greeting, setGreeting] = useState("");
  const [quote, setQuote] = useState("");
  const { loginStreak, unreadCount, fetchNotifications, markNotificationsAsRead } = useContext(AppContent);
  const [openNotifs, setOpenNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // On mount, set greeting and quote

  useEffect(() => {
    setGreeting(getGreeting());
    setQuote(getTodaysQuote());
  }, []);

  return (
    <header className="flex flex-col w-full font-nunito text-teal">
      {/* Top Icons */}
      <div className="flex justify-between items-center mb-6 w-full">
         {/* App Title (Mobile Only) */}
        <div className="flex gap-3 items-center">
            <h1 className="font-nunito text-2xl font-extrabold text-gold underline decoration-dark-gold decoration-4 md:hidden">
              Today
            </h1>
            <div className="ml-auto items-center gap-3">
              <button
                onClick={() => navigate('/community')}
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-full text-sm font-semibold transition">
                <MessageSquare className="w-4 h-4 text-gold" />
                Community
              </button>
            </div>
        </div>
        {/* Profile Icon */}
        
          <div className="flex gap-6 items-center">
            <div className="relative flex items-center" title={loginStreak ? `${loginStreak} day streak` : "No streak yet"} aria-label={`Login streak: ${loginStreak || 0} days`}>
                <Zap className="w-5 h-5 md:w-7 md:h-7 fill-dark-gold text-gold" />
                {loginStreak > 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] md:text-xs bg-danger text-white px-1 rounded-full border-2 border-teal">{loginStreak}</span>
                )}
              </div>
            <div className="relative">
              <button className="relative" aria-label="Notifications" title="Notifications" onClick={async () => {
                setOpenNotifs(!openNotifs);
                if (!openNotifs) {
                  const recent = await fetchNotifications({ page: 1, limit: 6 });
                  setNotifications(recent || []);
                }
              }}>
                <Bell className="w-5 h-5 md:w-7 md:h-7 fill-dark-gold text-gold" />
                {/* Notification Badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-[11px] font-semibold text-white border-2 border-teal">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </button>

              {/* Dropdown */}
              {openNotifs && (
                <div className="absolute right-0 mt-3 w-80 bg-[#071515] text-white rounded-xl p-3 border border-white/5 shadow-2xl z-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold">Notifications</h4>
                    <button className="text-xs text-gray-300" onClick={() => { markNotificationsAsRead(); setNotifications(prev => prev.map(n => ({ ...n, read: true }))); }}>Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-auto">
                    {notifications.length === 0 ? (
                      <div className="text-xs text-gray-400">No recent notifications</div>
                    ) : notifications.map(n => (
                      <div key={n._id} className={`p-2 rounded-lg mb-2 ${n.read ? 'bg-white/2' : 'bg-white/5'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs text-gray-300">{n.message}</div>
                            <div className="text-2xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                          </div>
                          {!n.read && <span className="text-xs text-gold">New</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-right">
                    <button onClick={() => { setOpenNotifs(false); navigate('/notifications'); }} className="text-sm text-gray-300 hover:text-white">View all</button>
                  </div>
                </div>
              )}
            </div>
            

          </div>
      </div>
     

      {/* Welcome Card */}
      <div className="flex flex-col py-5 px-4 md:py-6 md:px-6 rounded-2xl text-start w-full">
        {/* Greeting */}
        <div className="flex flex-col mb-2 w-full">
          <h1 className="font-extrabold text-xl md:text-3xl tracking-tight leading-snug text-gold break-words">
            {greeting},{" "}
            <span className="text-gold font-extrabold">
              {firstName}
            </span>
          </h1>
        </div>

        {/* Daily Affirmation */}
        <div className="flex flex-col w-full">
          <div className="flex text-start itext-start justify-start gap-2 mb-2 w-full">
              <Zap className="w-4 h-4 md:w-5 md:h-5 fill-dark-gold text-gold" />
              <p className="text-gold text-sm md:text-base leading-relaxed font-light italic">
            "{quote}"
          </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="flex justify-end items-center mt-4 text-sm text-white w-full">
        <div className="text-white font-medium">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </header>

  );
};

export default Header;
