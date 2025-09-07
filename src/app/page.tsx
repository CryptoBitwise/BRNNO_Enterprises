"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "@/components/LoginForm";
import Dashboard from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function Splash() {
  const [showLogin, setShowLogin] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const timeout = setTimeout(() => setShowLogin(true), 2000);
    return () => clearTimeout(timeout);
  }, []);

  // If user is authenticated, show the dashboard
  if (user && !loading) {
    return <Dashboard />;
  }

  // If still loading auth state, show minimal loading
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-500 text-lg font-light tracking-wide mb-4">INITIALIZING BRNNO...</div>
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show splash intro for unauthenticated users
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>

      <div className="max-w-4xl mx-auto px-4 py-8 w-full relative z-10">
        <motion.main
          className="bg-black/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {!showLogin ? (
            <motion.div
              className="flex items-center justify-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="text-center">
                <h1 className="text-8xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                  BRNNO
                </h1>
                <p className="text-gray-400 mt-4 text-lg font-light tracking-wide">
                  THE FUTURE OF SERVICE BOOKING
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LoginForm />
            </motion.div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
