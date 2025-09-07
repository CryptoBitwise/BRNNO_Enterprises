"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiSearch, FiMapPin, FiStar } from "react-icons/fi";
import { useRouter } from "next/navigation";
import BoopWrapper from "@/components/ui/BoopWrapper";

// Mock data for search results
const mockResults = [
    {
        id: 1,
        name: "Premium Auto Detailing",
        rating: 4.8,
        reviews: 127,
        distance: "2.3 miles",
        price: "$89",
        services: ["Exterior Wash", "Interior Clean", "Wax"],
        image: "/api/placeholder/300/200"
    },
    {
        id: 2,
        name: "Elite Car Care",
        rating: 4.6,
        reviews: 89,
        distance: "1.8 miles",
        price: "$75",
        services: ["Full Detail", "Paint Correction", "Ceramic Coating"],
        image: "/api/placeholder/300/200"
    },
    {
        id: 3,
        name: "Mobile Detail Pro",
        rating: 4.9,
        reviews: 203,
        distance: "3.1 miles",
        price: "$95",
        services: ["Mobile Service", "Interior Deep Clean", "Headlight Restoration"],
        image: "/api/placeholder/300/200"
    }
];

export default function SearchPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [selectedService, setSelectedService] = useState("all");

    const services = [
        { id: "all", name: "All Services" },
        { id: "wash", name: "Car Wash" },
        { id: "detail", name: "Full Detail" },
        { id: "interior", name: "Interior Clean" },
        { id: "wax", name: "Wax & Polish" },
        { id: "ceramic", name: "Ceramic Coating" }
    ];

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
                            <FiSearch className="h-8 w-8 text-pink-500 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Search Services
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Find the perfect detailing service for your vehicle.
                            Search by location, service type, or specific requirements.
                        </p>
                    </motion.div>

                    {/* Search Form */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search Input */}
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                />
                            </div>

                            {/* Location Input */}
                            <div className="relative">
                                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Enter location..."
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                />
                            </div>

                            {/* Service Filter */}
                            <select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            >
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </motion.div>

                    {/* Service Categories */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                            Popular Services
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {services.slice(1).map((service, index) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                >
                                    <BoopWrapper>
                                        <button
                                            onClick={() => setSelectedService(service.id)}
                                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${selectedService === service.id
                                                ? "bg-pink-500 text-white shadow-lg"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:border-pink-300"
                                                }`}
                                        >
                                            {service.name}
                                        </button>
                                    </BoopWrapper>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Search Results */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                            Search Results ({mockResults.length})
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockResults.map((result, index) => (
                                <motion.div
                                    key={result.id}
                                    className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-600"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                                >
                                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                                        <div className="text-gray-400 dark:text-gray-500 text-4xl">🚗</div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                {result.name}
                                            </h4>
                                            <span className="text-pink-500 font-bold">{result.price}</span>
                                        </div>

                                        <div className="flex items-center mb-3">
                                            <div className="flex items-center">
                                                <FiStar className="text-yellow-400 h-4 w-4 mr-1" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {result.rating} ({result.reviews} reviews)
                                                </span>
                                            </div>
                                            <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                                                {result.distance}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {result.services.map((service, serviceIndex) => (
                                                <span
                                                    key={serviceIndex}
                                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded"
                                                >
                                                    {service}
                                                </span>
                                            ))}
                                        </div>

                                        <BoopWrapper>
                                            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-medium transition-colors">
                                                Book Now
                                            </button>
                                        </BoopWrapper>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.main>
            </div>
        </div>
    );
} 