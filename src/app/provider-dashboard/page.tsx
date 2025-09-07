"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
    FiCalendar,
    FiDollarSign,
    FiStar,
    FiUsers,
    FiSettings,
    FiPlus,
    FiTrendingUp,
    FiClock,
    FiCheckCircle,
    FiAlertCircle,
    FiArrowRight
} from "react-icons/fi";
import { ProviderProfile, ProviderDashboardStats } from "@/types/provider";
import { ProviderService } from "@/lib/providerService";
import BoopWrapper from "@/components/ui/BoopWrapper";

export default function ProviderDashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [provider, setProvider] = useState<ProviderProfile | null>(null);
    const [stats, setStats] = useState<ProviderDashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not authenticated
    if (!loading && !user) {
        router.push('/signin');
        return null;
    }

    // Show loading while checking auth
    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Load provider data
    useEffect(() => {
        const loadProviderData = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                const providerData = await ProviderService.getProvider(user.uid);

                if (!providerData) {
                    // Provider doesn't exist, redirect to registration
                    router.push('/provider-register');
                    return;
                }

                setProvider(providerData);

                // Load dashboard stats
                const statsData = await ProviderService.getProviderStats(user.uid);
                setStats(statsData);
            } catch (err) {
                console.error('Error loading provider data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        loadProviderData();
    }, [user, router]);

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <BoopWrapper>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </BoopWrapper>
                </div>
            </div>
        );
    }

    if (!provider) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            case 'suspended': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified': return <FiCheckCircle className="w-4 h-4" />;
            case 'pending': return <FiClock className="w-4 h-4" />;
            case 'rejected': return <FiAlertCircle className="w-4 h-4" />;
            case 'suspended': return <FiAlertCircle className="w-4 h-4" />;
            default: return <FiClock className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
                            <p className="text-gray-600">Welcome back, {provider.contactPerson}</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(provider.verificationStatus)}`}>
                                {getStatusIcon(provider.verificationStatus)}
                                <span className="capitalize">{provider.verificationStatus}</span>
                            </div>

                            <BoopWrapper>
                                <button
                                    onClick={() => router.push('/provider-dashboard/settings')}
                                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    <FiSettings className="w-4 h-4 mr-2" />
                                    Settings
                                </button>
                            </BoopWrapper>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FiCalendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
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
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FiDollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-900">${stats?.totalEarnings || 0}</p>
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
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <FiStar className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                                <p className="text-2xl font-bold text-gray-900">{provider.rating.toFixed(1)}</p>
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
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FiUsers className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Reviews</p>
                                <p className="text-2xl font-bold text-gray-900">{provider.totalReviews}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-lg shadow p-6 mb-8"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <BoopWrapper>
                            <button
                                onClick={() => router.push('/provider-dashboard/services')}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FiPlus className="w-5 h-5 text-blue-600 mr-3" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Manage Services</p>
                                    <p className="text-sm text-gray-600">Add or edit your services</p>
                                </div>
                                <FiArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                            </button>
                        </BoopWrapper>

                        <BoopWrapper>
                            <button
                                onClick={() => router.push('/provider-dashboard/bookings')}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FiCalendar className="w-5 h-5 text-green-600 mr-3" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">View Bookings</p>
                                    <p className="text-sm text-gray-600">Manage your appointments</p>
                                </div>
                                <FiArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                            </button>
                        </BoopWrapper>

                        <BoopWrapper>
                            <button
                                onClick={() => router.push('/provider-dashboard/availability')}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FiClock className="w-5 h-5 text-purple-600 mr-3" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Set Availability</p>
                                    <p className="text-sm text-gray-600">Update your schedule</p>
                                </div>
                                <FiArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                            </button>
                        </BoopWrapper>
                    </div>
                </motion.div>

                {/* Recent Activity & Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Bookings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
                        <div className="space-y-4">
                            {stats && stats.upcomingBookings > 0 ? (
                                <div className="text-center py-8">
                                    <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">You have {stats.upcomingBookings} upcoming bookings</p>
                                    <BoopWrapper>
                                        <button
                                            onClick={() => router.push('/provider-dashboard/bookings')}
                                            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            View All Bookings
                                        </button>
                                    </BoopWrapper>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No recent bookings</p>
                                    <p className="text-sm text-gray-500">Bookings will appear here once customers start booking your services</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Performance Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Response Time</span>
                                <span className="font-medium">{provider.responseTime}h avg</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Completion Rate</span>
                                <span className="font-medium">
                                    {stats && stats.totalBookings > 0
                                        ? Math.round((stats.completedBookings / stats.totalBookings) * 100)
                                        : 0}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">This Month</span>
                                <span className="font-medium text-green-600">${stats?.thisMonthEarnings || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.verificationStatus)}`}>
                                    {provider.verificationStatus}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Business Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white rounded-lg shadow p-6 mt-8"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">Business Details</h3>
                            <p className="text-gray-600 mb-1"><strong>Name:</strong> {provider.businessName}</p>
                            <p className="text-gray-600 mb-1"><strong>Type:</strong> {provider.businessType}</p>
                            <p className="text-gray-600 mb-1"><strong>Contact:</strong> {provider.contactPerson}</p>
                            <p className="text-gray-600 mb-1"><strong>Email:</strong> {provider.email}</p>
                            <p className="text-gray-600 mb-1"><strong>Phone:</strong> {provider.phone}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">Service Areas</h3>
                            <div className="flex flex-wrap gap-2">
                                {provider.serviceAreas.map((area, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {area}
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-600 mt-2">
                                <strong>Service Radius:</strong> {provider.serviceRadius} miles
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
