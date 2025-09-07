"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
    FiSearch,
    FiFilter,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiEye,
    FiArrowLeft,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiShield,
    FiDollarSign,
    FiCalendar,
    FiFileText,
    FiDownload
} from "react-icons/fi";
import { ProviderProfile } from "@/types/provider";
import { ProviderService as ProviderServiceClass } from "@/lib/providerService";
import BoopWrapper from "@/components/ui/BoopWrapper";

export default function AdminProvidersPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [providers, setProviders] = useState<ProviderProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [error, setError] = useState<string | null>(null);

    // Check if user is admin
    const isAdmin = user?.email === 'admin@brnno.com' || user?.uid === 'admin';

    // Redirect if not authenticated or not admin
    if (!loading && (!user || !isAdmin)) {
        router.push('/');
        return null;
    }

    // Load providers data
    useEffect(() => {
        const loadProviders = async () => {
            try {
                setIsLoading(true);

                // Mock providers data - in production, this would come from an API
                const mockProviders: ProviderProfile[] = [
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
                        businessDescription: 'Premium auto detailing services with eco-friendly products. We specialize in luxury vehicle care and have been serving the community for over 5 years.',
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
                        documents: {
                            businessLicenseUrl: 'https://example.com/license.pdf',
                            insuranceCertificateUrl: 'https://example.com/insurance.pdf'
                        },
                        averageRating: 4.8,
                        reviewCount: 127,
                        responseTime: 2,
                        totalReviews: 127,
                        verificationStatus: 'verified',
                        businessType: 'LLC',
                        serviceAreas: ['Anytown', 'Nearby City', 'Suburb'],
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
                        businessDescription: 'Professional mobile car wash and detailing services. We bring the service to you!',
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
                        documents: {
                            businessLicenseUrl: 'https://example.com/license2.pdf',
                            insuranceCertificateUrl: 'https://example.com/insurance2.pdf'
                        },
                        averageRating: 0,
                        reviewCount: 0,
                        responseTime: 0,
                        totalReviews: 0,
                        verificationStatus: 'pending',
                        businessType: 'Sole Proprietorship',
                        serviceAreas: ['Anytown', 'Downtown', 'Westside'],
                        serviceRadius: 30
                    },
                    {
                        id: '3',
                        businessName: 'Quick Clean Services',
                        contactPerson: 'John Smith',
                        email: 'john@quickclean.com',
                        phone: '(555) 456-7890',
                        address: '789 Pine Rd',
                        city: 'Anytown',
                        state: 'CA',
                        zipCode: '12345',
                        businessDescription: 'Fast and reliable car cleaning services',
                        yearsInBusiness: 2,
                        serviceCategories: ['cars'],
                        mobileService: false,
                        serviceRadius: 15,
                        hourlyRate: 45,
                        flatRateMin: 30,
                        flatRateMax: 100,
                        paymentMethods: ['credit_card'],
                        status: 'rejected',
                        createdAt: new Date('2024-01-08'),
                        updatedAt: new Date(),
                        availability: {},
                        documents: {},
                        averageRating: 0,
                        reviewCount: 0,
                        responseTime: 0,
                        totalReviews: 0,
                        verificationStatus: 'rejected',
                        businessType: 'LLC',
                        serviceAreas: ['Anytown'],
                        serviceRadius: 15
                    }
                ];

                setProviders(mockProviders);
            } catch (err) {
                console.error('Error loading providers:', err);
                setError('Failed to load providers');
            } finally {
                setIsLoading(false);
            }
        };

        loadProviders();
    }, []);

    // Set filter from URL params
    useEffect(() => {
        const urlFilter = searchParams.get('filter');
        if (urlFilter && ['all', 'pending', 'approved', 'rejected'].includes(urlFilter)) {
            setFilter(urlFilter as any);
        }
    }, [searchParams]);

    const filteredProviders = providers.filter(provider => {
        const matchesSearch = searchTerm === "" ||
            provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'all' || provider.verificationStatus === filter;

        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'verified': return 'text-green-600 bg-green-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <FiClock className="w-4 h-4" />;
            case 'verified': return <FiCheckCircle className="w-4 h-4" />;
            case 'rejected': return <FiXCircle className="w-4 h-4" />;
            default: return <FiClock className="w-4 h-4" />;
        }
    };

    const handleApproveProvider = async (providerId: string) => {
        if (!confirm('Are you sure you want to approve this provider?')) return;

        try {
            // Mock approval - in production, this would call an API
            setProviders(providers.map(provider =>
                provider.id === providerId
                    ? { ...provider, verificationStatus: 'verified', status: 'approved' }
                    : provider
            ));
        } catch (err) {
            console.error('Error approving provider:', err);
            setError('Failed to approve provider');
        }
    };

    const handleRejectProvider = async (providerId: string) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            // Mock rejection - in production, this would call an API
            setProviders(providers.map(provider =>
                provider.id === providerId
                    ? { ...provider, verificationStatus: 'rejected', status: 'rejected' }
                    : provider
            ));
        } catch (err) {
            console.error('Error rejecting provider:', err);
            setError('Failed to reject provider');
        }
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading providers...</p>
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
                            <h1 className="text-2xl font-bold text-gray-900">Provider Management</h1>
                            <p className="text-gray-600">Review and manage provider applications</p>
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

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search providers by name, contact, or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filter Dropdown */}
                        <div className="lg:w-64">
                            <div className="relative">
                                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value as any)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Providers</option>
                                    <option value="pending">Pending Approval</option>
                                    <option value="verified">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {filteredProviders.length} Provider{filteredProviders.length !== 1 ? 's' : ''} Found
                    </h2>
                    <div className="text-sm text-gray-600">
                        Filtered by {filter === 'all' ? 'all statuses' : filter}
                    </div>
                </div>

                {/* Providers List */}
                {filteredProviders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiUser className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Providers Found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search criteria or filter</p>
                        <BoopWrapper>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilter("all");
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Clear Filters
                            </button>
                        </BoopWrapper>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {filteredProviders.map((provider, index) => (
                            <motion.div
                                key={provider.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-lg overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{provider.businessName}</h3>
                                            <p className="text-gray-600 text-sm mb-2">{provider.businessDescription}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <FiUser className="w-4 h-4 mr-1" />
                                                    {provider.contactPerson}
                                                </span>
                                                <span className="flex items-center">
                                                    <FiMapPin className="w-4 h-4 mr-1" />
                                                    {provider.city}, {provider.state}
                                                </span>
                                                <span className="flex items-center">
                                                    <FiCalendar className="w-4 h-4 mr-1" />
                                                    {provider.yearsInBusiness} years in business
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(provider.verificationStatus)}`}>
                                                {getStatusIcon(provider.verificationStatus)}
                                                <span className="capitalize">{provider.verificationStatus}</span>
                                            </div>
                                            <BoopWrapper>
                                                <button
                                                    onClick={() => router.push(`/admin/providers/${provider.id}`)}
                                                    className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <FiEye className="w-4 h-4 mr-1" />
                                                    Review
                                                </button>
                                            </BoopWrapper>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Contact Information */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                                            <div className="space-y-2">
                                                <p className="text-gray-600 flex items-center">
                                                    <FiMail className="w-4 h-4 mr-2" />
                                                    {provider.email}
                                                </p>
                                                <p className="text-gray-600 flex items-center">
                                                    <FiPhone className="w-4 h-4 mr-2" />
                                                    {provider.phone}
                                                </p>
                                                <p className="text-gray-600 flex items-center">
                                                    <FiMapPin className="w-4 h-4 mr-2" />
                                                    {provider.address}, {provider.city}, {provider.state} {provider.zipCode}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Business Details */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Business Details</h4>
                                            <div className="space-y-2">
                                                <p className="text-gray-600">
                                                    <strong>Type:</strong> {provider.businessType}
                                                </p>
                                                <p className="text-gray-600">
                                                    <strong>Service Areas:</strong> {provider.serviceAreas.join(', ')}
                                                </p>
                                                <p className="text-gray-600">
                                                    <strong>Service Radius:</strong> {provider.serviceRadius} miles
                                                </p>
                                                <p className="text-gray-600">
                                                    <strong>Mobile Service:</strong> {provider.mobileService ? 'Yes' : 'No'}
                                                </p>
                                                <p className="text-gray-600">
                                                    <strong>Hourly Rate:</strong> ${provider.hourlyRate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Service Categories */}
                                    <div className="mt-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Service Categories</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {provider.serviceCategories.map((category, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Documents */}
                                    {provider.documents && Object.keys(provider.documents).length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="font-medium text-gray-900 mb-2">Documents</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(provider.documents).map(([key, url]) => (
                                                    <BoopWrapper key={key}>
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                        >
                                                            <FiFileText className="w-4 h-4 mr-2" />
                                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                            <FiDownload className="w-4 h-4 ml-2" />
                                                        </a>
                                                    </BoopWrapper>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {provider.verificationStatus === 'pending' && (
                                        <div className="flex space-x-3 mt-6">
                                            <BoopWrapper>
                                                <button
                                                    onClick={() => handleApproveProvider(provider.id)}
                                                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                >
                                                    <FiCheckCircle className="w-4 h-4 mr-2" />
                                                    Approve
                                                </button>
                                            </BoopWrapper>
                                            <BoopWrapper>
                                                <button
                                                    onClick={() => handleRejectProvider(provider.id)}
                                                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <FiXCircle className="w-4 h-4 mr-2" />
                                                    Reject
                                                </button>
                                            </BoopWrapper>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
