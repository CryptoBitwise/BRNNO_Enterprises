"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiMapPin,
    FiUser,
    FiPhone,
    FiMail,
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiFilter
} from "react-icons/fi";
import { ProviderProfile } from "@/types/provider";
import { ProviderService as ProviderServiceClass } from "@/lib/providerService";
import BoopWrapper from "@/components/ui/BoopWrapper";

interface Booking {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceName: string;
    servicePrice: number;
    scheduledDate: string;
    scheduledTime: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    address: string;
    notes?: string;
    createdAt: string;
}

export default function ProviderBookingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [provider, setProvider] = useState<ProviderProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'>('all');
    const [error, setError] = useState<string | null>(null);

    // Redirect if not authenticated
    if (!loading && !user) {
        router.push('/signin');
        return null;
    }

    // Load provider and bookings data
    useEffect(() => {
        const loadData = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                const providerData = await ProviderServiceClass.getProvider(user.uid);

                if (!providerData) {
                    router.push('/provider-register');
                    return;
                }

                setProvider(providerData);

                // Mock bookings data - in production, this would come from a bookings API
                const mockBookings: Booking[] = [
                    {
                        id: '1',
                        customerName: 'John Smith',
                        customerEmail: 'john@example.com',
                        customerPhone: '(555) 123-4567',
                        serviceName: 'Premium Car Detailing',
                        servicePrice: 150,
                        scheduledDate: '2024-01-15',
                        scheduledTime: '10:00',
                        status: 'confirmed',
                        address: '123 Main St, Anytown, ST 12345',
                        notes: 'Please use eco-friendly products',
                        createdAt: '2024-01-10T10:00:00Z'
                    },
                    {
                        id: '2',
                        customerName: 'Sarah Johnson',
                        customerEmail: 'sarah@example.com',
                        customerPhone: '(555) 987-6543',
                        serviceName: 'Truck Wash & Wax',
                        servicePrice: 200,
                        scheduledDate: '2024-01-16',
                        scheduledTime: '14:00',
                        status: 'pending',
                        address: '456 Oak Ave, Anytown, ST 12345',
                        createdAt: '2024-01-11T14:30:00Z'
                    },
                    {
                        id: '3',
                        customerName: 'Mike Wilson',
                        customerEmail: 'mike@example.com',
                        customerPhone: '(555) 456-7890',
                        serviceName: 'Motorcycle Detail',
                        servicePrice: 80,
                        scheduledDate: '2024-01-12',
                        scheduledTime: '09:00',
                        status: 'completed',
                        address: '789 Pine Rd, Anytown, ST 12345',
                        createdAt: '2024-01-08T16:20:00Z'
                    }
                ];

                setBookings(mockBookings);
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load bookings');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user, router]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'confirmed': return 'text-blue-600 bg-blue-100';
            case 'in_progress': return 'text-purple-600 bg-purple-100';
            case 'completed': return 'text-green-600 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <FiClock className="w-4 h-4" />;
            case 'confirmed': return <FiCheckCircle className="w-4 h-4" />;
            case 'in_progress': return <FiAlertCircle className="w-4 h-4" />;
            case 'completed': return <FiCheckCircle className="w-4 h-4" />;
            case 'cancelled': return <FiXCircle className="w-4 h-4" />;
            default: return <FiClock className="w-4 h-4" />;
        }
    };

    const filteredBookings = bookings.filter(booking =>
        filter === 'all' || booking.status === filter
    );

    // Show loading while checking auth
    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading bookings...</p>
                </div>
            </div>
        );
    }

    if (!provider) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <BoopWrapper>
                                <button
                                    onClick={() => router.push('/provider-dashboard')}
                                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    <FiArrowLeft className="w-5 h-5 mr-2" />
                                    Back to Dashboard
                                </button>
                            </BoopWrapper>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                                <p className="text-gray-600">Manage your customer appointments</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <FiFilter className="w-4 h-4 text-gray-500" />
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value as any)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Bookings</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
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

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCalendar className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {filter === 'all' ? 'No Bookings Yet' : `No ${filter} Bookings`}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {filter === 'all'
                                ? 'Bookings will appear here once customers start booking your services'
                                : `No bookings with status "${filter}" found`
                            }
                        </p>
                        {filter !== 'all' && (
                            <BoopWrapper>
                                <button
                                    onClick={() => setFilter('all')}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    View All Bookings
                                </button>
                            </BoopWrapper>
                        )}
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {filteredBookings.map((booking, index) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-lg overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{booking.serviceName}</h3>
                                            <p className="text-gray-600">Booking #{booking.id}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(booking.status)}`}>
                                            {getStatusIcon(booking.status)}
                                            <span className="capitalize">{booking.status.replace('_', ' ')}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Customer Information */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                                <FiUser className="w-4 h-4 mr-2" />
                                                Customer Information
                                            </h4>
                                            <div className="space-y-2">
                                                <p className="text-gray-600"><strong>Name:</strong> {booking.customerName}</p>
                                                <p className="text-gray-600 flex items-center">
                                                    <FiMail className="w-4 h-4 mr-2" />
                                                    {booking.customerEmail}
                                                </p>
                                                <p className="text-gray-600 flex items-center">
                                                    <FiPhone className="w-4 h-4 mr-2" />
                                                    {booking.customerPhone}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Booking Details */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                                <FiCalendar className="w-4 h-4 mr-2" />
                                                Booking Details
                                            </h4>
                                            <div className="space-y-2">
                                                <p className="text-gray-600 flex items-center">
                                                    <FiCalendar className="w-4 h-4 mr-2" />
                                                    {new Date(booking.scheduledDate).toLocaleDateString()}
                                                </p>
                                                <p className="text-gray-600 flex items-center">
                                                    <FiClock className="w-4 h-4 mr-2" />
                                                    {booking.scheduledTime}
                                                </p>
                                                <p className="text-gray-600 flex items-center">
                                                    <FiMapPin className="w-4 h-4 mr-2" />
                                                    {booking.address}
                                                </p>
                                                <p className="text-gray-600">
                                                    <strong>Price:</strong> ${booking.servicePrice}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {booking.notes && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">Customer Notes</h4>
                                            <p className="text-gray-600">{booking.notes}</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3 mt-6">
                                        {booking.status === 'pending' && (
                                            <>
                                                <BoopWrapper>
                                                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                                        Confirm
                                                    </button>
                                                </BoopWrapper>
                                                <BoopWrapper>
                                                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                                        Decline
                                                    </button>
                                                </BoopWrapper>
                                            </>
                                        )}

                                        {booking.status === 'confirmed' && (
                                            <BoopWrapper>
                                                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                                                    Start Service
                                                </button>
                                            </BoopWrapper>
                                        )}

                                        {booking.status === 'in_progress' && (
                                            <BoopWrapper>
                                                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                                    Complete Service
                                                </button>
                                            </BoopWrapper>
                                        )}

                                        <BoopWrapper>
                                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                                View Details
                                            </button>
                                        </BoopWrapper>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Summary Stats */}
                {bookings.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 bg-white rounded-lg shadow p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                                <p className="text-sm text-gray-600">Total</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-yellow-600">
                                    {bookings.filter(b => b.status === 'pending').length}
                                </p>
                                <p className="text-sm text-gray-600">Pending</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {bookings.filter(b => b.status === 'confirmed').length}
                                </p>
                                <p className="text-sm text-gray-600">Confirmed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">
                                    {bookings.filter(b => b.status === 'completed').length}
                                </p>
                                <p className="text-sm text-gray-600">Completed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                    ${bookings.reduce((sum, b) => sum + b.servicePrice, 0)}
                                </p>
                                <p className="text-sm text-gray-600">Total Value</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
