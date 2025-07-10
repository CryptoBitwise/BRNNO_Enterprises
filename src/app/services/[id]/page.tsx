"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { use } from "react";
import { items } from '@/data/catalog';
import { FiArrowLeft, FiMapPin } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaCar } from "react-icons/fa";
import BookingForm from "@/components/BookingForm";
import { motion } from "framer-motion";
import BoopWrapper from "@/components/ui/BoopWrapper";

interface Service {
    id: number;
    title: string;
    categoryKey: string;
    image: string;
    description: string;
    vendor: string;
    rating: number;
    reviews: number;
    distance: string;
    mobileService: boolean;
}

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [showBooking, setShowBooking] = useState(false);
    const resolvedParams = use(params);
    const service = items.find((it: Service) => it.id.toString() === resolvedParams.id);

    if (!service) {
        return (
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="container mx-auto px-4 py-8"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="text-center"
                >
                    <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
                    <BoopWrapper>
                        <button
                            onClick={() => router.back()}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Go Back
                        </button>
                    </BoopWrapper>
                </motion.div>
            </motion.main>
        );
    }

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-8"
        >
            {/* Back Link */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <BoopWrapper>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 mb-6 hover:underline transition-colors"
                    >
                        <FiArrowLeft className="mr-2" /> Back
                    </button>
                </BoopWrapper>
            </motion.div>

            {/* Hero */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
                <motion.div
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="w-full h-60 sm:h-80 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4, type: "spring", damping: 15 }}
                    >
                        <FaCar className="text-gray-400 text-6xl" />
                    </motion.div>
                </motion.div>

                <div className="p-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-2xl font-bold mb-2"
                    >
                        {service.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-600 mb-4"
                    >
                        {service.vendor}
                    </motion.p>

                    {/* Rating */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center text-orange-400 mb-4"
                    >
                        {[...Array(5)].map((_, i) => (
                            <motion.span
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                            >
                                {i < Math.round(service.rating) ? (
                                    <AiFillStar />
                                ) : (
                                    <AiOutlineStar className="text-gray-300" />
                                )}
                            </motion.span>
                        ))}
                        <span className="ml-2 text-gray-500">{service.rating} ({service.reviews} reviews)</span>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="text-gray-700 mb-6"
                    >
                        {service.description}
                    </motion.p>

                    {/* Location & Distance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="flex items-center text-gray-600 mb-6"
                    >
                        <FiMapPin className="mr-2 text-lg" />
                        <span>{service.distance} away</span>
                    </motion.div>

                    {/* Mobile Service Badge */}
                    {service.mobileService && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.1 }}
                            className="mb-6"
                        >
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                🚗 Mobile Service Available
                            </span>
                        </motion.div>
                    )}

                    {/* Book Now CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                    >
                        <BoopWrapper>
                            <button
                                onClick={() => setShowBooking(true)}
                                className="
                                    bg-pink-500 hover:bg-pink-600 text-white font-semibold
                                    px-8 py-3 rounded-full transition-colors
                                    w-full sm:w-auto
                                "
                            >
                                Book Now
                            </button>
                        </BoopWrapper>
                    </motion.div>
                </div>
            </motion.div>

            {/* Booking Modal */}
            {showBooking && (
                <BookingForm
                    serviceTitle={service.title}
                    serviceId={service.id}
                    onClose={() => setShowBooking(false)}
                />
            )}
        </motion.main>
    );
} 