"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
    FiUsers,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiDollarSign,
    FiCalendar,
    FiTrendingUp,
    FiAlertTriangle,
    FiShield,
    FiBarChart,
    FiSettings,
    FiArrowRight,
    FiRefreshCw
} from "react-icons/fi";
import { ProviderProfile } from "@/types/provider";
import { ProviderService as ProviderServiceClass } from "@/lib/providerService";
import BoopWrapper from "@/components/ui/BoopWrapper";

interface AdminStats {
    totalProviders: number;
    pendingProviders: number;
    approvedProviders: number;
    rejectedProviders: number;
    totalBookings: number;
    totalRevenue: number;
    monthlyRevenue: number;
    averageRating: number;
    totalCustomers: number;
    activeBookings: number;
}

export default function AdminDashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [recentProviders, setRecentProviders] = useState<ProviderProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is admin (in production, this would check user roles)
    const isAdmin = user?.email === 'admin@brnno.com' || user?.uid === 'admin';

    // Redirect if not authenticated or not admin
    if (!loading && (!user || !isAdmin)) {
        router.push('/');
        return null;
    }

    // Load admin data
    useEffect(() => {
        const loadAdminData = async () => {
            try {
                setIsLoading(true);

                // Mock admin stats - in production, this would come from an API
                const mockStats: AdminStats = {
                    totalProviders: 45,
                    pendingProviders: 8,
                    approvedProviders: 32,
                    rejectedProviders: 5,
                    totalBookings: 127,
                    totalRevenue: 15750,
                    monthlyRevenue: 3200,
                    averageRating: 4.7,
                    totalCustomers: 89,
                    activeBookings: 23
                };

                const mockRecentProviders: ProviderProfile[] = [
                    {
                        id: '1',
                        businessName: 'Elite Auto Detailing',
                        contactPerson: 'Mike Johnson',
                        email: 'mike@eliteauto.com',
                        phone: '(555) 123-4567',
                        address: '123 Main St',
                        city: 'Anytown',
                        state: 'CA',
                        zipCode: '12345',
                        businessDescription: 'Premium auto detailing services',
                        yearsInBusiness: 5,
                        serviceCategories: ['cars', 'trucks'],
                        mobileService: true,
                        serviceRadius: 25,
                        hourlyRate: 75,
                        flatRateMin: 50,
                        flatRateMax: 200,
                        paymentMethods: ['credit_card', 'cash'],
                        status: 'approved',
                        createdAt: new Date('2024-01-10'),
                        updatedAt: new Date(),
                        availability: {},
                        documents: {},
                        averageRating: 4.8,
                        reviewCount: 127,
                        responseTime: 2,
                        totalReviews: 127,
                        verificationStatus: 'verified',
                        businessType: 'LLC',
                        serviceAreas: ['Anytown', 'Nearby City'],
                        serviceRadius: 25
                    },
                    {
                        id: '2',
                        businessName: 'Mobile Wash Masters',
                        contactPerson: 'Sarah Williams',
                        email: 'sarah@mobilewash.com',
                        phone: '(555) 987-6543',
                        address: '456 Oak Ave',
                        city: 'Anytown',
                        state: 'CA',
                        zipCode: '12345',
                        businessDescription: 'Professional mobile car wash services',
                        yearsInBusiness: 3,
                        serviceCategories: ['cars', 'motorcycles'],
                        mobileService: true,
                        serviceRadius: 30,
                        hourlyRate: 60,
                        flatRateMin: 40,
                        flatRateMax: 150,
                        paymentMethods: ['credit_card', 'cash'],
                        status: 'pending',
                        createdAt: new Date('2024-01-12'),
                        updatedAt: new Date(),
                        availability: {},
                        documents: {},
                        averageRating: 0,
                        reviewCount: 0,
                        responseTime: 0,
                        totalReviews: 0,
                        verificationStatus: 'pending',
                        businessType: 'Sole Proprietorship',
                        serviceAreas: ['Anytown', 'Downtown'],
                        serviceRadius: 30
                    }
                ];

                setStats(mockStats);
                setRecentProviders(mockRecentProviders);
            } catch (err) {
                console.error('Error loading admin data:', err);
                setError('Failed to load admin data');
            } finally {
                setIsLoading(false);
            }
        };

        loadAdminData();
    }, []);

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin dashboard...</p>
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600">Manage your BRNNO marketplace</p>
                        </div>

                        <div className="flex items-center space-x-4">
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
                                <button
                                    onClick={() => router.push('/admin/settings')}
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
                                <FiUsers className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Providers</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.totalProviders || 0}</p>
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
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <FiClock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.pendingProviders || 0}</p>
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
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FiDollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">${stats?.monthlyRevenue || 0}</p>
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
                                <FiCalendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.activeBookings || 0}</p>
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
                                onClick={() => router.push('/admin/providers')}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FiUsers className="w-5 h-5 text-blue-600 mr-3" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Manage Providers</p>
                                    <p className="text-sm text-gray-600">Review and approve applications</p>
                                </div>
                                <FiArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                            </button>
                        </BoopWrapper>

                        <BoopWrapper>
                            <button
                                onClick={() => router.push('/admin/bookings')}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FiCalendar className="w-5 h-5 text-green-600 mr-3" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">View Bookings</p>
                                    <p className="text-sm text-gray-600">Monitor all platform bookings</p>
                                </div>
                                <FiArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                            </button>
                        </BoopWrapper>

                        <BoopWrapper>
                            <button
                                onClick={() => router.push('/admin/analytics')}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FiBarChart className="w-5 h-5 text-purple-600 mr-3" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Analytics</p>
                                    <p className="text-sm text-gray-600">View platform performance</p>
                                </div>
                                <FiArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                            </button>
                        </BoopWrapper>
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Providers */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Provider Applications</h2>
                        <div className="space-y-4">
                            {recentProviders.map((provider, index) => (
                                <div key={provider.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{provider.businessName}</h3>
                                        <p className="text-sm text-gray-600">{provider.contactPerson} • {provider.city}, {provider.state}</p>
                                        <p className="text-xs text-gray-500">
                                            Applied {new Date(provider.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${provider.verificationStatus === 'verified'
                                            ? 'bg-green-100 text-green-800'
                                            : provider.verificationStatus === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {provider.verificationStatus}
                                        </span>
                                        <BoopWrapper>
                                            <button
                                                onClick={() => router.push(`/admin/providers/${provider.id}`)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Review
                                            </button>
                                        </BoopWrapper>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <BoopWrapper>
                                <button
                                    onClick={() => router.push('/admin/providers')}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    View All Providers
                                </button>
                            </BoopWrapper>
                        </div>
                    </motion.div>

                    {/* Platform Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Bookings</span>
                                <span className="font-medium">{stats?.totalBookings || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Revenue</span>
                                <span className="font-medium">${stats?.totalRevenue || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Average Rating</span>
                                <span className="font-medium">{stats?.averageRating || 0}/5.0</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Customers</span>
                                <span className="font-medium">{stats?.totalCustomers || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Approved Providers</span>
                                <span className="font-medium text-green-600">{stats?.approvedProviders || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Pending Approval</span>
                                <span className="font-medium text-yellow-600">{stats?.pendingProviders || 0}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Alerts */}
                {stats && stats.pendingProviders > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6"
                    >
                        <div className="flex items-center">
                            <FiAlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                            <div>
                                <h3 className="font-medium text-yellow-800">Pending Provider Approvals</h3>
                                <p className="text-yellow-700">
                                    You have {stats.pendingProviders} provider applications waiting for review.
                                </p>
                            </div>
                            <div className="ml-auto">
                                <BoopWrapper>
                                    <button
                                        onClick={() => router.push('/admin/providers?filter=pending')}
                                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                                    >
                                        Review Now
                                    </button>
                                </BoopWrapper>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}