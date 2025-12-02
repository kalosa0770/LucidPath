// src/admin/AdminDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import {
  Bell,
  Calendar,
  Users,
  ListChecks,
  Activity,
  AlertTriangle,
  Mail,
  Settings,
  BarChart2,
  LogOut
} from "lucide-react";
import axios from "axios";
import { AppContent } from "../context/AppContent"; // adjust path if needed
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter'
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

/* ------------------------------
   Small presentational bits
   ------------------------------ */
const Badge = ({ children }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gold/20 text-gold">
    {children}
  </span>
);

// /* ------------------------------
//    Header
//    ------------------------------ */
// const AdminHeader = ({ providerName }) => {
//   return (
//     <header className="flex items-center justify-between gap-4 py-4 px-6 bg-gradient-to-r from-[#062b2b] to-[#0a1f1f] text-white sticky top-0 z-30 shadow-md">
//       <div className="flex items-center gap-4">
//         <h1 className="text-2xl font-extrabold tracking-tight">Provider Dashboard</h1>
//         <Badge>{providerName || "Provider"}</Badge>
//       </div>

//       <div className="flex items-center gap-3">
//         <button className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20">
//           <Bell /> <span className="hidden md:inline">Alerts</span>
//         </button>
//         <button className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20">
//           <Mail /> <span className="hidden md:inline">Messages</span>
//         </button>
//         <button className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20">
//           <Settings />
//         </button>
//       </div>
//     </header>
//   );
// };



/* ------------------------------
   Stats Cards
   ------------------------------ */
