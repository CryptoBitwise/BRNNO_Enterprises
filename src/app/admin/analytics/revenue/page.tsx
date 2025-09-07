"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
    FiArrowLeft,
    FiDollarSign,
    FiTrendingUp,
    FiTrendingDown,
    FiCalendar,
    FiUsers,
    FiBarChart,
    FiPieChart,
    FiDownload,
    FiRefreshCw,
    FiFilter,
    FiShield,
    FiTarget,
    FiAward,
    FiClock
} from "react-icons/fi";
import BoopWrapper from "@/components/ui/BoopWrapper";

interface RevenueData {
    summary: {
        totalRevenue: number;
        monthlyRevenue: number;
        dailyAverage: number;
        growthRate: number;
        commissionEarned: number;
        providerPayouts: number;
    };
    trends: {
        daily: { date: string; revenue: number; bookings: number }[];
        weekly: { week: string; revenue: number; bookings: number }[];
        monthly: { month: string; revenue: number; bookings: number }[];
    };
    breakdown: {
        byCategory: { category: string; revenue: number; percentage: number; growth: number }[];
        byProvider: { provider: string; revenue: number; bookings: number; commission: number }[];
        byLocation: { location: string; revenue: number; percentage: number }[];
        byTimeOfDay: { hour: number; revenue: number; bookings: number }[];
    };
    projections: {
        nextMonth: number;
        nextQuarter: number;
        nextYear: number;
        confidence: number;
    };
}

