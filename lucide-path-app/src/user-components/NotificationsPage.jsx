import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContent';

const NotificationsPage = () => {
  const { fetchNotifications, markNotificationsAsRead, pushSupported, pushSubscribed, registerServiceWorker, subscribeToPush, unsubscribePush } = useContext(AppContent);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const data = await fetchNotifications({ page: 1, limit: 50 });
    setNotes(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    // ensure service worker is registered and subscription state known
    (async () => {
      try {
        await registerServiceWorker();
      } catch (err) {
        console.error('registerServiceWorker failed', err?.message || err);
      }
    })();
  }, [registerServiceWorker]);

  const open = (n) => {
    // deep-link depending on notification data
    if (!n) return;
    markNotificationsAsRead(n._id);
    if (n.type === 'forum_reply' && n.reference) {
      navigate(`/community`); // open forum list; further nav to thread could be added
      // optionally: navigate(`/community/thread/${n.data?.threadId}`) if route exists
    } else if (n.type === 'provider_message') {
      navigate('/profile');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-b from-[#061818] to-[#041414] text-white font-nunito">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-extrabold">Notifications</h1>
          <p className="text-sm text-gray-300 mt-1">Recent important updates and messages.</p>
        </header>

        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
          {loading ? (
            <div className="text-gray-400 p-6">Loading…</div>
          ) : notes.length === 0 ? (
            <div className="text-gray-400 p-6">No notifications</div>
          ) : (
            <ul className="space-y-3">
              {notes.map(n => (
                <li key={n._id} className={`p-3 rounded-lg ${n.read ? 'bg-white/2' : 'bg-white/5'}`}>
                  <button onClick={() => open(n)} className="w-full text-left">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-200">{n.message}</div>
                      <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t border-white/5 pt-3 flex items-center justify-between">
            <div className="text-sm text-gray-300">Push notifications</div>
            {!pushSupported ? (
              <div className="text-xs text-gray-400">Not supported in this browser</div>
            ) : pushSubscribed ? (
              <button onClick={unsubscribePush} className="px-3 py-2 bg-rose-500 rounded-full text-sm font-semibold">Unsubscribe</button>
            ) : (
              <button onClick={subscribeToPush} className="px-3 py-2 bg-gold text-dark-teal rounded-full text-sm font-semibold">Enable</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
