import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import AppContent from './AppContext';
// re-export the context for backwards compatibility with other components
export { default as AppContent } from './AppContext';
export { default as AppContentContext } from './AppContext';

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [moods, setMoods] = useState([]); // ✅ Store moods
  const [loading, setLoading] = useState(true);
  // Login streak tracking (client-side) — number of consecutive days user logged in
  const [loginStreak, setLoginStreak] = useState(() => {
    const saved = localStorage.getItem("loginStreak");
    return saved ? parseInt(saved, 10) : 0;
  });


  // --- Load from localStorage on mount ---
  // helper: fetch user moods (defined early so effects can call it)
  const fetchUserMoods = useCallback(async (userId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/moods/${userId}`, {
        withCredentials: true,
      });

      if (data.success) {
        setMoods(data.moods);
      } else {
        toast.error(data.message || "Failed to fetch moods");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching moods");
    }
  }, [backendUrl]);

  // Notifications helpers (used by effects) — defined early to avoid temporal dead zone
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);

  const fetchNotifications = useCallback(async (opts = {}) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/notifications`, { withCredentials: true, params: opts });
      if (data.success) setNotifications(data.data || []);
      return data.data || [];
    } catch (err) {
      console.error('fetchNotifications', err?.response?.data || err.message);
      return [];
    }
  }, [backendUrl]);

  const fetchUnreadNotificationsCount = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/notifications/unread`, { withCredentials: true });
      if (data.success) setUnreadCount(data.data?.unread || 0);
      return data.data?.unread || 0;
    } catch (err) {
      console.error('fetchUnreadNotificationsCount', err?.response?.data || err.message);
      return 0;
    }
  }, [backendUrl]);

  const markNotificationsAsRead = useCallback(async (id) => {
    try {
      await axios.post(`${backendUrl}/api/notifications/mark-read`, id ? { id } : {}, { withCredentials: true });
      // optimistic update
      if (id) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      } else {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
      // update unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('markNotificationsAsRead', err?.response?.data || err.message);
    }
  }, [backendUrl]);

  // Web Push helpers (client side)
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setPushSupported(true);
      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js');
        setSwRegistration(reg);
        // check existing subscription
        const sub = await reg.pushManager.getSubscription();
        setPushSubscribed(Boolean(sub));
        return reg;
      } catch (err) {
        console.error('SW registration failed', err);
        return null;
      }
    }
    setPushSupported(false);
    return null;
  }, []);

  const subscribeToPush = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/notifications/vapidPublicKey`);
      if (!data?.success) throw new Error('No VAPID key');
      const publicKey = data.data.publicKey;
      // ensure sw registered
      let reg = swRegistration;
      if (!reg) reg = await registerServiceWorker();
      if (!reg) throw new Error('ServiceWorker not available');

      const sub = await reg.pushManager.getSubscription() || await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      await axios.post(`${backendUrl}/api/notifications/subscribe`, { subscription: sub }, { withCredentials: true });
      setPushSubscribed(true);
      return true;
    } catch (err) {
      console.error('subscribeToPush', err?.response?.data || err.message);
      return false;
    }
  }, [backendUrl, swRegistration, registerServiceWorker]);

  const unsubscribePush = useCallback(async () => {
    try {
      const reg = swRegistration || await registerServiceWorker();
      if (!reg) throw new Error('ServiceWorker not available');
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await axios.post(`${backendUrl}/api/notifications/unsubscribe`, {}, { withCredentials: true });
      }
      setPushSubscribed(false);
      return true;
    } catch (err) {
      console.error('unsubscribePush', err?.response?.data || err.message);
      return false;
    }
  }, [backendUrl, swRegistration, registerServiceWorker]);
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
  
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setIsLoggedin(true);
      fetchUserMoods(parsedUser._id);
    }
  
    setLoading(false);  // done checking
  }, [fetchUserMoods]);

  // When user logs in or app loads, fetch unread notification count so header can show badge
  useEffect(() => {
    if (userData?.id || userData?._id) fetchUnreadNotificationsCount();

    // poll unread count every 25s while logged in
    let interval;
    if (userData?.id || userData?._id) {
      interval = setInterval(() => fetchUnreadNotificationsCount(), 25000);
    }
    return () => clearInterval(interval);
  }, [userData, fetchUnreadNotificationsCount]);
  

  // --- Persist userData in localStorage whenever it changes ---
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  // --- login streak utilities ---
  const getTodayStr = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const recordLogin = () => {
    try {
      const today = getTodayStr();
      const last = localStorage.getItem("lastLoginDate");
      let streak = parseInt(localStorage.getItem("loginStreak") || "0", 10) || 0;

      if (last === today) {
        // already recorded today
        setLoginStreak(streak);
        return streak;
      }

      if (last) {
        const lastDate = new Date(last);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          streak = streak + 1; // consecutive day
        } else {
          streak = 1; // reset streak
        }
      } else {
        streak = 1; // first recorded login
      }

      localStorage.setItem("loginStreak", String(streak));
      localStorage.setItem("lastLoginDate", today);
      setLoginStreak(streak);
      return streak;
    } catch {
      // fail silently
      return loginStreak;
    }
  };

  // Fetch user info
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.userData);
        setIsLoggedin(true);

        // ✅ Fetch moods after user data
        fetchUserMoods(data.userData._id);

        return data.userData;
      } else {
        toast.error(data.message);
        setIsLoggedin(false);
        return null;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
      setIsLoggedin(false);
      return null;
    }
  };

  


  // Logout
  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      setUserData(null);
      setIsLoggedin(false);
      setMoods([]);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed. Try again.");
    }
  };

  // fetch admin data function
  const fetchAdminData = async (quiet = false) => {
    try {
      const { data } = await axios.get(backendUrl + "/api/providers/me", {
        withCredentials: true,
      });
      if (data.success) {
        return data.adminData;
      } else {
        if (!quiet) toast.error(data.message);
        return null;
      }
    } catch (error) {
      if (!quiet) toast.error(error.response?.data?.message || "Failed to fetch admin data");
      return null;
    }
  };

  // Send OTP
  const sendPasswordResetOtp = async (email) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // Verify OTP
  const verifyPasswordResetOTP = async (email, otp) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-reset-otp`,
        { email, otp }
      );
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "OTP verification failed");
    }
  };

  // Reset Password
  const resetPasswordFinal = async ({ email, password }) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, newPassword: password }
      );
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  };

  const value = {
    backendUrl,
    loading, 
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    logout,
    moods, // ✅ Provide moods in context
    fetchUserMoods,
    fetchAdminData,
    // streak utilities
    loginStreak,
    recordLogin,
    // Password reset functions
    sendPasswordResetOtp,
    verifyPasswordResetOTP,
    resetPasswordFinal,
    // Notifications
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadNotificationsCount,
    markNotificationsAsRead,
    // push
    pushSupported,
    pushSubscribed,
    registerServiceWorker,
    subscribeToPush,
    unsubscribePush,
  };

  return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
};
