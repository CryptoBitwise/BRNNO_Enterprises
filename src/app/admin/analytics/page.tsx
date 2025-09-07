"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
    FiTrendingUp,
    FiTrendingDown,
    FiDollarSign,
    FiUsers,
    FiCalendar,
    FiStar,
    FiBarChart,
    FiPieChart,
    FiDownload,
    FiRefreshCw,
    FiArrowLeft,
    FiFilter,
    FiEye,
    FiShield
} from "react-icons/fi";
import BoopWrapper from "@/components/ui/BoopWrapper";

interface AnalyticsData {
    overview: {
        totalRevenue: number;
        monthlyRevenue: number;
        revenueGrowth: number;
        totalBookings: number;
        bookingGrowth: number;
        totalProviders: number;
        providerGrowth: number;
        totalCustomers: number;
        customerGrowth: number;
        averageRating: number;
        ratingGrowth: number;
    };
    revenue: {
        daily: { date: string; revenue: number }[];
        monthly: { month: string; revenue: number }[];
        byCategory: { category: string; revenue: number; percentage: number }[];
        byProvider: { provider: string; revenue: number; bookings: number }[];
    };
    bookings: {
        daily: { date: string; bookings: number }[];
        byStatus: { status: string; count: number; percentage: number }[];
        byCategory: { category: string; count: number; percentage: number }[];
        byTimeOfDay: { hour: number; count: number }[];
    };
    providers: {
        topPerformers: { name: string; revenue: number; bookings: number; rating: number }[];
        newProviders: { name: string; joinDate: string; status: string }[];
        byLocation: { location: string; count: number }[];
        byCategory: { category: string; count: number }[];
    };
    customers: {
        newCustomers: { date: string; count: number }[];
        repeatCustomers: { percentage: number; count: number }[];
        byLocation: { location: string; count: number }[];
        satisfaction: { rating: number; count: number }[];
    };
}

