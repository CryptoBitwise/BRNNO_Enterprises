"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    FiStar,
    FiClock,
    FiDollarSign,
    FiMapPin,
    FiCheckCircle,
    FiTruck,
    FiAnchor,
    FiZap,
    FiCalendar,
    FiArrowLeft,
    FiPhone,
    FiX,
    FiMail,
    FiGlobe,
    FiAward,
    FiUsers,
    FiShield
} from "react-icons/fi";
import { ProviderProfile, ProviderService } from "@/types/provider";
import { ProviderService as ProviderServiceClass } from "@/lib/providerService";
import BoopWrapper from "@/components/ui/BoopWrapper";

interface ProviderPageProps {
    params: {
        id: string;
    };
}

export default function ProviderPage({ params }: ProviderPageProps) {
    const router = useRouter();
    const [provider, setProvider] = useState<ProviderProfile | null>(null);
    const [services, setServices] = useState<ProviderService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<ProviderService | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load provider data
    useEffect(() => {
        const loadProviderData = async () => {
            try {
                setIsLoading(true);

                // Mock provider data - in production, this would come from an API
                const mockProvider: ProviderProfile = {
                    id: params.id,
                    businessName: 'Elite Auto Detailing',
                    contactPerson: 'Mike Johnson',
                    email: 'mike@eliteauto.com',
                    phone: '(555) 123-4567',
                    address: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    businessDescription: 'Premium auto detailing services with eco-friendly products. We specialize in luxury vehicle care and have been serving the community for over 5 years with a commitment to excellence and customer satisfaction.',
                    yearsInBusiness: 5,
                    serviceCategories: ['cars', 'trucks'],
                    mobileService: true,
                    serviceRadius: 25,
                    hourlyRate: 75,
                    flatRateMin: 50,
                    flatRateMax: 200,
                    paymentMethods: ['credit_card', 'cash'],
                    status: 'approved',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    availability: {},
                    documents: {},
                    averageRating: 4.8,
                    reviewCount: 127,
                    responseTime: 2,
                    totalReviews: 127,
                    verificationStatus: 'verified',
                    businessType: 'LLC',
                    serviceAreas: ['Anytown', 'Nearby City', 'Suburb', 'Downtown'],
                    serviceRadius: 25
                };

                const mockServices: ProviderService[] = [
                    {
                        id: '1',
                        providerId: params.id,
                        name: 'Premium Car Detailing',
                        description: 'Complete interior and exterior detailing with premium products',
                        category: 'cars',
                        price: 150,
                        duration: 120,
                        isMobileService: true,
                        isActive: true,
                        requirements: ['Water access required', 'Electrical outlet needed'],
                        images: [],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: '2',
                        providerId: params.id,
                        name: 'Truck Wash & Wax',
                        description: 'Professional truck cleaning and waxing service',
                        category: 'trucks',
                        price: 200,
                        duration: 180,
                        isMobileService: true,
                        isActive: true,
                        requirements: ['Large parking space required'],
                        images: [],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: '3',
                        providerId: params.id,
                        name: 'Quick Car Wash',
                        description: 'Fast exterior wash and dry service',
                        category: 'cars',
                        price: 50,
                        duration: 45,
                        isMobileService: true,
                        isActive: true,
                        requirements: [],
                        images: [],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ];

                setProvider(mockProvider);
                setServices(mockServices);
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
            case 'cars': return FiCar;
            case 'trucks': return FiTruck;
            case 'watercraft-rv': return FiAnchor;
            case 'motorcycles': return FiZap;
            default: return FiCar;
        }
    };

    const handleBookService = (service: ProviderService) => {
        setSelectedService(service);
        setShowBookingModal(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading provider...</p>
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
                            onClick={() => router.push('/find-providers')}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Find Other Providers
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
                                onClick={() => router.push('/find-providers')}
                                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <FiArrowLeft className="w-5 h-5 mr-2" />
                                Back to Search
                            </button>
                        </BoopWrapper>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.businessName}</h1>
                            <p className="text-gray-600 text-lg mb-4">{provider.businessDescription}</p>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center">
                                    <FiStar className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                                    <span className="text-lg font-semibold text-gray-900">
                                        {provider.averageRating?.toFixed(1) || 'N/A'}
                                    </span>
                                    <span className="text-gray-500 ml-1">({provider.reviewCount} reviews)</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <FiClock className="w-5 h-5 mr-2" />
                                    <span>{provider.responseTime}h avg response</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <FiAward className="w-5 h-5 mr-2" />
                                    <span>{provider.yearsInBusiness} years in business</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 lg:mt-0 lg:ml-8">
                            <div className="bg-gray-50 rounded-lg p-4 w-full lg:w-80">
                                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <FiPhone className="w-4 h-4 mr-3" />
                                        <span className="text-sm">{provider.phone}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FiMail className="w-4 h-4 mr-3" />
                                        <span className="text-sm">{provider.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FiMapPin className="w-4 h-4 mr-3" />
                                        <span className="text-sm">{provider.city}, {provider.state}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Services Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Services</h2>
                            <div className="space-y-4">
                                {services.map((service, index) => {
                                    const Icon = getCategoryIcon(service.category);
                                    return (
                                        <motion.div
                                            key={service.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center mb-2">
                                                        <Icon className="w-5 h-5 text-blue-600 mr-2" />
                                                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                                                    </div>
                                                    <p className="text-gray-600 mb-3">{service.description}</p>

                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <FiDollarSign className="w-4 h-4 mr-1" />
                                                            <span>${service.price}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FiClock className="w-4 h-4 mr-1" />
                                                            <span>{service.duration} minutes</span>
                                                        </div>
                                                        {service.isMobileService && (
                                                            <div className="flex items-center text-green-600">
                                                                <FiCheckCircle className="w-4 h-4 mr-1" />
                                                                <span>Mobile Service</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {service.requirements && service.requirements.length > 0 && (
                                                        <div className="mt-3">
                                                            <p className="text-sm font-medium text-gray-700 mb-1">Requirements:</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {service.requirements.map((req, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs"
                                                                    >
                                                                        {req}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="ml-4">
                                                    <BoopWrapper>
                                                        <button
                                                            onClick={() => handleBookService(service)}
                                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                        >
                                                            Book Now
                                                        </button>
                                                    </BoopWrapper>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* About Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">About {provider.businessName}</h2>
                            <div className="space-y-4">
                                <p className="text-gray-600">{provider.businessDescription}</p>

                                <div className="grid grid-cols-2 gap-4">
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
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Service Radius</h3>
                                        <p className="text-gray-600">{provider.serviceRadius} miles</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Verification Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <h3 className="font-semibold text-gray-900 mb-4">Verification Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <FiShield className="w-5 h-5 text-green-500 mr-3" />
                                    <span className="text-sm text-gray-600">Business License Verified</span>
                                </div>
                                <div className="flex items-center">
                                    <FiShield className="w-5 h-5 text-green-500 mr-3" />
                                    <span className="text-sm text-gray-600">Insurance Verified</span>
                                </div>
                                <div className="flex items-center">
                                    <FiCheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                    <span className="text-sm text-gray-600">Background Check Passed</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Methods */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
                            <div className="space-y-2">
                                {provider.paymentMethods.map((method, index) => (
                                    <div key={index} className="flex items-center">
                                        <FiCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                                        <span className="text-sm text-gray-600 capitalize">
                                            {method.replace('_', ' ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Pricing Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Hourly Rate:</span>
                                    <span className="text-sm font-medium">${provider.hourlyRate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Service Range:</span>
                                    <span className="text-sm font-medium">
                                        ${provider.flatRateMin} - ${provider.flatRateMax}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && selectedService && (
                <BookingModal
                    provider={provider}
                    service={selectedService}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedService(null);
                    }}
                />
            )}
        </div>
    );
}

// Booking Modal Component
interface BookingModalProps {
    provider: ProviderProfile;
    service: ProviderService;
    onClose: () => void;
}

function BookingModal({ provider, service, onClose }: BookingModalProps) {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        scheduledDate: '',
        scheduledTime: '',
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Mock booking submission - in production, this would call an API
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message and close modal
            alert('Booking submitted successfully! The provider will contact you to confirm.');
            onClose();
        } catch (err) {
            console.error('Error submitting booking:', err);
            setError('Failed to submit booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Book Service</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-gray-600 mt-2">{service.name} - ${service.price}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                            <input
                                type="text"
                                value={formData.customerName}
                                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <input
                                type="email"
                                value={formData.customerEmail}
                                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                            <input
                                type="tel"
                                value={formData.customerPhone}
                                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Address *</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                            <input
                                type="text"
                                value={formData.zipCode}
                                onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                            <input
                                type="date"
                                value={formData.scheduledDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
                            <select
                                value={formData.scheduledTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Time</option>
                                <option value="08:00">8:00 AM</option>
                                <option value="09:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">1:00 PM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                                <option value="17:00">5:00 PM</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Any special requirements or notes for the service..."
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <BoopWrapper>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </BoopWrapper>

                        <BoopWrapper>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                            </button>
                        </BoopWrapper>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
