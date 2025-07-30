"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiCheckCircle, FiXCircle, FiStar } from "react-icons/fi";
import { useRouter } from "next/navigation";
import BoopWrapper from "@/components/ui/BoopWrapper";

// Mock booking data
const mockBookings = [
    {
        id: 1,
        serviceName: "Premium Car Wash",
        provider: "Elite Auto Care",
        date: "2024-01-15",
        time: "10:00 AM",
        status: "confirmed",
        price: "$89",
        location: "123 Main St, City, State",
        rating: 4.8,
        services: ["Exterior Wash", "Interior Clean", "Wax"]
    },
    {
        id: 2,
        serviceName: "Full Detail Service",
        provider: "Mobile Detail Pro",
        date: "2024-01-20",
        time: "2:00 PM",
        status: "pending",
        price: "$150",
        location: "456 Oak Ave, City, State",
        rating: 4.9,
        services: ["Full Detail", "Paint Correction", "Ceramic Coating"]
    },
    {
        id: 3,
        serviceName: "Interior Deep Clean",
        provider: "Clean Car Co",
        date: "2024-01-10",
        time: "11:30 AM",
        status: "completed",
        price: "$75",
        location: "789 Pine Rd, City, State",
        rating: 4.6,
        services: ["Interior Clean", "Odor Removal", "Leather Treatment"]
    }
];

const statusConfig = {
    confirmed: { color: "text-green-600", bg: "bg-green-100", icon: FiCheckCircle },
    pending: { color: "text-yellow-600", bg: "bg-yellow-100", icon: FiClock },
    completed: { color: "text-blue-600", bg: "bg-blue-100", icon: FiCheckCircle },
    cancelled: { color: "text-red-600", bg: "bg-red-100", icon: FiXCircle }
};

export default function MyBookingsPage() {
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState("all");

    const statuses = [
        { id: "all", name: "All Bookings" },
        { id: "confirmed", name: "Confirmed" },
        { id: "pending", name: "Pending" },
        { id: "completed", name: "Completed" },
        { id: "cancelled", name: "Cancelled" }
    ];

    const filteredBookings = selectedStatus === "all"
        ? mockBookings
        : mockBookings.filter(booking => booking.status === selectedStatus);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <motion.main
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <BoopWrapper>
                            <button
                                onClick={() => router.back()}
                                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                            >
                                <FiArrowLeft className="mr-2" />
                                Back
                            </button>
                        </BoopWrapper>
                    </motion.div>

                    {/* Header */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <FiCalendar className="h-8 w-8 text-pink-500 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                My Bookings
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            View and manage your upcoming appointments and past bookings.
                            Track the status of your services and access booking details.
                        </p>
                    </motion.div>

                    {/* Status Filter */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                            Filter by Status
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {statuses.map((status, index) => (
                                <motion.div
                                    key={status.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <BoopWrapper>
                                        <button
                                            onClick={() => setSelectedStatus(status.id)}
                                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${selectedStatus === status.id
                                                ? "bg-pink-500 text-white shadow-lg"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:border-pink-300"
                                                }`}
                                        >
                                            {status.name}
                                        </button>
                                    </BoopWrapper>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Bookings List */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {filteredBookings.length === 0 ? (
                            <motion.div
                                className="text-center py-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📅</div>
                                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    No bookings found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {selectedStatus === "all"
                                        ? "You haven't made any bookings yet."
                                        : `No ${selectedStatus} bookings found.`
                                    }
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                {filteredBookings.map((booking, index) => {
                                    const status = statusConfig[booking.status as keyof typeof statusConfig];
                                    const StatusIcon = status.icon;

                                    return (
                                        <motion.div
                                            key={booking.id}
                                            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            whileHover={{ y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                                        >
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                            {booking.serviceName}
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                                                            {booking.provider}
                                                        </p>
                                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                            <FiStar className="text-yellow-400 h-4 w-4 mr-1" />
                                                            <span>{booking.rating} rating</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-pink-500 mb-2">
                                                            {booking.price}
                                                        </div>
                                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                                                            <StatusIcon className="h-4 w-4 mr-1" />
                                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <FiCalendar className="h-4 w-4 mr-2" />
                                                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <FiClock className="h-4 w-4 mr-2" />
                                                        <span>{booking.time}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                    <FiMapPin className="h-4 w-4 mr-2" />
                                                    <span>{booking.location}</span>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {booking.services.map((service, serviceIndex) => (
                                                        <span
                                                            key={serviceIndex}
                                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm rounded-full"
                                                        >
                                                            {service}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex gap-3">
                                                    <BoopWrapper>
                                                        <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-medium transition-colors">
                                                            View Details
                                                        </button>
                                                    </BoopWrapper>
                                                    {booking.status === "confirmed" && (
                                                        <BoopWrapper>
                                                            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                                                Reschedule
                                                            </button>
                                                        </BoopWrapper>
                                                    )}
                                                    {booking.status === "pending" && (
                                                        <BoopWrapper>
                                                            <button className="px-4 py-2 border border-red-300 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                                Cancel
                                                            </button>
                                                        </BoopWrapper>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </motion.main>
            </div>
        </div>
    );
} 