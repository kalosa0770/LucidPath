// src/admin/AdminDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContent"; // adjust path if needed
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter'
import AdminHeader from './AdminHeader';
import StatsCards from './StatsCards';
import NotificationsCard from './NotificationsCard';
import AppointmentsCard from './AppointmentsCard';
import RecentClients from './RecentClients';
import MoodTrends from './MoodTrends';
import RiskAlerts from './RiskAlerts';
import MessagesPanel from './MessagesPanel';
/**
 * Health Provider Dashboard (Option A)
 * - Single file with components: Header, Sidebar, StatsCards, Notifications, Appointments,
 *   ClientsList, MoodTrends (Recharts), RiskAlerts, MessagesPanel, AdminFooter.
 *
 * Notes:
 * - Uses `backendUrl` from AppContent context for API calls.
 * - Replace placeholder endpoints with your real endpoints.
 * - Add authentication headers or cookies as your backend requires.
 */

/* components extracted to separate files in src/admin-components */
/* ------------------------------
   Main Admin Dashboard
   ------------------------------ */
const ProviderDashboard = () => {
  const { backendUrl, fetchAdminData } = useContext(AppContent); // expects AppContent from your context
  const [providerInfo, setProviderInfo] = useState(null);
//   const [providerName, setProviderName] = useState("Dr. Smith");

  // placeholder data (replace with API responses)
  const [stats, setStats] = useState({
    clients: 0,
    tasks: 0,
    sessions: 0,
    riskCases: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [flaggedThreads, setFlaggedThreads] = useState([]);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [riskList, setRiskList] = useState([]);
  const [messages, setMessages] = useState([]);

  const fetchDashboard = async () => {
    try {
      // Fetch all dashboard data in parallel
      const [statsRes, clientsRes, moodRes, riskRes, flagThreadsRes, flagPostsRes, appointmentsRes, messagesRes] =
        await Promise.all([
          axios.get(`${backendUrl}/api/providers/dashboard/stats`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/providers/dashboard/clients`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/providers/dashboard/mood-trends`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/providers/dashboard/risk-alerts`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/forum/moderation/flagged`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/forum/moderation/flagged-posts`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/providers/dashboard/appointments`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/providers/dashboard/messages`, { withCredentials: true }),
        ]);

      // Set stats
      if (statsRes?.data?.success) {
        setStats(statsRes.data.data || { clients: 0, tasks: 0, sessions: 0, riskCases: 0 });
      }

      // Set clients
      if (clientsRes?.data?.success) {
        setClients(clientsRes.data.data || []);
      }

      // Set mood trends
      if (moodRes?.data?.success) {
        setMoodData(moodRes.data.data || []);
      }

      // Set risk alerts
      if (riskRes?.data?.success) {
        setRiskList(riskRes.data.data || []);
      }

      // Set flagged threads/posts
      if (flagThreadsRes?.data?.success) {
        setFlaggedThreads(flagThreadsRes.data.data || []);
      }
      if (flagPostsRes?.data?.success) {
        setFlaggedPosts(flagPostsRes.data.data || []);
      }

      // Set appointments and messages from real API
      if (appointmentsRes?.data?.success) {
        setAppointments(appointmentsRes.data.data || []);
      }
      if (messagesRes?.data?.success) {
        setMessages(messagesRes.data.data || []);
      }

      // Set default notifications if not otherwise provided
      setNotifications([
        { title: "New session request", time: "2h ago", type: "Appointment" },
        { title: "Client submitted assessment", time: "5h ago", type: "Assessment" },
      ]);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // fetch provider info (name/title)
    (async () => {
      try {
        const p = await fetchAdminData(true);
        if (p) setProviderInfo(p);
      } catch (err) {
        console.error('fetch provider info', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moderateThreadAction = async (id, action) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/forum/moderation/thread/${id}`, { action }, { withCredentials: true });
      if (data?.success) {
        // refresh lists
        fetchDashboard();
      }
    } catch (err) {
      console.error('moderateThreadAction', err?.response?.data || err.message);
    }
  };

  const moderatePostAction = async (id, action) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/forum/moderation/post/${id}`, { action }, { withCredentials: true });
      if (data?.success) {
        // refresh moderation lists
        fetchDashboard();
      }
    } catch (err) {
      console.error('moderatePostAction', err?.response?.data || err.message);
    }
  };

  return (
    <div className="flex min-h-screen font-nunito bg-gradient-to-b from-[#071b1b] to-[#062b2b] text-white">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminHeader />

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-6">
          {/* Provider Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-300 font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {providerInfo && (
                <div className="text-white mt-2">
                  <h1 className="text-2xl font-extrabold">{providerInfo.title ? providerInfo.title + ' ' : ''}{providerInfo.firstName} {providerInfo.lastName}</h1>
                  <p className="text-gray-400 text-sm">{providerInfo.profession || ''}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <StatsCards stats={stats} />

          {/* Grid: Notifications | Appointments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <NotificationsCard notifications={notifications} />
              <AppointmentsCard appointments={appointments} />
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gold font-extrabold">Flagged Threads</h3>
                  <span className="text-xs text-amber-300">{flaggedThreads.length} awaiting</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-200 max-h-44 overflow-auto">
                  {flaggedThreads.length === 0 ? (
                    <li className="text-gray-400">No flagged threads</li>
                  ) : (
                    flaggedThreads.map((t) => (
                      <li key={t._id} className="p-2 rounded-md bg-white/3 flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-semibold text-white truncate">{t.title}</div>
                          <div className="text-xs text-gray-400">By {t.author?.firstName || t.author?.email || 'Unknown'}</div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <button onClick={() => moderateThreadAction(t._id, 'delete')} className="text-xs text-rose-400">Delete</button>
                          <button onClick={() => moderateThreadAction(t._id, 'restore')} className="text-xs text-gold">Restore</button>
                          <button onClick={() => moderateThreadAction(t._id, 'pin')} className="text-xs text-gray-300">Pin</button>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div className="p-5 bg-white/5 border border-white/5 rounded-2xl mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gold font-extrabold">Flagged Posts</h3>
                  <span className="text-xs text-amber-300">{flaggedPosts.length} awaiting</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-200 max-h-44 overflow-auto">
                  {flaggedPosts.length === 0 ? (
                    <li className="text-gray-400">No flagged posts</li>
                  ) : (
                    flaggedPosts.map((p) => (
                      <li key={p._id} className="p-2 rounded-md bg-white/3 flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-semibold text-white truncate">{p.content?.slice(0, 140)}</div>
                          <div className="text-xs text-gray-400">In: {p.thread?.title || 'Unknown thread'}</div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <button onClick={() => moderatePostAction(p._id, 'delete')} className="text-xs text-rose-400">Delete</button>
                          <button onClick={() => moderatePostAction(p._id, 'restore')} className="text-xs text-gold">Restore</button>
                          <button onClick={() => moderatePostAction(p._id, 'flag')} className="text-xs text-amber-300">Flag</button>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <RecentClients clients={clients} />
              <MessagesPanel messages={messages} />
            </div>
          </div>

          {/* Mood trends & Risk alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MoodTrends data={moodData} />
            </div>
            <div>
              <RiskAlerts list={riskList} />
            </div>
          </div>

          <div className="mb-15" />
        </main>

        <AdminFooter />
      </div>
    </div>
  );
};

export default ProviderDashboard;
