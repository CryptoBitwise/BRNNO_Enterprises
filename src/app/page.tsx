"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiUsers, FiBriefcase, FiSmartphone, FiGlobe, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/Dashboard";
import BoopWrapper from "@/components/ui/BoopWrapper";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  // If user is authenticated, show the dashboard
  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              className="text-6xl md:text-8xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              BRNNO
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The Future of Service Booking
            </motion.p>

            <motion.p
              className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Connect customers with verified service providers through our dual-platform ecosystem
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <BoopWrapper>
                <button
                  onClick={() => router.push('/signin')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Set Up Demo
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </BoopWrapper>

              <BoopWrapper>
                <button
                  onClick={() => router.push('/provider-register')}
                  className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Sign Up Demo for Businesses
                  <FiBriefcase className="w-5 h-5" />
                </button>
              </BoopWrapper>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How BRNNO Works</h2>
            <p className="text-xl text-gray-400">Two platforms, one seamless experience</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Customer Side */}
            <motion.div
              className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
                  <FiUsers className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Customers</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">Find verified service providers in your area</p>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">Book services instantly through our web portal</p>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">Track bookings and manage your service history</p>
                </div>
              </div>
            </motion.div>

            {/* Provider Side */}
            <motion.div
              className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-purple-500/20 p-3 rounded-lg mr-4">
                  <FiBriefcase className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Providers</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">Manage your business through our mobile app</p>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">Receive bookings and manage your schedule</p>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">Track earnings and grow your customer base</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Experience the Future?
          </motion.h2>

          <motion.p
            className="text-xl text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Schedule a demo to see how BRNNO can transform your business operations
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <BoopWrapper>
              <button
                onClick={() => router.push('/signin')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Set Up Demo
                <FiArrowRight className="w-5 h-5" />
              </button>
            </BoopWrapper>

            <BoopWrapper>
              <button
                onClick={() => router.push('/provider-register')}
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Business Demo
                <FiBriefcase className="w-5 h-5" />
              </button>
            </BoopWrapper>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
