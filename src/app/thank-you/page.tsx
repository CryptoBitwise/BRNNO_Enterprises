"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiCheckCircle, FiHome, FiUser, FiCalendar } from "react-icons/fi";
import BoopWrapper from "@/components/ui/BoopWrapper";

export default function ThankYouPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <motion.main
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {/* Success Icon */}
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <FiCheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                    </motion.div>

                    {/* Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Booking Confirmed!
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Thank you for choosing Reviva for your vehicle detailing service
                        </p>
                    </motion.div>

                    {/* Booking Details */}
                    <motion.div
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Booking Details
                        </h2>
                        <div className="space-y-3 text-left">
                            <div className="flex items-center">
                                <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-gray-600 dark:text-gray-400">
                                    <strong className="text-gray-900 dark:text-gray-100">Date:</strong> January 15, 2024
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-gray-600 dark:text-gray-400">
                                    <strong className="text-gray-900 dark:text-gray-100">Time:</strong> 10:00 AM
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FiUser className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-gray-600 dark:text-gray-400">
                                    <strong className="text-gray-900 dark:text-gray-100">Service:</strong> Premium Car Wash
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FiUser className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-gray-600 dark:text-gray-400">
                                    <strong className="text-gray-900 dark:text-gray-100">Provider:</strong> Elite Auto Care
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Next Steps */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            What's Next?
                        </h3>
                        <div className="space-y-3 text-gray-600 dark:text-gray-400">
                            <p>• You'll receive a confirmation email with booking details</p>
                            <p>• Our team will contact you within 24 hours to confirm</p>
                            <p>• You can track your booking status in your account</p>
                            <p>• We'll send reminders before your appointment</p>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <BoopWrapper>
                            <Link href="/">
                                <button className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                                    <FiHome className="h-5 w-5 mr-2" />
                                    Back to Home
                                </button>
                            </Link>
                        </BoopWrapper>

                        <BoopWrapper>
                            <Link href="/my-bookings">
                                <button className="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                                    <FiCalendar className="h-5 w-5 mr-2" />
                                    View My Bookings
                                </button>
                            </Link>
                        </BoopWrapper>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Need help? Contact us at{" "}
                            <a href="mailto:support@reviva.com" className="text-pink-500 hover:text-pink-600">
                                support@reviva.com
                            </a>
                        </p>
                    </motion.div>
                </motion.main>
            </div>
        </div>
    );
} 