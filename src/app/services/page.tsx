"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    FiSearch,
    FiMapPin,
    FiFilter,
    FiStar,
    FiClock,
    FiDollarSign,
    FiTruck,
    FiCheckCircle,
    FiArrowRight,
    FiPhone,
    FiGlobe,
    FiCalendar,
    FiShield
} from "react-icons/fi";
import { FaCar, FaTruck, FaShip, FaMotorcycle } from "react-icons/fa";
import { BoopButton } from "@/components/ui/BoopWrapper";

// Combined data structure for both provider types
interface ServiceProvider {
    id: string;
    name: string;
    type: 'brnno' | 'directory';
    category: string;
    description: string;
    location: string;
    distance: string;
    rating?: number;
    reviews?: number;
    phone?: string;
    website?: string;
    mobileService?: boolean;
    hourlyRate?: number;
    flatRateMin?: number;
    flatRateMax?: number;
    responseTime?: number;
    verificationStatus?: 'verified' | 'pending';
    yearsInBusiness?: number;
    serviceAreas?: string[];
    specialties?: string[];
}

const serviceCategories = [
    { key: 'all', label: 'All Services', icon: FiSearch },
    { key: 'cars', label: 'Cars', icon: FaCar },
    { key: 'trucks', label: 'Trucks', icon: FaTruck },
    { key: 'watercraft-rv', label: 'Watercraft & RV', icon: FaShip },
    { key: 'motorcycles', label: 'Motorcycles', icon: FaMotorcycle },
];

const providerTypeFilters = [
    { key: 'all', label: 'All Services', icon: FiSearch, color: 'gray' },
    { key: 'brnno', label: 'BRNNO Verified', icon: FiCheckCircle, color: 'blue' },
    { key: 'directory', label: 'Directory Only', icon: FiGlobe, color: 'gray' },
    { key: 'mobile', label: 'Mobile Service', icon: FiTruck, color: 'green' },
];

const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Nearest' },
    { value: 'price', label: 'Lowest Price' },
    { value: 'name', label: 'Name A-Z' },
];

