"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
    FiArrowLeft,
    FiCheckCircle,
    FiXCircle,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiDollarSign,
    FiShield,
    FiFileText,
    FiDownload,
    FiClock,
    FiTruck,
    FiCheckCircle,
    FiAnchor,
    FiZap,
    FiAlertTriangle,
    FiEdit
} from "react-icons/fi";
import { ProviderProfile } from "@/types/provider";
import { ProviderService as ProviderServiceClass } from "@/lib/providerService";
import BoopWrapper from "@/components/ui/BoopWrapper";

interface ProviderReviewPageProps {
    params: {
        id: string;
    };
}

export default function ProviderReviewPage({ params }: ProviderReviewPageProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [provider, setProvider] = useState<ProviderProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    // Check if user is admin
    const isAdmin = user?.email === 'admin@brnno.com' || user?.uid === 'admin';

    // Redirect if not authenticated or not admin
    if (!loading && (!user || !isAdmin)) {
        router.push('/');
        return null;
    }

    // Load provider data
    useEffect(() => {
        const loadProviderData = async () => {
            try {
                setIsLoading(true);

                // Mock provider data - in production, this would come from an API
                const mockProvider: ProviderProfile = {
                    id: params.id,
                    businessName: 'Mobile Wash Masters',
                    contactPerson: 'Sarah Williams',
                    email: 'sarah@mobilewash.com',
                    phone: '(555) 987-6543',
                    address: '456 Oak Ave',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    businessDescription: 'Professional mobile car wash and detailing services. We bring the service to you! Our team is experienced in all types of vehicle cleaning and uses only eco-friendly products.',
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
                        businessLicenseUrl: 'https://example.com/business-license.pdf',
                        insuranceCertificateUrl: 'https://example.com/insurance-certificate.pdf',
                        backgroundCheckUrl: 'https://example.com/background-check.pdf'
                    },
                    averageRating: 0,
                    reviewCount: 0,
                    responseTime: 0,
                    totalReviews: 0,
                    verificationStatus: 'pending',
                    businessType: 'Sole Proprietorship',
                    serviceAreas: ['Anytown', 'Downtown', 'Westside', 'Suburb'],
                    serviceRadius: 30
                };

                setProvider(mockProvider);
            } catch (err) {
                console.error('Error loading provider data:', err);
                setError('Failed to load provider information');
            } finally {
                setIsLoading(false);
            }
        };

        loadProviderData();
    }, [params.id]);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'cars': return FiCheckCircle;
            case 'trucks': return FiTruck;
            case 'watercraft-rv': return FiAnchor;
            case 'motorcycles': return FiZap;
            default: return FiCheckCircle;
        }
    };

    const handleApprove = async () => {
        if (!provider || !confirm('Are you sure you want to approve this provider?')) return;

        setIsProcessing(true);
        try {
            // Mock approval - in production, this would call an API
            await new Promise(resolve => setTimeout(resolve, 2000));

            setProvider({
                ...provider,
                verificationStatus: 'verified',
                status: 'approved'
            });

            // Show success message
            alert('Provider approved successfully!');
        } catch (err) {
            console.error('Error approving provider:', err);
            setError('Failed to approve provider');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!provider || !rejectReason.trim()) return;

        setIsProcessing(true);
        try {
            // Mock rejection - in production, this would call an API
            await new Promise(resolve => setTimeout(resolve, 2000));

            setProvider({
                ...provider,
                verificationStatus: 'rejected',
                status: 'rejected'
            });

            setShowRejectModal(false);
            setRejectReason("");

            // Show success message
            alert('Provider rejected successfully!');
        } catch (err) {
            console.error('Error rejecting provider:', err);
            setError('Failed to reject provider');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading provider details...</p>
                </div>
            </div>
        );
    }

    if (error || !provider) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Provider Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || 'The provider you are looking for does not exist.'}</p>
                    <BoopWrapper>
                        <button
                            onClick={() => router.push('/admin/providers')}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Back to Providers
                        </button>
                    </BoopWrapper>
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
                                onClick={() => router.push('/admin/providers')}
                                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <FiArrowLeft className="w-5 h-5 mr-2" />
                                Back to Providers
                            </button>
                        </BoopWrapper>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{provider.businessName}</h1>
                            <p className="text-gray-600">Provider Application Review</p>
                        </div>

                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${provider.verificationStatus === 'verified'
                                ? 'text-green-600 bg-green-100'
                                : provider.verificationStatus === 'pending'
                                    ? 'text-yellow-600 bg-yellow-100'
                                    : 'text-red-600 bg-red-100'
                                }`}>
                                {provider.verificationStatus === 'verified' ? <FiCheckCircle className="w-4 h-4" /> :
                                    provider.verificationStatus === 'pending' ? <FiClock className="w-4 h-4" /> :
                                        <FiXCircle className="w-4 h-4" />}
                                <span className="capitalize">{provider.verificationStatus}</span>
                            </span>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Business Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Basic Details</h3>
                                    <div className="space-y-2">
                                        <p className="text-gray-600"><strong>Business Name:</strong> {provider.businessName}</p>
                                        <p className="text-gray-600"><strong>Contact Person:</strong> {provider.contactPerson}</p>
                                        <p className="text-gray-600"><strong>Business Type:</strong> {provider.businessType}</p>
                                        <p className="text-gray-600"><strong>Years in Business:</strong> {provider.yearsInBusiness}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
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
                            </div>

                            <div className="mt-6">
                                <h3 className="font-medium text-gray-900 mb-3">Business Description</h3>
                                <p className="text-gray-600">{provider.businessDescription}</p>
                            </div>
                        </motion.div>

                        {/* Service Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Service Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {provider.serviceCategories.map((category, idx) => {
                                            const Icon = getCategoryIcon(category);
                                            return (
                                                <span
                                                    key={idx}
                                                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                >
                                                    <Icon className="w-4 h-4 mr-2" />
                                                    {category}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Service Details</h3>
                                    <div className="space-y-2">
                                        <p className="text-gray-600">
                                            <strong>Mobile Service:</strong> {provider.mobileService ? 'Yes' : 'No'}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Service Radius:</strong> {provider.serviceRadius} miles
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Hourly Rate:</strong> ${provider.hourlyRate}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Price Range:</strong> ${provider.flatRateMin} - ${provider.flatRateMax}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-medium text-gray-900 mb-3">Service Areas</h3>
                                <div className="flex flex-wrap gap-2">
                                    {provider.serviceAreas.map((area, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                        >
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Documents */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Documents</h2>
                            {provider.documents && Object.keys(provider.documents).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(provider.documents).map(([key, url]) => (
                                        <BoopWrapper key={key}>
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <FiFileText className="w-6 h-6 text-blue-600 mr-3" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </p>
                                                    <p className="text-sm text-gray-600">Click to view document</p>
                                                </div>
                                                <FiDownload className="w-4 h-4 text-gray-400" />
                                            </a>
                                        </BoopWrapper>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No documents uploaded</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Action Panel */}
                        {provider.verificationStatus === 'pending' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-lg shadow p-6"
                            >
                                <h3 className="font-semibold text-gray-900 mb-4">Review Actions</h3>
                                <div className="space-y-3">
                                    <BoopWrapper>
                                        <button
                                            onClick={handleApprove}
                                            disabled={isProcessing}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FiCheckCircle className="w-4 h-4 mr-2" />
                                            {isProcessing ? 'Processing...' : 'Approve Provider'}
                                        </button>
                                    </BoopWrapper>

                                    <BoopWrapper>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            disabled={isProcessing}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FiXCircle className="w-4 h-4 mr-2" />
                                            Reject Provider
                                        </button>
                                    </BoopWrapper>
                                </div>
                            </motion.div>
                        )}

                        {/* Application Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <h3 className="font-semibold text-gray-900 mb-4">Application Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Application Date:</span>
                                    <span className="font-medium">{new Date(provider.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last Updated:</span>
                                    <span className="font-medium">{new Date(provider.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-medium ${provider.verificationStatus === 'verified' ? 'text-green-600' :
                                        provider.verificationStatus === 'pending' ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>
                                        {provider.verificationStatus}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Methods */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
                            <div className="space-y-2">
                                {provider.paymentMethods.map((method, idx) => (
                                    <div key={idx} className="flex items-center">
                                        <FiCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                                        <span className="text-sm text-gray-600 capitalize">
                                            {method.replace('_', ' ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Provider Application</h3>
                        <p className="text-gray-600 mb-4">
                            Please provide a reason for rejecting this provider application. This will be sent to the provider.
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                        />
                        <div className="flex justify-end space-x-3">
                            <BoopWrapper>
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectReason("");
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </BoopWrapper>
                            <BoopWrapper>
                                <button
                                    onClick={handleReject}
                                    disabled={!rejectReason.trim() || isProcessing}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isProcessing ? 'Processing...' : 'Reject Application'}
                                </button>
                            </BoopWrapper>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