export default function AdminAnalyticsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'bookings' | 'providers' | 'customers'>('revenue');
    const [error, setError] = useState<string | null>(null);

    // Check if user is admin
    const isAdmin = user?.email === 'admin@brnno.com' || user?.uid === 'admin';

    // Redirect if not authenticated or not admin
    if (!loading && (!user || !isAdmin)) {
        router.push('/');
        return null;
    }

    // Load analytics data
    useEffect(() => {
        const loadAnalyticsData = async () => {
            try {
                setIsLoading(true);

                // Mock analytics data - in production, this would come from an API
                const mockData: AnalyticsData = {
                    overview: {
                        totalRevenue: 15750,
                        monthlyRevenue: 3200,
                        revenueGrowth: 12.5,
                        totalBookings: 127,
                        bookingGrowth: 8.3,
                        totalProviders: 45,
                        providerGrowth: 15.2,
                        totalCustomers: 89,
                        customerGrowth: 22.1,
                        averageRating: 4.7,
                        ratingGrowth: 2.1
                    },
                    revenue: {
                        daily: [
                            { date: '2024-01-01', revenue: 120 },
                            { date: '2024-01-02', revenue: 150 },
                            { date: '2024-01-03', revenue: 180 },
                            { date: '2024-01-04', revenue: 200 },
                            { date: '2024-01-05', revenue: 160 },
                            { date: '2024-01-06', revenue: 220 },
                            { date: '2024-01-07', revenue: 190 }
                        ],
                        monthly: [
                            { month: 'Jan', revenue: 3200 },
                            { month: 'Feb', revenue: 2800 },
                            { month: 'Mar', revenue: 3500 },
                            { month: 'Apr', revenue: 4100 },
                            { month: 'May', revenue: 3800 },
                            { month: 'Jun', revenue: 4500 }
                        ],
                        byCategory: [
                            { category: 'Cars', revenue: 8500, percentage: 54 },
                            { category: 'Trucks', revenue: 4200, percentage: 27 },
                            { category: 'Motorcycles', revenue: 2100, percentage: 13 },
                            { category: 'Watercraft & RV', revenue: 950, percentage: 6 }
                        ],
                        byProvider: [
                            { provider: 'Elite Auto Detailing', revenue: 3200, bookings: 25 },
                            { provider: 'Mobile Wash Masters', revenue: 2800, bookings: 22 },
                            { provider: 'Truck & Fleet Services', revenue: 2500, bookings: 18 },
                            { provider: 'Quick Clean Services', revenue: 2100, bookings: 15 }
                        ]
                    },
                    bookings: {
                        daily: [
                            { date: '2024-01-01', bookings: 3 },
                            { date: '2024-01-02', bookings: 5 },
                            { date: '2024-01-03', bookings: 7 },
                            { date: '2024-01-04', bookings: 8 },
                            { date: '2024-01-05', bookings: 6 },
                            { date: '2024-01-06', bookings: 9 },
                            { date: '2024-01-07', bookings: 7 }
                        ],
                        byStatus: [
                            { status: 'Completed', count: 89, percentage: 70 },
                            { status: 'Confirmed', count: 23, percentage: 18 },
                            { status: 'Pending', count: 12, percentage: 9 },
                            { status: 'Cancelled', count: 3, percentage: 3 }
                        ],
                        byCategory: [
                            { category: 'Cars', count: 68, percentage: 54 },
                            { category: 'Trucks', count: 32, percentage: 25 },
                            { category: 'Motorcycles', count: 18, percentage: 14 },
                            { category: 'Watercraft & RV', count: 9, percentage: 7 }
                        ],
                        byTimeOfDay: [
                            { hour: 8, count: 5 },
                            { hour: 9, count: 12 },
                            { hour: 10, count: 18 },
                            { hour: 11, count: 22 },
                            { hour: 12, count: 15 },
                            { hour: 13, count: 20 },
                            { hour: 14, count: 25 },
                            { hour: 15, count: 18 },
                            { hour: 16, count: 12 },
                            { hour: 17, count: 8 }
                        ]
                    },
                    providers: {
                        topPerformers: [
                            { name: 'Elite Auto Detailing', revenue: 3200, bookings: 25, rating: 4.8 },
                            { name: 'Mobile Wash Masters', revenue: 2800, bookings: 22, rating: 4.6 },
                            { name: 'Truck & Fleet Services', revenue: 2500, bookings: 18, rating: 4.9 },
                            { name: 'Quick Clean Services', revenue: 2100, bookings: 15, rating: 4.4 }
                        ],
                        newProviders: [
                            { name: 'Premium Detailing Co', joinDate: '2024-01-15', status: 'pending' },
                            { name: 'Eco Wash Solutions', joinDate: '2024-01-14', status: 'approved' },
                            { name: 'Mobile Car Care', joinDate: '2024-01-13', status: 'approved' }
                        ],
                        byLocation: [
                            { location: 'Anytown', count: 18 },
                            { location: 'Downtown', count: 12 },
                            { location: 'Westside', count: 8 },
                            { location: 'Suburb', count: 7 }
                        ],
                        byCategory: [
                            { category: 'Cars', count: 28 },
                            { category: 'Trucks', count: 12 },
                            { category: 'Motorcycles', count: 8 },
                            { category: 'Watercraft & RV', count: 5 }
                        ]
                    },
                    customers: {
                        newCustomers: [
                            { date: '2024-01-01', count: 3 },
                            { date: '2024-01-02', count: 5 },
                            { date: '2024-01-03', count: 7 },
                            { date: '2024-01-04', count: 4 },
                            { date: '2024-01-05', count: 6 },
                            { date: '2024-01-06', count: 8 },
                            { date: '2024-01-07', count: 5 }
                        ],
                        repeatCustomers: [
                            { percentage: 65, count: 58 },
                            { percentage: 35, count: 31 }
                        ],
                        byLocation: [
                            { location: 'Anytown', count: 45 },
                            { location: 'Downtown', count: 28 },
                            { location: 'Westside', count: 16 }
                        ],
                        satisfaction: [
                            { rating: 5, count: 45 },
                            { rating: 4, count: 32 },
                            { rating: 3, count: 8 },
                            { rating: 2, count: 3 },
                            { rating: 1, count: 1 }
                        ]
                    }
                };

                setAnalyticsData(mockData);
            } catch (err) {
                console.error('Error loading analytics data:', err);
                setError('Failed to load analytics data');
            } finally {
                setIsLoading(false);
            }
        };

        loadAnalyticsData();
    }, [selectedPeriod]);

    const getGrowthIcon = (growth: number) => {
        return growth >= 0 ? (
            <FiTrendingUp className="w-4 h-4 text-green-500" />
        ) : (
            <FiTrendingDown className="w-4 h-4 text-red-500" />
        );
    };

    const getGrowthColor = (growth: number) => {
        return growth >= 0 ? 'text-green-600' : 'text-red-600';
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FiShield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
                    <BoopWrapper>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Go Home
                        </button>
                    </BoopWrapper>
                </div>
            </div>
        );
    }

    if (!analyticsData) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <BoopWrapper>
                            <button
                                onClick={() => router.push('/admin')}
                                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <FiArrowLeft className="w-5 h-5 mr-2" />
                                Back to Dashboard
                            </button>
                        </BoopWrapper>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h1>
                            <p className="text-gray-600">Platform performance and business insights</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <FiFilter className="w-4 h-4 text-gray-500" />
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value as any)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                    <option value="90d">Last 90 Days</option>
                                    <option value="1y">Last Year</option>
                                </select>
                            </div>

                            <BoopWrapper>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    <FiRefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </button>
                            </BoopWrapper>

                            <BoopWrapper>
                                <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                    <FiDownload className="w-4 h-4 mr-2" />
                                    Export Report
                                </button>
                            </BoopWrapper>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                    >
                        <p className="text-red-800">{error}</p>
                    </motion.div>
                )}

                {/* Overview Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FiDollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">${analyticsData.overview.totalRevenue.toLocaleString()}</p>
                                <div className="flex items-center mt-1">
                                    {getGrowthIcon(analyticsData.overview.revenueGrowth)}
                                    <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.overview.revenueGrowth)}`}>
                                        {analyticsData.overview.revenueGrowth}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FiCalendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalBookings}</p>
                                <div className="flex items-center mt-1">
                                    {getGrowthIcon(analyticsData.overview.bookingGrowth)}
                                    <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.overview.bookingGrowth)}`}>
                                        {analyticsData.overview.bookingGrowth}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FiUsers className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Providers</p>
                                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalProviders}</p>
                                <div className="flex items-center mt-1">
                                    {getGrowthIcon(analyticsData.overview.providerGrowth)}
                                    <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.overview.providerGrowth)}`}>
                                        {analyticsData.overview.providerGrowth}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <FiStar className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.averageRating}</p>
                                <div className="flex items-center mt-1">
                                    {getGrowthIcon(analyticsData.overview.ratingGrowth)}
                                    <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.overview.ratingGrowth)}`}>
                                        {analyticsData.overview.ratingGrowth}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Metric Tabs */}
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { key: 'revenue', label: 'Revenue', icon: FiDollarSign },
                                { key: 'bookings', label: 'Bookings', icon: FiCalendar },
                                { key: 'providers', label: 'Providers', icon: FiUsers },
                                { key: 'customers', label: 'Customers', icon: FiBarChart }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <BoopWrapper key={tab.key}>
                                        <button
                                            onClick={() => setSelectedMetric(tab.key as any)}
                                            className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${selectedMetric === tab.key
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4 mr-2" />
                                            {tab.label}
                                        </button>
                                    </BoopWrapper>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Revenue Analytics */}
                        {selectedMetric === 'revenue' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
                                        <div className="space-y-3">
                                            {analyticsData.revenue.byCategory.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-gray-600">{item.category}</span>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-500 h-2 rounded-full"
                                                                style={{ width: `${item.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            ${item.revenue.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Providers</h3>
                                        <div className="space-y-3">
                                            {analyticsData.revenue.byProvider.map((provider, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{provider.provider}</p>
                                                        <p className="text-sm text-gray-600">{provider.bookings} bookings</p>
                                                    </div>
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        ${provider.revenue.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bookings Analytics */}
                        {selectedMetric === 'bookings' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Status</h3>
                                        <div className="space-y-3">
                                            {analyticsData.bookings.byStatus.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-gray-600">{item.status}</span>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full"
                                                                style={{ width: `${item.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {item.count}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Category</h3>
                                        <div className="space-y-3">
                                            {analyticsData.bookings.byCategory.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-gray-600">{item.category}</span>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-purple-500 h-2 rounded-full"
                                                                style={{ width: `${item.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {item.count}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Providers Analytics */}
                        {selectedMetric === 'providers' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Providers</h3>
                                        <div className="space-y-3">
                                            {analyticsData.providers.topPerformers.map((provider, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{provider.name}</p>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="flex items-center">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <FiStar
                                                                        key={i}
                                                                        className={`w-4 h-4 ${i < Math.floor(provider.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-sm text-gray-600">{provider.rating}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">${provider.revenue.toLocaleString()}</p>
                                                        <p className="text-sm text-gray-600">{provider.bookings} bookings</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Providers by Location</h3>
                                        <div className="space-y-3">
                                            {analyticsData.providers.byLocation.map((location, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-gray-600">{location.location}</span>
                                                    <span className="text-sm font-medium text-gray-900">{location.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Customers Analytics */}
                        {selectedMetric === 'customers' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
                                        <div className="space-y-3">
                                            {analyticsData.customers.satisfaction.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-600">{item.rating} stars</span>
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FiStar
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{item.count} customers</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customers by Location</h3>
                                        <div className="space-y-3">
                                            {analyticsData.customers.byLocation.map((location, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-gray-600">{location.location}</span>
                                                    <span className="text-sm font-medium text-gray-900">{location.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-lg shadow p-6"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <BoopWrapper>
                            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <FiDownload className="w-5 h-5 text-blue-600 mr-3" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Export Revenue Report</p>
                                    <p className="text-sm text-gray-600">Download PDF report</p>
                                </div>
                            </button>
                        </BoopWrapper>

                        <BoopWrapper>
                            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <FiBarChart className="w-5 h-5 text-green-600 mr-3" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Generate Insights</p>
                                    <p className="text-sm text-gray-600">AI-powered analysis</p>
                                </div>
                            </button>
                        </BoopWrapper>

                        <BoopWrapper>
                            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <FiEye className="w-5 h-5 text-purple-600 mr-3" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">View Detailed Reports</p>
                                    <p className="text-sm text-gray-600">Advanced analytics</p>
                                </div>
                            </button>
                        </BoopWrapper>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