export default function ServicesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [providers, setProviders] = useState<ServiceProvider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProviderType, setSelectedProviderType] = useState("all");
    const [sortBy, setSortBy] = useState("rating");
    const [showFilters, setShowFilters] = useState(false);
    const [location, setLocation] = useState("");

    // Handle category from URL parameters
    useEffect(() => {
        const category = searchParams.get('category');
        if (category && serviceCategories.some(cat => cat.key === category)) {
            setSelectedCategory(category);
        }
    }, [searchParams]);

    // Load combined providers data
    useEffect(() => {
        const loadProviders = async () => {
            try {
                setIsLoading(true);

                // Mock data combining both BRNNO providers and directory listings
                const mockProviders: ServiceProvider[] = [
                    // BRNNO Verified Providers
                    {
                        id: '1',
                        name: 'Elite Auto Detailing',
                        type: 'brnno',
                        category: 'cars',
                        description: 'Premium auto detailing services with eco-friendly products',
                        location: 'Anytown, CA',
                        distance: '2.3 miles',
                        rating: 4.8,
                        reviews: 127,
                        phone: '(555) 123-4567',
                        website: 'eliteauto.com',
                        mobileService: true,
                        hourlyRate: 75,
                        flatRateMin: 50,
                        flatRateMax: 200,
                        responseTime: 2,
                        verificationStatus: 'verified',
                        yearsInBusiness: 5,
                        serviceAreas: ['Anytown', 'Nearby City', 'Suburb'],
                        specialties: ['detailing', 'washing', 'waxing']
                    },
                    {
                        id: '2',
                        name: 'Mobile Wash Masters',
                        type: 'brnno',
                        category: 'cars',
                        description: 'Professional mobile car wash and detailing services',
                        location: 'Anytown, CA',
                        distance: '1.8 miles',
                        rating: 4.6,
                        reviews: 89,
                        phone: '(555) 987-6543',
                        website: 'mobilewash.com',
                        mobileService: true,
                        hourlyRate: 60,
                        flatRateMin: 40,
                        flatRateMax: 150,
                        responseTime: 1,
                        verificationStatus: 'verified',
                        yearsInBusiness: 3,
                        serviceAreas: ['Anytown', 'Downtown', 'Westside'],
                        specialties: ['mobile wash', 'detailing']
                    },
                    {
                        id: '3',
                        name: 'Truck & Fleet Services',
                        type: 'brnno',
                        category: 'trucks',
                        description: 'Specialized truck and fleet vehicle cleaning services',
                        location: 'Anytown, CA',
                        distance: '4.1 miles',
                        rating: 4.9,
                        reviews: 156,
                        phone: '(555) 456-7890',
                        website: 'truckfleet.com',
                        mobileService: false,
                        hourlyRate: 85,
                        flatRateMin: 100,
                        flatRateMax: 300,
                        responseTime: 3,
                        verificationStatus: 'verified',
                        yearsInBusiness: 8,
                        serviceAreas: ['Industrial District', 'Port Area'],
                        specialties: ['fleet cleaning', 'truck detailing']
                    },
                    // Directory Only Listings
                    {
                        id: '4',
                        name: 'Quick Car Wash',
                        type: 'directory',
                        category: 'cars',
                        description: 'Fast and affordable car wash services',
                        location: 'Anytown, CA',
                        distance: '0.9 miles',
                        phone: '(555) 234-5678',
                        mobileService: false
                    },
                    {
                        id: '5',
                        name: 'Marine Services Pro',
                        type: 'directory',
                        category: 'watercraft-rv',
                        description: 'Boat and RV cleaning and maintenance',
                        location: 'Anytown, CA',
                        distance: '3.2 miles',
                        phone: '(555) 345-6789',
                        mobileService: true
                    },
                    {
                        id: '6',
                        name: 'Motorcycle Magic',
                        type: 'directory',
                        category: 'motorcycles',
                        description: 'Specialized motorcycle cleaning and detailing',
                        location: 'Anytown, CA',
                        distance: '2.7 miles',
                        phone: '(555) 456-7890',
                        mobileService: false
                    }
                ];

                setProviders(mockProviders);
            } catch (err) {
                console.error('Error loading providers:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadProviders();
    }, []);

    const filteredProviders = providers.filter(provider => {
        const matchesSearch = searchTerm === "" ||
            provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "all" || provider.category === selectedCategory;

        const matchesProviderType = selectedProviderType === "all" ||
            (selectedProviderType === "brnno" && provider.type === "brnno") ||
            (selectedProviderType === "directory" && provider.type === "directory") ||
            (selectedProviderType === "mobile" && provider.mobileService);

        return matchesSearch && matchesCategory && matchesProviderType;
    });

    const sortedProviders = [...filteredProviders].sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'distance':
                return parseFloat(a.distance) - parseFloat(b.distance);
            case 'price':
                return (a.hourlyRate || 0) - (b.hourlyRate || 0);
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    const getCategoryIcon = (category: string) => {
        const categoryData = serviceCategories.find(cat => cat.key === category);
        return categoryData ? categoryData.icon : FiSearch;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Finding services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Services</h1>
                        <p className="text-gray-600">Discover verified BRNNO providers and local directory listings</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by business name or service..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="lg:w-64">
                            <div className="relative">
                                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Enter your location..."
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filter Button */}
                        <BoopButton>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FiFilter className="w-5 h-5 mr-2" />
                                Filters
                            </button>
                        </BoopButton>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-gray-200"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {serviceCategories.map((category) => {
                                            const IconComponent = category.icon;
                                            return (
                                                <BoopButton key={category.key}>
                                                    <button
                                                        onClick={() => setSelectedCategory(category.key)}
                                                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.key
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        <IconComponent className="w-4 h-4 mr-2" />
                                                        {category.label}
                                                    </button>
                                                </BoopButton>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Provider Type Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Provider Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {providerTypeFilters.map((type) => {
                                            const IconComponent = type.icon;
                                            return (
                                                <BoopButton key={type.key}>
                                                    <button
                                                        onClick={() => setSelectedProviderType(type.key)}
                                                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedProviderType === type.key
                                                            ? `bg-${type.color}-500 text-white`
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        <IconComponent className="w-4 h-4 mr-2" />
                                                        {type.label}
                                                    </button>
                                                </BoopButton>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Sort Options */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {filteredProviders.length} Service{filteredProviders.length !== 1 ? 's' : ''} Found
                    </h2>
                    <div className="text-sm text-gray-600">
                        Sorted by {sortOptions.find(opt => opt.value === sortBy)?.label}
                    </div>
                </div>

                {/* Providers Grid */}
                {sortedProviders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiSearch className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                        <BoopButton>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("all");
                                    setSelectedProviderType("all");
                                    setLocation("");
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Clear Filters
                            </button>
                        </BoopButton>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedProviders.map((provider, index) => (
                            <motion.div
                                key={provider.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                {/* Provider Header */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                                                {/* Provider Type Badge */}
                                                {provider.type === 'brnno' ? (
                                                    <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                        <FiCheckCircle className="w-3 h-3 mr-1" />
                                                        BRNNO
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                                        <FiGlobe className="w-3 h-3 mr-1" />
                                                        Directory
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm">{provider.description}</p>
                                        </div>
                                        {provider.rating && (
                                            <div className="flex items-center space-x-1">
                                                <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    {provider.rating.toFixed(1)}
                                                </span>
                                                <span className="text-sm text-gray-500">({provider.reviews})</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Service Category */}
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const IconComponent = getCategoryIcon(provider.category);
                                            return (
                                                <span className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                    <IconComponent className="w-3 h-3 mr-1" />
                                                    {provider.category}
                                                </span>
                                            );
                                        })()}
                                        {provider.mobileService && (
                                            <span className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                <FiTruck className="w-3 h-3 mr-1" />
                                                Mobile
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Provider Details */}
                                <div className="p-6">
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center text-gray-600">
                                            <FiMapPin className="w-4 h-4 mr-2" />
                                            <span className="text-sm">{provider.location} • {provider.distance}</span>
                                        </div>

                                        {provider.phone && (
                                            <div className="flex items-center text-gray-600">
                                                <FiPhone className="w-4 h-4 mr-2" />
                                                <span className="text-sm">{provider.phone}</span>
                                            </div>
                                        )}

                                        {provider.website && (
                                            <div className="flex items-center text-gray-600">
                                                <FiGlobe className="w-4 h-4 mr-2" />
                                                <span className="text-sm">{provider.website}</span>
                                            </div>
                                        )}

                                        {provider.hourlyRate && (
                                            <div className="flex items-center text-gray-600">
                                                <FiDollarSign className="w-4 h-4 mr-2" />
                                                <span className="text-sm">${provider.hourlyRate}/hour</span>
                                            </div>
                                        )}

                                        {provider.responseTime && (
                                            <div className="flex items-center text-gray-600">
                                                <FiClock className="w-4 h-4 mr-2" />
                                                <span className="text-sm">{provider.responseTime}h avg response</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                        {provider.type === 'brnno' ? (
                                            <>
                                                <BoopButton>
                                                    <button
                                                        onClick={() => router.push(`/provider/${provider.id}`)}
                                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                    >
                                                        <FiCalendar className="w-4 h-4 mr-2" />
                                                        Book Now
                                                    </button>
                                                </BoopButton>
                                                <BoopButton>
                                                    <button
                                                        onClick={() => router.push(`/provider/${provider.id}`)}
                                                        className="flex items-center justify-center px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                                                    >
                                                        <FiArrowRight className="w-4 h-4" />
                                                    </button>
                                                </BoopButton>
                                            </>
                                        ) : (
                                            <>
                                                <BoopButton>
                                                    <button
                                                        onClick={() => window.open(`tel:${provider.phone}`)}
                                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                    >
                                                        <FiPhone className="w-4 h-4 mr-2" />
                                                        Call Now
                                                    </button>
                                                </BoopButton>
                                                <BoopButton>
                                                    <button
                                                        onClick={() => window.open(`https://maps.google.com/?q=${provider.location}`)}
                                                        className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <FiMapPin className="w-4 h-4" />
                                                    </button>
                                                </BoopButton>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Verification Badge for BRNNO Providers */}
                                {provider.type === 'brnno' && (
                                    <div className="px-6 py-3 bg-blue-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <FiShield className="w-4 h-4 text-blue-500 mr-2" />
                                                <span className="text-sm font-medium text-blue-900">
                                                    {provider.verificationStatus === 'verified' ? 'Verified Provider' : 'Pending Verification'}
                                                </span>
                                            </div>
                                            {provider.yearsInBusiness && (
                                                <span className="text-xs text-blue-700">
                                                    {provider.yearsInBusiness} years in business
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
