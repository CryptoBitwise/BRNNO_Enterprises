"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
    FiArrowLeft,
    FiUsers,
    FiStar,
    FiDollarSign,
    FiCalendar,
    FiTrendingUp,
    FiTrendingDown,
    FiAward,
    FiClock,
    FiMapPin,
    FiBarChart,
    FiDownload,
    FiRefreshCw,
    FiFilter,
    FiShield,
    FiTarget,
    FiCheckCircle,
    FiXCircle
} from "react-icons/fi";
import BoopWrapper from "@/components/ui/BoopWrapper";

interface ProviderAnalyticsData {
    overview: {
        totalProviders: number;
        activeProviders: number;
        pendingProviders: number;
        averageRating: number;
        totalRevenue: number;
        averageBookingsPerProvider: number;
    };
    performance: {
        topPerformers: {
            id: string;
            name: string;
            revenue: number;
            bookings: number;
            rating: number;
            completionRate: number;
            responseTime: number;
            customerSatisfaction: number;
        }[];
        underPerformers: {
            id: string;
            name: string;
            revenue: number;
            bookings: number;
            rating: number;
            issues: string[];
        }[];
        newProviders: {
            id: string;
            name: string;
            joinDate: string;
            status: string;
            firstBooking: string | null;
            revenue: number;
        }[];
    };
    metrics: {
        byCategory: { category: string; count: number; averageRating: number; totalRevenue: number }[];
        byLocation: { location: string; count: number; averageRating: number; totalRevenue: number }[];
        byStatus: { status: string; count: number; percentage: number }[];
        byRating: { rating: number; count: number; percentage: number }[];
    };
    trends: {
        providerGrowth: { month: string; newProviders: number; totalProviders: number }[];
        revenueByProvider: { month: string; totalRevenue: number; averageRevenue: number }[];
        ratingTrends: { month: string; averageRating: number; totalReviews: number }[];
    };
}

