"use client";

import Link from "next/link";
import { categories } from "@/data/catalog";

import { motion } from "framer-motion";

import { BoopIcon } from "@/components/ui/BoopWrapper";
import BoopWrapper from "@/components/ui/BoopWrapper";
import { useAuth } from "@/contexts/AuthContext";

// Enhanced icon mapping with better visual representation
// const iconMap = {
//     FaCar: FaCar,
//     FaShip: FaShip,
//     FaMotorcycle: FaMotorcycle,
//     FaTruck: FaTruck,
//     GiCarWheel: GiCarWheel,
// };

// Service type emojis for better visual appeal
const serviceTypeEmojis = {
    "all": "✨",
    "cars": "🚗",
    "trucks": "🚛",
    "watercraft-rv": "🛥️",
    "motorcycles": "🏍️",
};

// Service type descriptions
const serviceTypeDescriptions = {
    "all": "All Services",
    "cars": "Cars & Sedans",
    "trucks": "Trucks & SUVs",
    "watercraft-rv": "Boats & RVs",
    "motorcycles": "Motorcycles",
};

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <motion.main
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {/* Welcome Message */}
                    <motion.div
                        className="mb-6 text-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Welcome back{user?.displayName ? `, ${user.displayName}` : ''}! 👋
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Discover vehicle detailing services near you
                        </p>

                        {/* Primary Action - Keep this as the main CTA */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8"
                        >
                            <Link href="/nearby-services">
                                <BoopIcon>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-colors text-lg shadow-lg hover:shadow-xl">
                                        🗺️ Find Services Near Me
                                    </button>
                                </BoopIcon>
                            </Link>
                        </motion.div>

                        {/* Quick Actions Section */}
                        <motion.div
                            className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                                ⚡ Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link href="/my-bookings">
                                    <BoopIcon>
                                        <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
                                            <div className="text-2xl mb-2">📅</div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">My Bookings</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">View appointments</p>
                                        </div>
                                    </BoopIcon>
                                </Link>
                                <Link href="/add-details">
                                    <BoopIcon>
                                        <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
                                            <div className="text-2xl mb-2">🚗</div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Add Vehicle</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Vehicle details</p>
                                        </div>
                                    </BoopIcon>
                                </Link>
                                <Link href="/locations">
                                    <BoopIcon>
                                        <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
                                            <div className="text-2xl mb-2">📍</div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Locations</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Manage addresses</p>
                                        </div>
                                    </BoopIcon>
                                </Link>
                                <Link href="/account">
                                    <BoopIcon>
                                        <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
                                            <div className="text-2xl mb-2">👤</div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Account</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Profile & settings</p>
                                        </div>
                                    </BoopIcon>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                    {/* Service Categories - Simplified */}
                    <motion.div
                        className="w-full"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <motion.div
                            className="text-center mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Service Categories
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Choose a category to explore services
                            </p>
                        </motion.div>

                        {/* Category Grid - Clean and Simple */}
                        <motion.div
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {categories.map(({ key }, index) => {
                                return (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.4 + index * 0.1,
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20
                                        }}
                                    >
                                        <Link href={`/services?category=${key}`}>
                                            <BoopWrapper>
                                                <div className="text-center p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer group">
                                                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                                                        {serviceTypeEmojis[key as keyof typeof serviceTypeEmojis]}
                                                    </div>
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                                        {serviceTypeDescriptions[key as keyof typeof serviceTypeDescriptions]}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        Browse services
                                                    </p>
                                                </div>
                                            </BoopWrapper>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Quick Access to All Services */}
                        <motion.div
                            className="mt-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Link href="/services">
                                <BoopWrapper>
                                    <button className="bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors border border-gray-200 dark:border-gray-600">
                                        View All Services
                                    </button>
                                </BoopWrapper>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.main>
            </div>
        </div>
    );
} 