const StatsCards = ({ stats }) => {
  const items = [
    { title: "Active Clients", value: stats.clients, icon: <Users /> },
    { title: "Pending Tasks", value: stats.tasks, icon: <ListChecks /> },
    { title: "Monthly Sessions", value: stats.sessions, icon: <Activity /> },
    { title: "Risk Cases", value: stats.riskCases, icon: <AlertTriangle /> },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => (
        <div key={it.title} className="p-5 bg-white/5 border border-white/5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10 text-gold">{it.icon}</div>
              <div>
                <div className="text-xs text-gray-300">{it.title}</div>
                <div className="text-2xl font-bold text-white">{it.value ?? 0}</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">This month</div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------
   Notifications Panel
   ------------------------------ */
const NotificationsCard = ({ notifications }) => {
  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-extrabold">Notifications</h3>
        <span className="text-xs text-gray-400">{notifications.length} new</span>
      </div>
      <ul className="space-y-3 text-sm text-gray-200 max-h-44 overflow-auto">
        {notifications.length === 0 ? (
          <li className="text-gray-400">No notifications</li>
        ) : (
          notifications.map((n, i) => (
            <li key={i} className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="text-gray-100">{n.title}</div>
                <div className="text-xs text-gray-400">{n.time}</div>
              </div>
              <Badge>{n.type}</Badge>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

/* ------------------------------
   Appointments
   ------------------------------ */
const AppointmentsCard = ({ appointments }) => {
  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-extrabold">Today's Appointments</h3>
        <span className="text-xs text-gray-400">{appointments.length}</span>
      </div>

      <ul className="space-y-3">
        {appointments.length === 0 ? (
          <li className="text-gray-400">No appointments for today</li>
        ) : (
          appointments.map((a, i) => (
            <li key={i} className="flex items-center justify-between bg-white/2 p-3 rounded-lg">
              <div>
                <div className="text-white font-semibold">{a.client}</div>
                <div className="text-sm text-gray-300">{a.type} • {a.time}</div>
              </div>
              <div className="text-sm text-gray-300">{a.mode}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

/* ------------------------------
   Recent Clients
   ------------------------------ */
const RecentClients = ({ clients }) => {
  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-extrabold">Recent Clients</h3>
        <span className="text-xs text-gray-400">{clients.length}</span>
      </div>

      <ul className="space-y-3">
        {clients.length === 0 ? (
          <li className="text-gray-400">No recent clients</li>
        ) : (
          clients.map((c, i) => (
            <li key={i} className="flex items-center justify-between gap-4 p-2 rounded-md hover:bg-white/3">
              <div>
                <div className="text-white font-semibold">{c.name}</div>
                <div className="text-xs text-gray-300">{c.email}</div>
              </div>
              <div className="text-xs text-gray-400">{c.lastVisit}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

/* ------------------------------
   Mood Trends (Recharts)
   ------------------------------ */
const MoodTrends = ({ data }) => {
  // sample fallback data if none provided
  const fallback = [
    { date: "Mon", mood: 3 },
    { date: "Tue", mood: 4 },
    { date: "Wed", mood: 2.5 },
    { date: "Thu", mood: 3.5 },
    { date: "Fri", mood: 4.2 },
    { date: "Sat", mood: 4.5 },
    { date: "Sun", mood: 4.0 },
  ];
  const chartData = data.length ? data : fallback;

  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-extrabold">Mood Trends (weekly average)</h3>
        <span className="text-xs text-gray-400">Last 7 days</span>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#0b2b2b" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[0, 5]} />
            <Tooltip />
            <Line type="monotone" dataKey="mood" stroke="#FFD700" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ------------------------------
   Risk Alerts
   ------------------------------ */
const RiskAlerts = ({ list }) => {
  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-extrabold">High Risk Alerts</h3>
        <span className="text-xs text-red-300">{list.length} flagged</span>
      </div>

      <ul className="space-y-3 text-sm">
        {list.length === 0 ? (
          <li className="text-gray-400">No flagged clients</li>
        ) : (
          list.map((p, i) => (
            <li key={i} className="flex items-center justify-between p-3 rounded-md bg-white/3">
              <div>
                <div className="text-white font-semibold">{p.name}</div>
                <div className="text-xs text-gray-300">{p.reason}</div>
              </div>
              <div className="text-sm text-red-400 font-bold">{p.level}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

/* ------------------------------
   Messages Panel
   ------------------------------ */
const MessagesPanel = ({ messages }) => {
  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-extrabold">Messages</h3>
        <span className="text-xs text-gray-400">{messages.length} unread</span>
      </div>

      <ul className="space-y-3">
        {messages.length === 0 ? (
          <li className="text-gray-400">No messages</li>
        ) : (
          messages.map((m, i) => (
            <li key={i} className="flex items-start gap-3 p-2 rounded-md hover:bg-white/3">
              <div className="flex-1">
                <div className="text-white font-semibold">{m.from}</div>
                <div className="text-xs text-gray-300">{m.preview}</div>
              </div>
              <div className="text-xs text-gray-400">{m.time}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

/* ------------------------------
   Admin Footer
   ------------------------------ */
/* ------------------------------
   Main Admin Dashboard
   ------------------------------ */
const AdminDashboard = () => {
  const { backendUrl } = useContext(AppContent); // expects AppContent from your context
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
    // Example endpoints — replace to match your backend
    try {

      // Example parallel requests (uncomment and change endpoints)
      // const [statsRes, notesRes, apptRes, clientsRes, moodRes, riskRes, msgsRes] =
      //   await Promise.all([
      //     axios.get(`${backendUrl}/api/provider/stats`, cfg),
      //     axios.get(`${backendUrl}/api/provider/notifications`, cfg),
      //     axios.get(`${backendUrl}/api/provider/appointments/today`, cfg),
      //     axios.get(`${backendUrl}/api/provider/clients/recent`, cfg),
      //     axios.get(`${backendUrl}/api/provider/mood/trends`, cfg),
      //     axios.get(`${backendUrl}/api/provider/risk/flagged`, cfg),
      //     axios.get(`${backendUrl}/api/provider/messages/unread`, cfg),
      //   ]);
      //
      // setStats(statsRes.data || {});
      // setNotifications(notesRes.data || []);
      // setAppointments(apptRes.data || []);
      // setClients(clientsRes.data || []);
      // setMoodData(moodRes.data || []);
      // setRiskList(riskRes.data || []);
      // setMessages(msgsRes.data || []);

      // TEMP: populate with sample data so dashboard is ready to use
      setStats({ clients: 42, tasks: 6, sessions: 28, riskCases: 3 });
      setNotifications([
        { title: "New session request", time: "2h ago", type: "Appointment" },
        { title: "Client submitted assessment", time: "5h ago", type: "Assessment" },
      ]);
      setAppointments([
        { client: "John Banda", time: "10:00 AM", mode: "Video", type: "Therapy" },
        { client: "Grace Kafula", time: "1:30 PM", mode: "In-person", type: "Consult" },
      ]);
      setClients([
        { name: "John Banda", email: "john@example.com", lastVisit: "2 days ago" },
        { name: "Grace Kafula", email: "grace@example.com", lastVisit: "Nov 7" },
      ]);
      setMoodData([
        { date: "Mon", mood: 3.4 },
        { date: "Tue", mood: 3.7 },
        { date: "Wed", mood: 2.9 },
        { date: "Thu", mood: 3.5 },
        { date: "Fri", mood: 4.0 },
        { date: "Sat", mood: 4.2 },
        { date: "Sun", mood: 3.9 },
      ]);
      setRiskList([
        { name: "Brian Mwale", level: "High", reason: "Suicidal ideation" },
        { name: "Luyando Tembo", level: "Medium", reason: "Severe insomnia" },
      ]);
      setMessages([
        { from: "Sally M", preview: "Thanks for the session earlier...", time: "1h ago" },
      ]);
      // fetch flagged forum threads for moderation
      try {
        const [flagThreadsRes, flagPostsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/forum/moderation/flagged`, { withCredentials: true }),
          axios.get(`${backendUrl}/api/forum/moderation/flagged-posts`, { withCredentials: true }),
        ]);

        if (flagThreadsRes?.data?.success) setFlaggedThreads(flagThreadsRes.data.data || []);
        if (flagPostsRes?.data?.success) setFlaggedPosts(flagPostsRes.data.data || []);
        // optionally wire flagged posts into a separate panel later - for now we keep data
        // if (flagPostsRes?.data?.success) setFlaggedPosts(flagPostsRes.data.data || []);
      } catch (err) {
        // ignore for demo or if not authorized
        console.warn('fetch flagged threads failed', err?.response?.data || err.message);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
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
        {/* <AdminHeader providerName={providerName} /> */}

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-6">
          {/* Date */}
          <div className="text-center text-sm text-gray-300 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
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

export default AdminDashboard;
