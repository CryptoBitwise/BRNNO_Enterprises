"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiEyeOff,
    FiArrowLeft,
    FiDollarSign,
    FiClock,
    FiMapPin,
    FiCheck
} from "react-icons/fi";
import { ProviderProfile, ProviderService } from "@/types/provider";
import { ProviderService as ProviderServiceClass } from "@/lib/providerService";
import BoopWrapper from "@/components/ui/BoopWrapper";

export default function ProviderServicesPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [provider, setProvider] = useState<ProviderProfile | null>(null);
    const [services, setServices] = useState<ProviderService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingService, setEditingService] = useState<ProviderService | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not authenticated
    if (!loading && !user) {
        router.push('/signin');
        return null;
    }

    // Load provider and services data
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

                const servicesData = await ProviderServiceClass.getProviderServices(user.uid);
                setServices(servicesData);
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load services');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user, router]);

    const handleDeleteService = async (serviceId: string) => {
        if (!user || !confirm('Are you sure you want to delete this service?')) return;

        try {
            await ProviderServiceClass.deleteProviderService(user.uid, serviceId);
            setServices(services.filter(s => s.id !== serviceId));
        } catch (err) {
            console.error('Error deleting service:', err);
            setError('Failed to delete service');
        }
    };

    const handleToggleServiceStatus = async (service: ProviderService) => {
        if (!user) return;

        try {
            await ProviderServiceClass.updateProviderService(user.uid, service.id, {
                isActive: !service.isActive
            });

            setServices(services.map(s =>
                s.id === service.id ? { ...s, isActive: !s.isActive } : s
            ));
        } catch (err) {
            console.error('Error updating service:', err);
            setError('Failed to update service');
        }
    };

    // Show loading while checking auth
    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading services...</p>
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
                                <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
                                <p className="text-gray-600">Add, edit, and manage your service offerings</p>
                            </div>
                        </div>

                        <BoopWrapper>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <FiPlus className="w-4 h-4 mr-2" />
                                Add Service
                            </button>
                        </BoopWrapper>
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

                {/* Services Grid */}
                {services.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiPlus className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Yet</h3>
                        <p className="text-gray-600 mb-6">Get started by adding your first service to attract customers</p>
                        <BoopWrapper>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Add Your First Service
                            </button>
                        </BoopWrapper>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-lg overflow-hidden"
                            >
                                {/* Service Header */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                                            <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleToggleServiceStatus(service)}
                                                className={`p-2 rounded-lg transition-colors ${service.isActive
                                                    ? 'text-green-600 bg-green-100 hover:bg-green-200'
                                                    : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                                title={service.isActive ? 'Service is active' : 'Service is inactive'}
                                            >
                                                {service.isActive ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Service Details */}
                                <div className="p-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-600">
                                            <FiDollarSign className="w-4 h-4 mr-2" />
                                            <span className="font-medium">${service.price}</span>
                                        </div>

                                        <div className="flex items-center text-gray-600">
                                            <FiClock className="w-4 h-4 mr-2" />
                                            <span>{service.duration} minutes</span>
                                        </div>

                                        <div className="flex items-center text-gray-600">
                                            <FiMapPin className="w-4 h-4 mr-2" />
                                            <span>{service.isMobileService ? 'Mobile Service' : 'Fixed Location'}</span>
                                        </div>

                                        <div className="flex items-center text-gray-600">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            <span className="capitalize">{service.category}</span>
                                        </div>
                                    </div>

                                    {/* Service Requirements */}
                                    {service.requirements && service.requirements.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {service.requirements.map((req, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                                    >
                                                        {req}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 mt-6">
                                        <BoopWrapper>
                                            <button
                                                onClick={() => setEditingService(service)}
                                                className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <FiEdit2 className="w-4 h-4 mr-2" />
                                                Edit
                                            </button>
                                        </BoopWrapper>

                                        <BoopWrapper>
                                            <button
                                                onClick={() => handleDeleteService(service.id)}
                                                className="flex-1 flex items-center justify-center px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                <FiTrash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </button>
                                        </BoopWrapper>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="px-6 py-3 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {service.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Created {new Date(service.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Add Service Modal */}
                <AnimatePresence>
                    {showAddModal && (
                        <ServiceModal
                            provider={provider}
                            onClose={() => setShowAddModal(false)}
                            onSuccess={(newService) => {
                                setServices([...services, newService]);
                                setShowAddModal(false);
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Edit Service Modal */}
                <AnimatePresence>
                    {editingService && (
                        <ServiceModal
                            provider={provider}
                            service={editingService}
                            onClose={() => setEditingService(null)}
                            onSuccess={(updatedService) => {
                                setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
                                setEditingService(null);
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Service Modal Component
interface ServiceModalProps {
    provider: ProviderProfile;
    service?: ProviderService;
    onClose: () => void;
    onSuccess: (service: ProviderService) => void;
}

function ServiceModal({ provider, service, onClose, onSuccess }: ServiceModalProps) {
    const [formData, setFormData] = useState({
        name: service?.name || '',
        description: service?.description || '',
        category: service?.category || 'cars',
        price: service?.price || 0,
        duration: service?.duration || 60,
        isMobileService: service?.isMobileService || false,
        requirements: service?.requirements || [],
        images: service?.images || [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!provider) return;

        setIsSubmitting(true);
        setError(null);

        try {
            if (service) {
                // Update existing service
                await ProviderServiceClass.updateProviderService(provider.id, service.id, formData);
                onSuccess({ ...service, ...formData, updatedAt: new Date() });
            } else {
                // Create new service
                const newService = await ProviderServiceClass.createProviderService(provider.id, {
                    ...formData,
                    isActive: true
                });
                onSuccess(newService);
            }
        } catch (err) {
            console.error('Error saving service:', err);
            setError('Failed to save service');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addRequirement = (requirement: string) => {
        if (requirement.trim() && !formData.requirements.includes(requirement.trim())) {
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, requirement.trim()]
            }));
        }
    };

    const removeRequirement = (index: number) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
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
                    <h2 className="text-xl font-semibold text-gray-900">
                        {service ? 'Edit Service' : 'Add New Service'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="cars">Cars</option>
                                <option value="trucks">Trucks</option>
                                <option value="watercraft-rv">Watercraft & RV</option>
                                <option value="motorcycles">Motorcycles</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                            <input
                                type="number"
                                min="15"
                                value={formData.duration}
                                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.isMobileService}
                                onChange={(e) => setFormData(prev => ({ ...prev, isMobileService: e.target.checked }))}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">This is a mobile service (I travel to the customer)</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                        <div className="flex space-x-2 mb-2">
                            <input
                                type="text"
                                placeholder="Add a requirement (e.g., 'Customer must provide water access')"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addRequirement(e.currentTarget.value);
                                        e.currentTarget.value = '';
                                    }
                                }}
                            />
                            <BoopWrapper>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder*="requirement"]') as HTMLInputElement;
                                        if (input) {
                                            addRequirement(input.value);
                                            input.value = '';
                                        }
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Add
                                </button>
                            </BoopWrapper>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.requirements.map((req, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                                >
                                    {req}
                                    <button
                                        type="button"
                                        onClick={() => removeRequirement(index)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
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
                                {isSubmitting ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
                            </button>
                        </BoopWrapper>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