export default function ProviderAnalyticsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [analyticsData, setAnalyticsData] = useState<ProviderAnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    const [selectedView, setSelectedView] = useState<'overview' | 'performance' | 'metrics' | 'trends'>('overview');
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
                const mockData: ProviderAnalyticsData = {
                    overview: {
                        totalProviders: 45,
                        activeProviders: 38,
                        pendingProviders: 7,
                        averageRating: 4.7,
                        totalRevenue: 15750,
                        averageBookingsPerProvider: 3.4
                    },
                    performance: {
                        topPerformers: [
                            {
                                id: '1',
                                name: 'Elite Auto Detailing',
                                revenue: 3200,
                                bookings: 25,
                                rating: 4.8,
                                completionRate: 98,
                                responseTime: 2,
                                customerSatisfaction: 95
                            },
                            {
                                id: '2',
                                name: 'Truck & Fleet Services',
                                revenue: 2800,
                                bookings: 22,
                                rating: 4.9,
                                completionRate: 96,
                                responseTime: 3,
                                customerSatisfaction: 97
                            },
                            {
                                id: '3',
                                name: 'Mobile Wash Masters',
                                revenue: 2500,
                                bookings: 20,
                                rating: 4.6,
                                completionRate: 94,
                                responseTime: 1,
                                customerSatisfaction: 92
                            }
                        ],
                        underPerformers: [
                            {
                                id: '4',
                                name: 'Quick Clean Services',
                                revenue: 800,
                                bookings: 5,
                                rating: 3.2,
                                issues: ['Low completion rate', 'Customer complaints', 'Slow response time']
                            },
                            {
                                id: '5',
                                name: 'Budget Auto Wash',
                                revenue: 600,
                                bookings: 4,
                                rating: 2.8,
                                issues: ['Poor quality service', 'Frequent cancellations', 'Low customer satisfaction']
                            }
                        ],
                        newProviders: [
                            {
                                id: '6',
                                name: 'Premium Detailing Co',
                                joinDate: '2024-01-15',
                                status: 'pending',
                                firstBooking: null,
                                revenue: 0
                            },
                            {
                                id: '7',
                                name: 'Eco Wash Solutions',
                                joinDate: '2024-01-14',
                                status: 'approved',
                                firstBooking: '2024-01-16',
                                revenue: 450
                            },
                            {
                                id: '8',
                                name: 'Mobile Car Care',
                                joinDate: '2024-01-13',
                                status: 'approved',
                                firstBooking: '2024-01-15',
                                revenue: 320
                            }
                        ]
                    },
                    metrics: {
                        byCategory: [
                            { category: 'Cars', count: 28, averageRating: 4.6, totalRevenue: 8500 },
                            { category: 'Trucks', count: 12, averageRating: 4.8, totalRevenue: 4200 },
                            { category: 'Motorcycles', count: 8, averageRating: 4.4, totalRevenue: 2100 },
                            { category: 'Watercraft & RV', count: 5, averageRating: 4.9, totalRevenue: 950 }
                        ],
                        byLocation: [
                            { location: 'Anytown', count: 18, averageRating: 4.7, totalRevenue: 8500 },
                            { location: 'Downtown', count: 12, averageRating: 4.6, totalRevenue: 4200 },
                            { location: 'Westside', count: 8, averageRating: 4.8, totalRevenue: 2100 },
                            { location: 'Suburb', count: 7, averageRating: 4.5, totalRevenue: 950 }
                        ],
                        byStatus: [
                            { status: 'Active', count: 38, percentage: 84 },
                            { status: 'Pending', count: 7, percentage: 16 }
                        ],
                        byRating: [
                            { rating: 5, count: 15, percentage: 33 },
                            { rating: 4, count: 18, percentage: 40 },
                            { rating: 3, count: 8, percentage: 18 },
                            { rating: 2, count: 3, percentage: 7 },
                            { rating: 1, count: 1, percentage: 2 }
                        ]
                    },
                    trends: {
                        providerGrowth: [
                            { month: 'Jan', newProviders: 8, totalProviders: 45 },
                            { month: 'Feb', newProviders: 6, totalProviders: 39 },
                            { month: 'Mar', newProviders: 10, totalProviders: 33 },
                            { month: 'Apr', newProviders: 7, totalProviders: 23 },
                            { month: 'May', newProviders: 5, totalProviders: 16 },
                            { month: 'Jun', newProviders: 9, totalProviders: 11 }
                        ],
                        revenueByProvider: [
                            { month: 'Jan', totalRevenue: 3200, averageRevenue: 71 },
                            { month: 'Feb', totalRevenue: 2800, averageRevenue: 72 },
                            { month: 'Mar', totalRevenue: 3500, averageRevenue: 76 },
                            { month: 'Apr', totalRevenue: 4100, averageRevenue: 82 },
                            { month: 'May', totalRevenue: 3800, averageRevenue: 84 },
                            { month: 'Jun', totalRevenue: 4500, averageRevenue: 88 }
                        ],
                        ratingTrends: [
                            { month: 'Jan', averageRating: 4.5, totalReviews: 45 },
                            { month: 'Feb', averageRating: 4.6, totalReviews: 52 },
                            { month: 'Mar', averageRating: 4.7, totalReviews: 61 },
                            { month: 'Apr', averageRating: 4.7, totalReviews: 73 },
                            { month: 'May', averageRating: 4.8, totalReviews: 89 },
                            { month: 'Jun', averageRating: 4.7, totalReviews: 127 }
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

    const getGrowthIcon = (value: number, threshold: number = 0) => {
        return value >= threshold ? (
            <FiTrendingUp className="w-4 h-4 text-green-500" />
        ) : (
            <FiTrendingDown className="w-4 h-4 text-red-500" />
        );
    };

    const getGrowthColor = (value: number, threshold: number = 0) => {
        return value >= threshold ? 'text-green-600' : 'text-red-600';
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading provider analytics...</p>
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
                                onClick={() => router.push('/admin/analytics')}
                                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <FiArrowLeft className="w-5 h-5 mr-2" />
                                Back to Analytics
                            </button>
                        </BoopWrapper>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Provider Analytics</h1>
                            <p className="text-gray-600">Provider performance and insights</p>
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

                {/* View Tabs */}
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { key: 'overview', label: 'Overview', icon: FiBarChart },
                                { key: 'performance', label: 'Performance', icon: FiAward },
                                { key: 'metrics', label: 'Metrics', icon: FiTarget },
                                { key: 'trends', label: 'Trends', icon: FiTrendingUp }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <BoopWrapper key={tab.key}>
                                        <button
                                            onClick={() => setSelectedView(tab.key as any)}
                                            className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${selectedView === tab.key
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
                        {/* Overview Tab */}
                        {selectedView === 'overview' && (
                            <div className="space-y-8">
                                {/* Key Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white"
                                    >
                                        <div className="flex items-center">
                                            <FiUsers className="w-8 h-8 mr-4" />
                                            <div>
                                                <p className="text-blue-100 text-sm">Total Providers</p>
                                                <p className="text-2xl font-bold">{analyticsData.overview.totalProviders}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white"
                                    >
                                        <div className="flex items-center">
                                            <FiCheckCircle className="w-8 h-8 mr-4" />
                                            <div>
                                                <p className="text-green-100 text-sm">Active Providers</p>
                                                <p className="text-2xl font-bold">{analyticsData.overview.activeProviders}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white"
                                    >
                                        <div className="flex items-center">
                                            <FiClock className="w-8 h-8 mr-4" />
                                            <div>
                                                <p className="text-yellow-100 text-sm">Pending Approval</p>
                                                <p className="text-2xl font-bold">{analyticsData.overview.pendingProviders}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white"
                                    >
                                        <div className="flex items-center">
                                            <FiStar className="w-8 h-8 mr-4" />
                                            <div>
                                                <p className="text-purple-100 text-sm">Average Rating</p>
                                                <p className="text-2xl font-bold">{analyticsData.overview.averageRating}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Additional Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                                <p className="text-2xl font-bold text-gray-900">${analyticsData.overview.totalRevenue.toLocaleString()}</p>
                                            </div>
                                            <FiDollarSign className="w-6 h-6 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Avg Bookings/Provider</p>
                                                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.averageBookingsPerProvider}</p>
                                            </div>
                                            <FiCalendar className="w-6 h-6 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Active Rate</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {Math.round((analyticsData.overview.activeProviders / analyticsData.overview.totalProviders) * 100)}%
                                                </p>
                                            </div>
                                            <FiTarget className="w-6 h-6 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Performance Tab */}
                        {selectedView === 'performance' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                                        <div className="space-y-4">
                                            {analyticsData.performance.topPerformers.map((provider, index) => (
                                                <div key={provider.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-medium text-gray-900">{provider.name}</h4>
                                                        <div className="flex items-center">
                                                            <FiStar className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                            <span className="text-sm font-medium text-gray-900">{provider.rating}</span>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-gray-600">Revenue: <span className="font-medium">${provider.revenue.toLocaleString()}</span></p>
                                                            <p className="text-gray-600">Bookings: <span className="font-medium">{provider.bookings}</span></p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-600">Completion: <span className="font-medium">{provider.completionRate}%</span></p>
                                                            <p className="text-gray-600">Response: <span className="font-medium">{provider.responseTime}h</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Under Performers</h3>
                                        <div className="space-y-4">
                                            {analyticsData.performance.underPerformers.map((provider, index) => (
                                                <div key={provider.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-medium text-gray-900">{provider.name}</h4>
                                                        <div className="flex items-center">
                                                            <FiStar className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                            <span className="text-sm font-medium text-gray-900">{provider.rating}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mb-2">
                                                        <p className="text-gray-600 text-sm">Revenue: <span className="font-medium">${provider.revenue.toLocaleString()}</span></p>
                                                        <p className="text-gray-600 text-sm">Bookings: <span className="font-medium">{provider.bookings}</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-red-800 mb-1">Issues:</p>
                                                        <ul className="text-sm text-red-700">
                                                            {provider.issues.map((issue, idx) => (
                                                                <li key={idx} className="flex items-center">
                                                                    <FiXCircle className="w-3 h-3 mr-1" />
                                                                    {issue}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">New Providers</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {analyticsData.performance.newProviders.map((provider, index) => (
                                            <div key={provider.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <h4 className="font-medium text-gray-900 mb-2">{provider.name}</h4>
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <p>Joined: {new Date(provider.joinDate).toLocaleDateString()}</p>
                                                    <p>Status: <span className={`font-medium ${provider.status === 'approved' ? 'text-green-600' : 'text-yellow-600'
                                                        }`}>{provider.status}</span></p>
                                                    {provider.firstBooking && (
                                                        <p>First Booking: {new Date(provider.firstBooking).toLocaleDateString()}</p>
                                                    )}
                                                    <p>Revenue: <span className="font-medium">${provider.revenue.toLocaleString()}</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Metrics Tab */}
                        {selectedView === 'metrics' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Providers by Category</h3>
                                        <div className="space-y-3">
                                            {analyticsData.metrics.byCategory.map((category, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{category.category}</p>
                                                        <p className="text-sm text-gray-600">{category.count} providers</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900">${category.totalRevenue.toLocaleString()}</p>
                                                        <div className="flex items-center">
                                                            <FiStar className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                                            <span className="text-sm text-gray-600">{category.averageRating}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Providers by Location</h3>
                                        <div className="space-y-3">
                                            {analyticsData.metrics.byLocation.map((location, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{location.location}</p>
                                                        <p className="text-sm text-gray-600">{location.count} providers</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900">${location.totalRevenue.toLocaleString()}</p>
                                                        <div className="flex items-center">
                                                            <FiStar className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                                            <span className="text-sm text-gray-600">{location.averageRating}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Status Distribution</h3>
                                        <div className="space-y-3">
                                            {analyticsData.metrics.byStatus.map((status, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-gray-600">{status.status}</span>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-500 h-2 rounded-full"
                                                                style={{ width: `${status.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{status.count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                                        <div className="space-y-3">
                                            {analyticsData.metrics.byRating.map((rating, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-600">{rating.rating} stars</span>
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FiStar
                                                                    key={i}
                                                                    className={`w-3 h-3 ${i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-yellow-500 h-2 rounded-full"
                                                                style={{ width: `${rating.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{rating.count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Trends Tab */}
                        {selectedView === 'trends' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Growth Trend</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="space-y-3">
                                                {analyticsData.trends.providerGrowth.map((month, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">{month.month}</span>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-500 h-2 rounded-full"
                                                                    style={{ width: `${(month.totalProviders / 50) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900">{month.totalProviders}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Revenue per Provider</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="space-y-3">
                                                {analyticsData.trends.revenueByProvider.map((month, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">{month.month}</span>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-green-500 h-2 rounded-full"
                                                                    style={{ width: `${(month.averageRevenue / 100) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900">${month.averageRevenue}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
