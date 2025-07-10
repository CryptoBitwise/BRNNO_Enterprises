"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiMapPin } from "react-icons/fi";
import { useRouter } from "next/navigation";
import LocationSearch from "@/components/LocationSearch";
import { MockService } from "@/data/mockServices";
import BoopWrapper from "@/components/ui/BoopWrapper";

export default function NearbyServicesPage() {
    const router = useRouter();
    const [foundServices, setFoundServices] = useState<MockService[]>([]);

    const handleServicesFound = (services: MockService[]) => {
        setFoundServices(services);
    };

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
                            <FiMapPin className="h-8 w-8 text-pink-500 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Find Nearby Services
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Discover professional vehicle detailing services in your area.
                            Enter your zip code to find mobile detailers, drop-off locations,
                            and self-service bays near you.
                        </p>
                    </motion.div>

                    {/* Location Search Component */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <LocationSearch onServicesFound={handleServicesFound} />
                    </motion.div>

                    {/* Additional Info */}
                    {foundServices.length > 0 && (
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Service Types Available
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-2xl mb-2">🚗</div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Mobile Detailing</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        We come to you! Professional detailing at your location.
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-2xl mb-2">🏢</div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Drop-off Location</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Bring your vehicle to our professional facility.
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-2xl mb-2">💧</div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Self-Service Bay</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Do-it-yourself wash and detail with professional equipment.
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-2xl mb-2">✨</div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Professional Detailer</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Expert detailing with premium packages and services.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Demo Features */}
                    <motion.div
                        className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            🚀 Demo Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start">
                                <div className="bg-pink-100 dark:bg-pink-900/30 rounded-full p-2 mr-3">
                                    <FiMapPin className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Smart Geocoding</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Converts zip codes to coordinates for accurate distance calculations.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-pink-100 dark:bg-pink-900/30 rounded-full p-2 mr-3">
                                    <FiMapPin className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Radius Search</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Find services within 5-50 miles of your location.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-pink-100 dark:bg-pink-900/30 rounded-full p-2 mr-3">
                                    <FiMapPin className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Real-time Results</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Instant filtering and sorting by distance and rating.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.main>
            </div>
        </div>
    );
} 