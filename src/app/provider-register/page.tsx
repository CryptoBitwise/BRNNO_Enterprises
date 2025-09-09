"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import ProviderRegistrationForm from "@/components/ProviderRegistrationForm";
import { ProviderRegistrationData } from "@/types/provider";
import { ProviderService } from "@/lib/providerService";
import BoopWrapper from "@/components/ui/BoopWrapper";

export default function ProviderRegisterPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Redirect if not authenticated
    if (!loading && !user) {
        router.push('/signin');
        return null;
    }

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const handleRegistrationComplete = async (data: ProviderRegistrationData) => {
        if (!user) return;

        setIsSubmitting(true);
        setSubmissionStatus('idle');
        setErrorMessage('');

        try {
            // Check if provider already exists
            const providerExists = await ProviderService.providerExists(user.uid);
            if (providerExists) {
                setSubmissionStatus('error');
                setErrorMessage('You already have a provider account. Please contact support if you need to update your information.');
                setIsSubmitting(false);
                return;
            }

            // Create provider profile
            await ProviderService.createProvider(user.uid, data);

            setSubmissionStatus('success');
        } catch (error) {
            console.error('Registration error:', error);
            setSubmissionStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred during registration. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/');
    };

    if (submissionStatus === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", damping: 15 }}
                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <FiCheckCircle className="w-8 h-8 text-green-500" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Submitted!</h1>
                    <p className="text-gray-600 mb-6">
                        Thank you for registering as a service provider. Your application is being reviewed and you'll receive an email notification within 1-2 business days.
                    </p>

                    <div className="space-y-4">
                        <BoopWrapper>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Return to Home
                            </button>
                        </BoopWrapper>

                        <BoopWrapper>
                            <button
                                onClick={() => router.push('/provider-dashboard')}
                                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                View Dashboard
                            </button>
                        </BoopWrapper>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (submissionStatus === 'error') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", damping: 15 }}
                        className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <FiAlertCircle className="w-8 h-8 text-red-500" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Failed</h1>
                    <p className="text-gray-600 mb-6">{errorMessage}</p>

                    <div className="space-y-4">
                        <BoopWrapper>
                            <button
                                onClick={() => setSubmissionStatus('idle')}
                                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </BoopWrapper>

                        <BoopWrapper>
                            <button
                                onClick={handleCancel}
                                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </BoopWrapper>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Registration Form */}
            <ProviderRegistrationForm
                onComplete={handleRegistrationComplete}
                onCancel={handleCancel}
            />
        </div>
    );
}
