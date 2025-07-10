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

  // If still loading auth state, show loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-pink-600 text-lg">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show splash intro for unauthenticated users
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.main
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {!showLogin ? (
            <motion.div
              className="flex items-center justify-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-4xl font-bold text-pink-600">Reviva</h1>
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
