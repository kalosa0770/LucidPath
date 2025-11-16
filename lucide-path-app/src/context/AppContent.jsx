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
  };

  return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
};
