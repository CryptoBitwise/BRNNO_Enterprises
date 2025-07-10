"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, items } from "@/data/catalog";
import { FaCar, FaShip, FaMotorcycle, FaTruck } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import { FiShoppingBag, FiSearch } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { IconButton } from "@/components/ui/Button";
import { BoopIcon } from "@/components/ui/BoopWrapper";
import { useAuth } from "@/contexts/AuthContext";

// Icon mapping
const iconMap = {
    FaCar,
    FaShip,
    FaMotorcycle,
    FaTruck,
    GiCarWheel,
};

export default function Dashboard() {
    const [search, setSearch] = useState("");
    const [selectedCat, setSelectedCat] = useState("all");
    const { user } = useAuth();

    const filteredItems = items.filter((it) => {
        const matchesCat =
            selectedCat === "all" || it.categoryKey === selectedCat;
        const matchesSearch = it.title
            .toLowerCase()
            .includes(search.trim().toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.main
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
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
                            Find your perfect vehicle detailing service
                        </p>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-6 flex flex-col sm:flex-row gap-3 justify-center"
                        >
                            <Link href="/add-details">
                                <BoopIcon>
                                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm">
                                        🚗 Add Vehicle Details
                                    </button>
                                </BoopIcon>
                            </Link>
                            <Link href="/nearby-services">
                                <BoopIcon>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm">
                                        🗺️ Find Nearby Services
                                    </button>
                                </BoopIcon>
                            </Link>
                        </motion.div>
                    </motion.div>
                    {/* Card container */}
                    <motion.div
                        className="w-full"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {/* Search bar */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <BoopIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <FiSearch className="h-5 w-5" />
                            </BoopIcon>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search services..."
                                className="w-full bg-gray-200 dark:bg-gray-700 pl-12 pr-4 py-4 rounded-full text-gray-700 dark:text-gray-200 text-base outline-none min-h-[48px] focus:ring-2 focus:ring-pink-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200 ease-out hover:bg-gray-100 dark:hover:bg-gray-600"
                            />
                        </motion.div>

                        {/* Category nav */}
                        <motion.ul
                            className="mt-6 flex gap-4 overflow-x-auto sm:overflow-visible sm:grid sm:grid-cols-5 sm:gap-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {categories.map(({ key, label, iconName }, index) => {
                                const IconComponent = iconMap[iconName as keyof typeof iconMap];
                                return (
                                    <motion.li
                                        key={key}
                                        className="text-center"
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
                                        <IconButton
                                            onClick={() => setSelectedCat(key)}
                                            icon={<IconComponent className="text-xl" />}
                                            className={`h-12 w-12 rounded-full min-w-[48px] min-h-[48px] ${selectedCat === key ? "bg-pink-400 text-white border-pink-400" : "border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-pink-300"}`}
                                            size="sm"
                                        />
                                        <p className="mt-1 text-xs text-gray-900 dark:text-gray-200">{label}</p>
                                    </motion.li>
                                );
                            })}
                        </motion.ul>

                        {/* Filtered item cards */}
                        <motion.div
                            className="mt-6 grid grid-cols-1 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <AnimatePresence mode="wait">
                                {filteredItems.length ? (
                                    filteredItems.map((it, index) => (
                                        <motion.div
                                            key={it.id}
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.05,
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 25
                                            }}
                                        >
                                            <Link href={`/services/${it.id}`} className="block h-full">
                                                <motion.article
                                                    className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 ease-out hover:shadow-xl"
                                                    whileHover={{
                                                        scale: 1.02,
                                                        y: -5,
                                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                                    }}
                                                    whileTap={{ scale: 0.98 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                >
                                                    <div className="w-20 h-20 bg-gray-200 flex-shrink-0">
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                            <FaCar className="text-gray-400 text-xl" />
                                                        </div>
                                                    </div>
                                                    <div className="p-3 flex flex-col flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{it.title}</h3>
                                                            {it.mobileService && (
                                                                <BoopIcon>
                                                                    <FiShoppingBag className="text-gray-400 dark:text-gray-500" />
                                                                </BoopIcon>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center text-orange-400 text-xs mt-1">
                                                            {[...Array(5)].map((_, i) =>
                                                                i < Math.round(it.rating) ? (
                                                                    <AiFillStar key={i} />
                                                                ) : (
                                                                    <AiOutlineStar key={i} className="text-gray-300 dark:text-gray-600" />
                                                                )
                                                            )}
                                                            <span className="ml-2 text-gray-900 dark:text-gray-200">{it.rating}</span>
                                                        </div>
                                                        <div className="mt-auto flex items-center text-gray-900 dark:text-gray-200 text-xs">
                                                            <span>{it.vendor}</span>
                                                            <span className="ml-auto font-semibold text-orange-500">
                                                                {it.distance}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.article>
                                            </Link>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-center py-8"
                                    >
                                        <p className="text-gray-500 dark:text-gray-400">No services found.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                </motion.main>
            </div>
        </div>
    );
} 