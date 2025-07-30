"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiSearch, FiNavigation, FiStar, FiPhone, FiGlobe, FiClock, FiHome, FiBriefcase, FiCalendar } from "react-icons/fi";
import { FaCar, FaTruck, FaShip, FaMotorcycle } from "react-icons/fa";
import BoopWrapper from "@/components/ui/BoopWrapper";
import { findNearbyServices, zipToCoordinates, MockService } from "@/data/mockServices";
import LocationMap from "@/components/ui/LocationMap";
import { getAutoFillSuggestions, updateLocationPreferences } from "@/utils/locationPreferences";

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

interface LocationSearchProps {
    onServicesFound: (services: MockService[]) => void;
    prefilledLocation?: string;
}

export default function LocationSearch({ onServicesFound, prefilledLocation }: LocationSearchProps) {
    const [zipCode, setZipCode] = useState(prefilledLocation || "");
    const [radius, setRadius] = useState(10);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<MockService[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
    const [showSavedLocations, setShowSavedLocations] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<SavedLocation | undefined>();

    // Load saved locations
    useEffect(() => {
        const saved = localStorage.getItem('savedLocations');
        if (saved) {
            try {
                setSavedLocations(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading saved locations:', error);
            }
        }
    }, []);

    // Update zip code when prefilledLocation changes
    useEffect(() => {
        if (prefilledLocation) {
            setZipCode(prefilledLocation);
        }
    }, [prefilledLocation]);

    // Close saved locations dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Element;
            if (!target.closest('.saved-locations-dropdown')) {
                setShowSavedLocations(false);
            }
        };

        if (showSavedLocations) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSavedLocations]);

    const handleSearch = async () => {
        if (!zipCode.trim()) return;

        setIsSearching(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const coordinates = zipToCoordinates[zipCode];

        if (!coordinates) {
            // Mock geocoding for unknown zip codes
            const mockLat = 40.3469 + (Math.random() - 0.5) * 0.1;
            const mockLng = -111.9047 + (Math.random() - 0.5) * 0.1;
            const nearbyServices = findNearbyServices(mockLat, mockLng, radius);
            setSearchResults(nearbyServices);
        } else {
            const nearbyServices = findNearbyServices(coordinates.lat, coordinates.lng, radius);
            setSearchResults(nearbyServices);
        }

        // Update location preferences for smart auto-fill
        const selectedLocationCategory = selectedLocation?.category;
        updateLocationPreferences(zipCode, radius, selectedLocationCategory);

        setHasSearched(true);
        setIsSearching(false);
        onServicesFound(searchResults);
    };

    const getServiceIcon = (type: string) => {
        switch (type) {
            case "Mobile Detailing":
                return <FaCar className="h-5 w-5" />;
            case "Drop-off Location":
                return <FaTruck className="h-5 w-5" />;
            case "Self-Service Bay":
                return <FaShip className="h-5 w-5" />;
            case "Professional Detailer":
                return <FaMotorcycle className="h-5 w-5" />;
            default:
                return <FaCar className="h-5 w-5" />;
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FiStar
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating)
                    ? "text-yellow-400 fill-current"
                    : i < rating
                        ? "text-yellow-400 fill-current opacity-50"
                        : "text-gray-300"
                    }`}
            />
        ));
    };

    return (
        <div className="space-y-6">
            {/* Search Form */}
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center mb-4">
                    <FiMapPin className="h-6 w-6 text-pink-500 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Find Nearby Services
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Zip Code Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Zip Code
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                placeholder="Enter zip code"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                maxLength={5}
                            />
                            {savedLocations.length > 0 && (
                                <button
                                    onClick={() => setShowSavedLocations(!showSavedLocations)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                                    title="Use saved location"
                                >
                                    <FiMapPin className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Saved Locations Dropdown */}
                        <AnimatePresence>
                            {showSavedLocations && savedLocations.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto saved-locations-dropdown"
                                >
                                    {savedLocations.map((location) => (
                                        <button
                                            key={location.id}
                                            onClick={() => {
                                                setZipCode(location.zip);
                                                setSelectedLocation(location);
                                                setShowSavedLocations(false);

                                                // Apply smart auto-fill
                                                const suggestions = getAutoFillSuggestions(location.zip, location.category);
                                                setRadius(suggestions.radius);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                                        >
                                            {location.category === 'home' ? (
                                                <FiHome className="text-pink-500 h-4 w-4" />
                                            ) : location.category === 'work' ? (
                                                <FiBriefcase className="text-blue-500 h-4 w-4" />
                                            ) : (
                                                <FiMapPin className="text-gray-500 h-4 w-4" />
                                            )}
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {location.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {location.zip} • {location.address}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Radius Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Search Radius
                        </label>
                        <select
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value={5}>5 miles</option>
                            <option value={10}>10 miles</option>
                            <option value={15}>15 miles</option>
                            <option value={25}>25 miles</option>
                            <option value={50}>50 miles</option>
                        </select>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                        <BoopWrapper>
                            <button
                                onClick={handleSearch}
                                disabled={!zipCode.trim() || isSearching}
                                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                {isSearching ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <FiSearch className="h-4 w-4 mr-2" />
                                        Find Services
                                    </>
                                )}
                            </button>
                        </BoopWrapper>
                    </div>
                </div>

                {/* Quick Location Actions */}
                {savedLocations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4"
                    >
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Quick Actions
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {savedLocations.slice(0, 3).map((location) => (
                                <BoopWrapper key={location.id}>
                                    <button
                                        onClick={() => {
                                            setZipCode(location.zip);
                                            setSelectedLocation(location);

                                            // Apply smart auto-fill
                                            const suggestions = getAutoFillSuggestions(location.zip, location.category);
                                            setRadius(suggestions.radius);

                                            handleSearch();
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-pink-100 dark:hover:bg-pink-900/20 rounded-lg text-sm transition-colors"
                                    >
                                        {location.category === 'home' ? (
                                            <FiHome className="text-pink-500 h-4 w-4" />
                                        ) : location.category === 'work' ? (
                                            <FiBriefcase className="text-blue-500 h-4 w-4" />
                                        ) : (
                                            <FiMapPin className="text-gray-500 h-4 w-4" />
                                        )}
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {location.name}
                                        </span>
                                    </button>
                                </BoopWrapper>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Demo Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <FiNavigation className="h-5 w-5 text-blue-500 mr-2" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Demo Mode:</strong> This is a demonstration of location-based service discovery.
                            Try zip codes like 84005, 84043, 84003, or any 5-digit code for mock results.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Search Results */}
            <AnimatePresence>
                {hasSearched && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Map View */}
                        <LocationMap
                            savedLocations={savedLocations}
                            nearbyServices={searchResults}
                            selectedLocation={selectedLocation}
                            onLocationSelect={setSelectedLocation}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                        />

                        {/* Results List */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Found {searchResults.length} service{searchResults.length !== 1 ? 's' : ''} within {radius} miles
                                </h3>
                                {zipToCoordinates[zipCode] && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {zipToCoordinates[zipCode].city}, {zipToCoordinates[zipCode].state}
                                    </span>
                                )}
                            </div>

                            {searchResults.length === 0 ? (
                                <div className="text-center py-8">
                                    <FiMapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No services found within {radius} miles. Try expanding your search radius.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {searchResults.map((service, index) => (
                                        <motion.div
                                            key={service.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-lg mr-3">
                                                        {getServiceIcon(service.type)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {service.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {service.type}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                                                        {service.distance?.toFixed(1)} mi
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Static Map Preview (placeholder for now) */}
                                            <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center h-32">
                                                {/* TODO: Replace with Google Static Maps API preview */}
                                                <span className="text-xs text-gray-400">Map preview coming soon</span>
                                            </div>

                                            {/* Address */}
                                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-200 mb-2">
                                                <FiMapPin className="h-4 w-4 mr-1 text-pink-500" />
                                                <span>{service.address}</span>
                                            </div>

                                            {/* Hours */}
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                <FiClock className="h-4 w-4 mr-1" />
                                                {service.hours}
                                            </div>

                                            {/* Primary Action - Book Now */}
                                            <div className="mb-3">
                                                <BoopWrapper>
                                                    <button
                                                        onClick={() => {
                                                            // Navigate to booking with service details
                                                            const bookingData = encodeURIComponent(JSON.stringify({
                                                                serviceId: service.id,
                                                                serviceTitle: service.title,
                                                                serviceAddress: service.address,
                                                                serviceZip: zipCode
                                                            }));
                                                            window.location.href = `/services/${service.id}?booking=${bookingData}`;
                                                        }}
                                                        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <FiCalendar className="h-4 w-4" />
                                                        Book Now
                                                    </button>
                                                </BoopWrapper>
                                            </div>

                                            {/* Secondary Actions */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    {service.phone && (
                                                        <a
                                                            href={`tel:${service.phone.replace(/[^\d]/g, "")}`}
                                                            className="flex items-center text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300"
                                                            title="Call"
                                                        >
                                                            <FiPhone className="h-3 w-3 mr-1" />
                                                            Call
                                                        </a>
                                                    )}
                                                    {service.website && (
                                                        <a
                                                            href={service.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                                            title="Website"
                                                        >
                                                            <FiGlobe className="h-3 w-3 mr-1" />
                                                            Website
                                                        </a>
                                                    )}
                                                </div>
                                                {/* Get Directions */}
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                                                    title="Get Directions"
                                                >
                                                    <FiNavigation className="h-3 w-3 mr-1" />
                                                    Directions
                                                </a>
                                            </div>

                                            {/* Features */}
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {service.features.map((feature, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                                {service.description}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 