export default function RevenueAnalyticsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    const [selectedView, setSelectedView] = useState<'overview' | 'trends' | 'breakdown' | 'projections'>('overview');
    const [error, setError] = useState<string | null>(null);

    // Check if user is admin
    const isAdmin = user?.email === 'admin@brnno.com' || user?.uid === 'admin';

    // Redirect if not authenticated or not admin
    if (!loading && (!user || !isAdmin)) {
        router.push('/');
        return null;
    }

    // Load revenue data
    useEffect(() => {
        const loadRevenueData = async () => {
            try {
                setIsLoading(true);

                // Mock revenue data - in production, this would come from an API
                const mockData: RevenueData = {
                    summary: {
                        totalRevenue: 15750,
                        monthlyRevenue: 3200,
                        dailyAverage: 106.67,
                        growthRate: 12.5,
                        commissionEarned: 1575,
                        providerPayouts: 14175
                    },
                    trends: {
                        daily: [
                            { date: '2024-01-01', revenue: 120, bookings: 3 },
                            { date: '2024-01-02', revenue: 150, bookings: 5 },
                            { date: '2024-01-03', revenue: 180, bookings: 7 },
                            { date: '2024-01-04', revenue: 200, bookings: 8 },
                            { date: '2024-01-05', revenue: 160, bookings: 6 },
                            { date: '2024-01-06', revenue: 220, bookings: 9 },
                            { date: '2024-01-07', revenue: 190, bookings: 7 }
                        ],
                        weekly: [
                            { week: 'Week 1', revenue: 1050, bookings: 35 },
                            { week: 'Week 2', revenue: 1200, bookings: 42 },
                            { week: 'Week 3', revenue: 1350, bookings: 38 },
                            { week: 'Week 4', revenue: 1400, bookings: 45 }
                        ],
                        monthly: [
                            { month: 'Jan', revenue: 3200, bookings: 127 },
                            { month: 'Feb', revenue: 2800, bookings: 98 },
                            { month: 'Mar', revenue: 3500, bookings: 142 },
                            { month: 'Apr', revenue: 4100, bookings: 168 },
                            { month: 'May', revenue: 3800, bookings: 156 },
                            { month: 'Jun', revenue: 4500, bookings: 189 }
                        ]
                    },
                    breakdown: {
                        byCategory: [
                            { category: 'Cars', revenue: 8500, percentage: 54, growth: 15.2 },
                            { category: 'Trucks', revenue: 4200, percentage: 27, growth: 8.7 },
                            { category: 'Motorcycles', revenue: 2100, percentage: 13, growth: 22.1 },
                            { category: 'Watercraft & RV', revenue: 950, percentage: 6, growth: 5.3 }
                        ],
                        byProvider: [
                            { provider: 'Elite Auto Detailing', revenue: 3200, bookings: 25, commission: 320 },
                            { provider: 'Mobile Wash Masters', revenue: 2800, bookings: 22, commission: 280 },
                            { provider: 'Truck & Fleet Services', revenue: 2500, bookings: 18, commission: 250 },
                            { provider: 'Quick Clean Services', revenue: 2100, bookings: 15, commission: 210 },
                            { provider: 'Premium Detailing Co', revenue: 1800, bookings: 12, commission: 180 }
                        ],
                        byLocation: [
                            { location: 'Anytown', revenue: 8500, percentage: 54 },
                            { location: 'Downtown', revenue: 4200, percentage: 27 },
                            { location: 'Westside', revenue: 2100, percentage: 13 },
                            { location: 'Suburb', revenue: 950, percentage: 6 }
                        ],
                        byTimeOfDay: [
                            { hour: 8, revenue: 450, bookings: 5 },
                            { hour: 9, revenue: 1200, bookings: 12 },
                            { hour: 10, revenue: 1800, bookings: 18 },
                            { hour: 11, revenue: 2200, bookings: 22 },
                            { hour: 12, revenue: 1500, bookings: 15 },
                            { hour: 13, revenue: 2000, bookings: 20 },
                            { hour: 14, revenue: 2500, bookings: 25 },
                            { hour: 15, revenue: 1800, bookings: 18 },
                            { hour: 16, revenue: 1200, bookings: 12 },
                            { hour: 17, revenue: 800, bookings: 8 }
                        ]
                    },
                    projections: {
                        nextMonth: 3600,
                        nextQuarter: 11200,
                        nextYear: 45600,
                        confidence: 85
                    }
                };

                setRevenueData(mockData);
            } catch (err) {
                console.error('Error loading revenue data:', err);
                setError('Failed to load revenue data');
            } finally {
                setIsLoading(false);
            }
        };

        loadRevenueData();
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
                    <p className="text-gray-600">Loading revenue analytics...</p>
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

    if (!revenueData) return null;

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
                            <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
                            <p className="text-gray-600">Detailed financial performance and insights</p>
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
                                { key: 'trends', label: 'Trends', icon: FiTrendingUp },
                                { key: 'breakdown', label: 'Breakdown', icon: FiPieChart },
                                { key: 'projections', label: 'Projections', icon: FiTarget }
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
                                        className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white"
                                    >
                                        <div className="flex items-center">
                                            <FiDollarSign className="w-8 h-8 mr-4" />
                                            <div>
                                                <p className="text-green-100 text-sm">Total Revenue</p>
                                                <p className="text-2xl font-bold">${revenueData.summary.totalRevenue.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white"
                                    >
                                        <div className="flex items-center">
                                            <FiCalendar className="w-8 h-8 mr-4" />
                                            <div>
                                                <p className="text-blue-100 text-sm">Monthly Revenue</p>
                                                <p className="text-2xl font-bold">${revenueData.summary.monthlyRevenue.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white"
                                    >
                                        <div className="flex items-center">
                                            <FiAward className="w-8 h-8 mr-4" />
                                            <div>
                                                <p className="text-purple-100 text-sm">Commission Earned</p>
                                                <p className="text-2xl font-bold">${revenueData.summary.commissionEarned.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white"
                                    >
                                        <div className="flex items-center">
                                            <FiUsers className="w-8 h-8 mr-4" />
                                            <div>
                                                <p className="text-yellow-100 text-sm">Provider Payouts</p>
                                                <p className="text-2xl font-bold">${revenueData.summary.providerPayouts.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Growth Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                                                <p className="text-2xl font-bold text-gray-900">{revenueData.summary.growthRate}%</p>
                                            </div>
                                            <div className="flex items-center">
                                                {getGrowthIcon(revenueData.summary.growthRate)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Daily Average</p>
                                                <p className="text-2xl font-bold text-gray-900">${revenueData.summary.dailyAverage}</p>
                                            </div>
                                            <FiClock className="w-6 h-6 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Commission Rate</p>
                                                <p className="text-2xl font-bold text-gray-900">10%</p>
                                            </div>
                                            <FiTarget className="w-6 h-6 text-gray-400" />
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
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue Trend</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="space-y-3">
                                                {revenueData.trends.daily.map((day, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">{day.date}</span>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-500 h-2 rounded-full"
                                                                    style={{ width: `${(day.revenue / 250) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900">${day.revenue}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="space-y-3">
                                                {revenueData.trends.monthly.map((month, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">{month.month}</span>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-green-500 h-2 rounded-full"
                                                                    style={{ width: `${(month.revenue / 5000) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900">${month.revenue.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Breakdown Tab */}
                        {selectedView === 'breakdown' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
                                        <div className="space-y-4">
                                            {revenueData.breakdown.byCategory.map((category, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{category.category}</p>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span className="text-sm text-gray-600">{category.percentage}%</span>
                                                            <div className="flex items-center">
                                                                {getGrowthIcon(category.growth)}
                                                                <span className={`text-sm font-medium ml-1 ${getGrowthColor(category.growth)}`}>
                                                                    {category.growth}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        ${category.revenue.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Providers by Revenue</h3>
                                        <div className="space-y-4">
                                            {revenueData.breakdown.byProvider.map((provider, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{provider.provider}</p>
                                                        <p className="text-sm text-gray-600">{provider.bookings} bookings</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-gray-900">
                                                            ${provider.revenue.toLocaleString()}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Commission: ${provider.commission}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Projections Tab */}
                        {selectedView === 'projections' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                                        <div className="flex items-center">
                                            <FiCalendar className="w-8 h-8 mr-4" />
                                            <div>
                                                <p className="text-blue-100 text-sm">Next Month</p>
                                                <p className="text-2xl font-bold">${revenueData.projections.nextMonth.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                                        <div className="flex items-center">
                                            <FiTarget className="w-8 h-8 mr-4" />
                                            <div>
                                                <p className="text-green-100 text-sm">Next Quarter</p>
                                                <p className="text-2xl font-bold">${revenueData.projections.nextQuarter.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                                        <div className="flex items-center">
                                            <FiAward className="w-8 h-8 mr-4" />
                                            <div>
                                                <p className="text-purple-100 text-sm">Next Year</p>
                                                <p className="text-2xl font-bold">${revenueData.projections.nextYear.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Projection Confidence</h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                                            <div
                                                className="bg-blue-500 h-4 rounded-full"
                                                style={{ width: `${revenueData.projections.confidence}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {revenueData.projections.confidence}% confidence
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Based on historical data and current trends
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
