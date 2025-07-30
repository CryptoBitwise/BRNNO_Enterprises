"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiHome, FiBriefcase, FiNavigation, FiStar } from "react-icons/fi";
import { MockService } from "@/data/mockServices";

interface SavedLocation {
    id: string;
    name: string;
    address: string;
    zip: string;
    notes?: string;
    category?: 'home' | 'work' | 'other';
    isDefault?: boolean;
    createdAt: string;
}

interface LocationMapProps {
    savedLocations: SavedLocation[];
    nearbyServices: MockService[];
    selectedLocation?: SavedLocation;
    onLocationSelect?: (location: SavedLocation) => void;
    className?: string;
}

export default function LocationMap({
    savedLocations,
    nearbyServices,
    selectedLocation,
    onLocationSelect,
    className = ""
}: LocationMapProps) {
    const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
    const [hoveredService, setHoveredService] = useState<string | null>(null);

    // Mock coordinates for visualization
    const getLocationCoordinates = (zip: string) => {
        const baseCoords = {
            "84005": { x: 20, y: 30 },
            "84043": { x: 70, y: 60 },
            "84003": { x: 40, y: 80 },
            "84062": { x: 80, y: 20 },
            "84057": { x: 60, y: 40 },
            "84604": { x: 30, y: 70 },
            "84660": { x: 90, y: 50 },
            "84663": { x: 50, y: 90 },
            "84664": { x: 10, y: 60 }
        };

        return baseCoords[zip as keyof typeof baseCoords] || { x: 50, y: 50 };
    };

    const getServiceCoordinates = (service: MockService, baseLocation?: SavedLocation) => {
        if (baseLocation) {
            const base = getLocationCoordinates(baseLocation.zip);
            return {
                x: base.x + (Math.random() - 0.5) * 40,
                y: base.y + (Math.random() - 0.5) * 40
            };
        }
        return {
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10
        };
    };

    const getDistanceColor = (distance: string) => {
        const miles = parseInt(distance.replace(' miles', ''));
        if (miles <= 5) return 'text-green-500';
        if (miles <= 10) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className={`relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 ${className}`}>
            {/* Map Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FiNavigation className="text-pink-500 h-5 w-5" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Service Map
                    </h3>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {nearbyServices.length} services nearby
                </div>
            </div>

            {/* Map Container */}
            <div className="relative w-full h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                {/* Map Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                        backgroundImage: `
                            linear-gradient(90deg, #e5e7eb 1px, transparent 1px),
                            linear-gradient(#e5e7eb 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px'
                    }} />
                </div>

                {/* Saved Location Pins */}
                <AnimatePresence>
                    {savedLocations.map((location, index) => {
                        const coords = getLocationCoordinates(location.zip);
                        return (
                            <motion.div
                                key={location.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="absolute cursor-pointer"
                                style={{
                                    left: `${coords.x}%`,
                                    top: `${coords.y}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                onMouseEnter={() => setHoveredLocation(location.id)}
                                onMouseLeave={() => setHoveredLocation(null)}
                                onClick={() => onLocationSelect?.(location)}
                            >
                                {/* Location Pin */}
                                <div className={`
                                    relative p-2 rounded-full shadow-lg transition-all duration-200
                                    ${selectedLocation?.id === location.id
                                        ? 'bg-pink-500 text-white scale-110'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:scale-105'
                                    }
                                    ${hoveredLocation === location.id ? 'ring-2 ring-pink-300' : ''}
                                `}>
                                    {location.category === 'home' ? (
                                        <FiHome className="h-4 w-4" />
                                    ) : location.category === 'work' ? (
                                        <FiBriefcase className="h-4 w-4" />
                                    ) : (
                                        <FiMapPin className="h-4 w-4" />
                                    )}
                                </div>

                                {/* Location Label */}
                                <AnimatePresence>
                                    {hoveredLocation === location.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-xs font-medium whitespace-nowrap z-10"
                                        >
                                            {location.name}
                                            <div className="text-gray-500 dark:text-gray-400">
                                                {location.zip}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Service Pins */}
                <AnimatePresence>
                    {nearbyServices.slice(0, 8).map((service, index) => {
                        const coords = getServiceCoordinates(service, selectedLocation);
                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                                className="absolute cursor-pointer"
                                style={{
                                    left: `${coords.x}%`,
                                    top: `${coords.y}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                onMouseEnter={() => setHoveredService(service.id)}
                                onMouseLeave={() => setHoveredService(null)}
                            >
                                {/* Service Pin */}
                                <div className={`
                                    relative p-1.5 rounded-full shadow-md transition-all duration-200
                                    bg-blue-500 text-white hover:scale-110
                                    ${hoveredService === service.id ? 'ring-2 ring-blue-300' : ''}
                                `}>
                                    <FiStar className="h-3 w-3" />
                                </div>

                                {/* Service Label */}
                                <AnimatePresence>
                                    {hoveredService === service.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-xs font-medium whitespace-nowrap z-10 max-w-32"
                                        >
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {service.title}
                                            </div>
                                            <div className={`text-xs ${getDistanceColor(`${service.distance || 0} miles`)}`}>
                                                {service.distance || 0} miles
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Distance Rings */}
                {selectedLocation && (
                    <div
                        className="absolute border-2 border-pink-200 dark:border-pink-800 rounded-full opacity-30"
                        style={{
                            left: `${getLocationCoordinates(selectedLocation.zip).x}%`,
                            top: `${getLocationCoordinates(selectedLocation.zip).y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: '60%',
                            height: '60%'
                        }}
                    />
                )}
            </div>

            {/* Map Legend */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <FiHome className="h-3 w-3 text-pink-500" />
                        <span>Home</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FiBriefcase className="h-3 w-3 text-blue-500" />
                        <span>Work</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FiStar className="h-3 w-3 text-blue-500" />
                        <span>Services</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>≤5mi</span>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>≤10mi</span>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>{'>'}10mi</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 