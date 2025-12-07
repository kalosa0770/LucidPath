import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem("hasSeenSplash");

    // Only show splash if user hasn't seen it yet
    if (!hasSeenSplash) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        localStorage.setItem("hasSeenSplash", "true");
        navigate("/"); // Go to landing page after splash
      }, 4500); // 4.5s duration

      return () => clearTimeout(timer);
    } else {
      navigate("/"); // Skip splash directly
    }
  }, [navigate]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gold via-teal-700 to-teal-900 text-white font-nunito z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <motion.img
            src={logo}
            alt="Lucid Path"
            className="w-28 h-28 mb-6 rounded-2xl shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* App Name */}
          <motion.h1
            className="text-3xl font-bold tracking-wide text-gold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Lucid Path
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-lg text-gray-200 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Your journey to a clearer, calmer mind.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
