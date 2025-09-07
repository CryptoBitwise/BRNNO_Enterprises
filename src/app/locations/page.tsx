"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiMapPin, FiPlus, FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import BoopWrapper from "@/components/ui/BoopWrapper";
import SavedLocationCard from "@/components/SavedLocationCard";
import LocationModal from "@/components/LocationModal";
import { useToast } from "@/components/Toast";

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

export default function LocationsPage() {
    const router = useRouter();
    const [locations, setLocations] = useState<SavedLocation[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<SavedLocation | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { showToast } = useToast();

    // Load saved locations from localStorage on mount
    useEffect(() => {
        const savedLocations = localStorage.getItem('savedLocations');
        if (savedLocations) {
            try {
                setLocations(JSON.parse(savedLocations));
            } catch (error) {
                console.error('Error loading saved locations:', error);
            }
        }
    }, []);

    // Save locations to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('savedLocations', JSON.stringify(locations));
    }, [locations]);

    const handleAddLocation = () => {
        setEditingLocation(null);
        setIsModalOpen(true);
    };

    const handleEditLocation = (location: SavedLocation) => {
        setEditingLocation(location);
        setIsModalOpen(true);
    };

    const handleSaveLocation = (location: SavedLocation) => {
        if (editingLocation) {
            // Update existing location
            setLocations(prev => prev.map(loc =>
                loc.id === editingLocation.id ? location : loc
            ));
            showToast("Location updated successfully!", "success");
        } else {
            // Add new location
            const newLocation = {
                ...location,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };

            // If this is set as default, remove default from other locations
            if (location.isDefault) {
                setLocations(prev => prev.map(loc => ({ ...loc, isDefault: false })));
            }

            setLocations(prev => [...prev, newLocation]);
            showToast("Location saved successfully!", "success");
        }
    };

    const handleSelectLocation = (location: SavedLocation) => {
        // Navigate to nearby services with pre-filled location
        const locationData = encodeURIComponent(JSON.stringify({
            address: location.address,
            zip: location.zip,
            name: location.name
        }));
        router.push(`/nearby-services?location=${locationData}`);
    };

    const handleSetDefault = (location: SavedLocation) => {
        setLocations(prev => prev.map(loc => ({
            ...loc,
            isDefault: loc.id === location.id
        })));
        showToast(`${location.name} set as default location!`, "success");
    };

    const handleDeleteLocation = (location: SavedLocation) => {
        setLocations(prev => prev.filter(loc => loc.id !== location.id));
        showToast("Location deleted successfully!", "success");
    };

    const [categoryFilter, setCategoryFilter] = useState<'all' | 'home' | 'work' | 'other'>('all');

    const filteredLocations = locations.filter(location => {
        const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.zip.includes(searchTerm);

        const matchesCategory = categoryFilter === 'all' || location.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const defaultLocation = locations.find(loc => loc.isDefault);

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
                                Saved Locations
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Manage your favorite locations for quick access to vehicle detailing services.
                            Save your home, work, or any other location you frequently use.
                        </p>
                    </motion.div>

                    {/* Search and Add Button */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            />
                        </div>
                        <BoopWrapper>
                            <button
                                onClick={handleAddLocation}
                                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <FiPlus className="h-5 w-5" />
                                Add Location
                            </button>
                        </BoopWrapper>
                    </motion.div>

                    {/* Category Filter */}
                    <motion.div
                        className="flex flex-wrap gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {(['all', 'home', 'work', 'other'] as const).map((cat) => (
                            <BoopWrapper key={cat}>
                                <button
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${categoryFilter === cat
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            </BoopWrapper>
                        ))}
                    </motion.div>

                    {/* Default Location Section */}
                    {defaultLocation && (
                        <motion.div
                            className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-pink-200 dark:border-pink-800"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        🌟 Default Location
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        This location will be used as your primary address for service bookings.
                                    </p>
                                </div>
                                <BoopWrapper>
                                    <button
                                        onClick={() => handleSelectLocation(defaultLocation)}
                                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Use Default
                                    </button>
                                </BoopWrapper>
                            </div>
                        </motion.div>
                    )}

                    {/* Locations List */}
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="space-y-4">
                            {filteredLocations.length > 0 ? (
                                filteredLocations.map((location, index) => (
                                    <motion.div
                                        key={location.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                    >
                                        <SavedLocationCard
                                            location={location}
                                            onSelect={handleSelectLocation}
                                            onEdit={handleEditLocation}
                                            onDelete={handleDeleteLocation}
                                            onSetDefault={handleSetDefault}
                                            isDefault={location.isDefault}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    className="text-center py-12"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <FiMapPin className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                        {searchTerm ? 'No locations found' : 'No saved locations yet'}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-500 mb-6">
                                        {searchTerm
                                            ? 'Try adjusting your search terms'
                                            : 'Add your first location to get started'
                                        }
                                    </p>
                                    {!searchTerm && (
                                        <BoopWrapper>
                                            <button
                                                onClick={handleAddLocation}
                                                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                                            >
                                                <FiPlus className="h-5 w-5" />
                                                Add Your First Location
                                            </button>
                                        </BoopWrapper>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.main>
            </div>

            {/* Location Modal */}
            <LocationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLocation}
                defaultValues={editingLocation || undefined}
                title={editingLocation ? "Edit Location" : "Add New Location"}
            />
        </div>
    );
} 