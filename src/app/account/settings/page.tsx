"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/components/Toast';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMoon, FiSun, FiSave, FiBell, FiMapPin, FiShield, FiGlobe } from 'react-icons/fi';
import BoopWrapper from '@/components/ui/BoopWrapper';

export default function SettingsPage() {
    const { user } = useAuth();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { profile, loading, saving, updatePreferences } = useProfile();
    const { showToast } = useToast();

    const [saveBookingHistory, setSaveBookingHistory] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [locationServices, setLocationServices] = useState(true);
    const [dataSharing, setDataSharing] = useState(false);

    // Initialize preferences from profile
    useEffect(() => {
        if (profile?.preferences) {
            setSaveBookingHistory(profile.preferences.saveBookingHistory);
            setEmailNotifications(profile.preferences.emailNotifications);
            setSmsNotifications(profile.preferences.smsNotifications);
            setLocationServices(profile.preferences.locationServices);
            setDataSharing(profile.preferences.dataSharing);
        }
    }, [profile]);

    const handleSavePreferences = async () => {
        const success = await updatePreferences({
            saveBookingHistory,
            emailNotifications,
            smsNotifications,
            locationServices,
            dataSharing,
            theme: isDarkMode ? "dark" : "light"
        });

        if (success) {
            showToast("Preferences saved successfully!", "success");
        } else {
            showToast("Failed to save preferences. Please try again.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.main
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {/* Header */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Settings & Preferences
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Customize your experience and manage your preferences
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* General Settings */}
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                General Settings
                            </h2>

                            {/* Theme Toggle */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {isDarkMode ? (
                                            <FiMoon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                                        ) : (
                                            <FiSun className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                                        )}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                Dark Mode
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Toggle between light and dark theme
                                            </p>
                                        </div>
                                    </div>
                                    <BoopWrapper>
                                        <button
                                            onClick={toggleDarkMode}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${isDarkMode ? 'bg-pink-500' : 'bg-gray-200'}`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </BoopWrapper>
                                </div>
                            </div>

                            {/* Booking History Toggle */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FiSave className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                Save Booking History
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Keep track of your previous bookings
                                            </p>
                                        </div>
                                    </div>
                                    <BoopWrapper>
                                        <button
                                            onClick={() => setSaveBookingHistory(!saveBookingHistory)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${saveBookingHistory ? 'bg-pink-500' : 'bg-gray-200'}`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${saveBookingHistory ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </BoopWrapper>
                                </div>
                            </div>
                        </motion.div>

                        {/* Notifications & Privacy */}
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Notifications & Privacy
                            </h2>

                            {/* Email Notifications */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FiBell className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                Email Notifications
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Receive booking confirmations and updates
                                            </p>
                                        </div>
                                    </div>
                                    <BoopWrapper>
                                        <button
                                            onClick={() => setEmailNotifications(!emailNotifications)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${emailNotifications ? 'bg-pink-500' : 'bg-gray-200'}`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailNotifications ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </BoopWrapper>
                                </div>
                            </div>

                            {/* SMS Notifications */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FiBell className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                SMS Notifications
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Get text message reminders
                                            </p>
                                        </div>
                                    </div>
                                    <BoopWrapper>
                                        <button
                                            onClick={() => setSmsNotifications(!smsNotifications)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${smsNotifications ? 'bg-pink-500' : 'bg-gray-200'}`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${smsNotifications ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </BoopWrapper>
                                </div>
                            </div>

                            {/* Location Services */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FiMapPin className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                Location Services
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Find nearby service providers
                                            </p>
                                        </div>
                                    </div>
                                    <BoopWrapper>
                                        <button
                                            onClick={() => setLocationServices(!locationServices)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${locationServices ? 'bg-pink-500' : 'bg-gray-200'}`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${locationServices ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </BoopWrapper>
                                </div>
                            </div>

                            {/* Data Sharing */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FiShield className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                Data Sharing
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Help improve our services (anonymous)
                                            </p>
                                        </div>
                                    </div>
                                    <BoopWrapper>
                                        <button
                                            onClick={() => setDataSharing(!dataSharing)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${dataSharing ? 'bg-pink-500' : 'bg-gray-200'}`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${dataSharing ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </BoopWrapper>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Save Button */}
                    <motion.div
                        className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <BoopWrapper>
                            <button
                                onClick={handleSavePreferences}
                                disabled={saving || loading}
                                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Preferences"
                                )}
                            </button>
                        </BoopWrapper>
                    </motion.div>
                </motion.main>
            </div>
        </div>
    );
}