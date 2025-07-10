"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiSettings, FiEye } from "react-icons/fi";
import BoopWrapper from "@/components/ui/BoopWrapper";

// Mock admin data
const mockStats = {
    totalBookings: 156,
    totalRevenue: 12450,
    activeUsers: 89,
    monthlyGrowth: 12.5
};

const mockRecentBookings = [
    {
        id: 1,
        customerName: "John Smith",
        service: "Premium Car Wash",
        date: "2024-01-15",
        time: "10:00 AM",
        status: "confirmed",
        amount: "$89"
    },
    {
        id: 2,
        customerName: "Sarah Johnson",
        service: "Full Detail Service",
        date: "2024-01-15",
        time: "2:00 PM",
        status: "pending",
        amount: "$150"
    },
    {
        id: 3,
        customerName: "Mike Davis",
        service: "Interior Clean",
        date: "2024-01-14",
        time: "11:30 AM",
        status: "completed",
        amount: "$75"
    },
    {
        id: 4,
        customerName: "Lisa Wilson",
        service: "Ceramic Coating",
        date: "2024-01-14",
        time: "3:00 PM",
        status: "confirmed",
        amount: "$200"
    }
];

export default function AdminPage() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin (you can implement your own admin check logic)
        if (user) {
            // For demo purposes, consider any user as admin
            // In production, check user roles/claims
            setIsAdmin(true);
        }
        setLoading(false);
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-pink-600">Loading...</div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md mx-auto px-4 py-8">
                    <motion.main
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Access Denied
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            You don't have permission to access the admin panel.
                        </p>
                    </motion.main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <motion.main
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {/* Header */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your vehicle detailing business
                        </p>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <FiCalendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockStats.totalBookings}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <FiDollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${mockStats.totalRevenue}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                    <FiUsers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockStats.activeUsers}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                    <FiTrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Growth</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockStats.monthlyGrowth}%</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Recent Bookings */}
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Recent Bookings
                            </h2>
                            <BoopWrapper>
                                <button className="flex items-center text-pink-500 hover:text-pink-600 font-medium">
                                    <FiEye className="h-4 w-4 mr-2" />
                                    View All
                                </button>
                            </BoopWrapper>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-600">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Customer</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Service</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Date & Time</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Amount</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockRecentBookings.map((booking, index) => (
                                        <motion.tr
                                            key={booking.id}
                                            className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                        >
                                            <td className="py-4 px-4">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {booking.customerName}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    {booking.service}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                        : booking.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                                    }`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {booking.amount}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex space-x-2">
                                                    <BoopWrapper>
                                                        <button className="text-pink-500 hover:text-pink-600 text-sm font-medium">
                                                            View
                                                        </button>
                                                    </BoopWrapper>
                                                    <BoopWrapper>
                                                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm">
                                                            Edit
                                                        </button>
                                                    </BoopWrapper>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600"
                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        >
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                                    <FiSettings className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                                </div>
                                <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Manage Services
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Add, edit, or remove services from your catalog
                            </p>
                            <BoopWrapper>
                                <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-medium transition-colors">
                                    Manage Services
                                </button>
                            </BoopWrapper>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600"
                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        >
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    User Management
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                View and manage user accounts and permissions
                            </p>
                            <BoopWrapper>
                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors">
                                    Manage Users
                                </button>
                            </BoopWrapper>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600"
                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        >
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <FiDollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Financial Reports
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                View detailed financial reports and analytics
                            </p>
                            <BoopWrapper>
                                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors">
                                    View Reports
                                </button>
                            </BoopWrapper>
                        </motion.div>
                    </motion.div>
                </motion.main>
            </div>
        </div>
    );
} 