import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [moods, setMoods] = useState([]); // ✅ Store moods
  const [loading, setLoading] = useState(true);


  // --- Load from localStorage on mount ---
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
  
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setIsLoggedin(true);
      fetchUserMoods(parsedUser._id);
    }
  
    setLoading(false);  // done checking
  }, []);
  

  // --- Persist userData in localStorage whenever it changes ---
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

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

  // Fetch moods from backend
  const fetchUserMoods = async (userId) => {
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
  const fetchAdminData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/providers/me", {
        withCredentials: true,
      });
      if (data.success) {
        return data.adminData;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch admin data");
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
    // Password reset functions
    sendPasswordResetOtp,
    verifyPasswordResetOTP,
    resetPasswordFinal,
  };

  return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
};
