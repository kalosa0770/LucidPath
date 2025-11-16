import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Utilities
import { isPWA } from "./utils/isPWA";
import { usePWAInstallPrompt } from "./utils/usePWAInstallPrompt";

// Components
import HomePage from "./components/HomePage.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/LoginForm.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ProviderRegister from "./components/HealthProviderRegister.jsx";

// User Dashboard Components
import UserDashboard from "./user-components/UserDashboard.jsx";
import MoodQuestions from "./user-components/MoodQuestions.jsx";
import MoodEntry from "./user-components/MoodEntry.jsx";
import ResourcePage from "./user-components/ResourcePage.jsx";
import TrackMoodPage from "./user-components/TrackMoodPage.jsx";
import Profile from "./user-components/Profile.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import EmailVerify from "./components/EmailVerify.jsx";
import MobileLandingPage from "./components/MobileLandingPage.jsx";

// Admin Dashboard Components
import AdminDashboard from "./admin-components/AdminDashboard.jsx";


function App() {
  const runningAsPWA = isPWA();
  const { isInstallable, promptInstall } = usePWAInstallPrompt();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(false);

  // Splash logic
  useEffect(() => {
    if (location.pathname === "/") {
      const hasSeenSplash = localStorage.getItem("hasSeenSplash");
      if (!hasSeenSplash) {
        setShowSplash(true);
        const timer = setTimeout(() => {
          setShowSplash(false);
          localStorage.setItem("hasSeenSplash", "true");
        }, 4600);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname]);

  // PWA install toast
  useEffect(() => {
    // Only show if not running as PWA, is installable, and toast hasn't been shown yet
    const hasSeenPWAInstallToast = localStorage.getItem("hasSeenPWAInstallToast");
    if (!runningAsPWA && isInstallable && !hasSeenPWAInstallToast) {
      toast.info(
        <div className="flex flex-col items-start gap-2">
          <span className="font-bold text-gold">Install Lucid Path</span>
          <span className="text-sm text-gray-200">
            Add Lucid Path to your home screen for a better experience.
          </span>
          <button
            onClick={async () => {
              const accepted = await promptInstall();
              if (accepted) toast.success("Lucid Path installed successfully 🎉");
            }}
            className="mt-1 bg-gold text-teal-900 px-3 py-1 rounded-full text-sm font-semibold hover:bg-dark-gold transition-all"
          >
            Install Now
          </button>
        </div>,
        { autoClose: false, position: "bottom-center" }
      );
  
      // Mark as shown so it won’t show again
      localStorage.setItem("hasSeenPWAInstallToast", "true");
    }
  }, [isInstallable, runningAsPWA, promptInstall]);

  // Show splash screen if active
  if (showSplash) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-dark-gold">
        <SplashScreen />
      </div>
    );
  }

  // Page wrapper to ensure full height on mobile
  const PageWrapper = ({ children }) => (
    <div className="min-h-screen w-full flex flex-col">{children}</div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {runningAsPWA ? (
          <>
            <Route path="/" element={<PageWrapper><MobileLandingPage /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/provider-register" element={<PageWrapper><ProviderRegister /></PageWrapper>} />
            <Route path="/forgot" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
            <Route path="/verify-email" element={<PageWrapper><EmailVerify /></PageWrapper>} />

            {/* User Dashboard */}
            <Route path="/dashboard" element={<PageWrapper><UserDashboard /></PageWrapper>} />
            <Route path="/mood-entry" element={<PageWrapper><MoodEntry /></PageWrapper>} />
            <Route path="/mood-questions/:mood" element={<PageWrapper><MoodQuestions /></PageWrapper>} />
            <Route path="/explore" element={<PageWrapper><ResourcePage /></PageWrapper>} />
            <Route path="/track" element={<PageWrapper><TrackMoodPage /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />

            {/* Admin Dashboard */}
            <Route path="/admin-dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
          </>
        ) : (
          <>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/provider-register" element={<PageWrapper><ProviderRegister /></PageWrapper>} />
            <Route path="/forgot" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
            <Route path="/verify-email" element={<PageWrapper><EmailVerify /></PageWrapper>} />
            {/* User Dashboard */}
            <Route path="/dashboard" element={<PageWrapper><UserDashboard /></PageWrapper>} />
            <Route path="/mood-entry" element={<PageWrapper><MoodEntry /></PageWrapper>} />
            <Route path="/mood-questions/:mood" element={<PageWrapper><MoodQuestions /></PageWrapper>} />
            <Route path="/explore" element={<PageWrapper><ResourcePage /></PageWrapper>} />
            <Route path="/track" element={<PageWrapper><TrackMoodPage /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />

            {/* Admin Dashboard */}
            <Route path="/admin-dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
