"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/components/Toast";
import { FiUser, FiSettings, FiEdit3, FiPlus, FiTrash2, FiTruck } from "react-icons/fi";
import { FaCar, FaShip, FaMotorcycle } from "react-icons/fa";
import BoopWrapper from "@/components/ui/BoopWrapper";

export default function AccountPage() {
    const { user } = useAuth();
    const { profile, loading, saving, saveProfile, removeVehicle } = useProfile();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phone: ""
    });

    // Initialize form data when profile loads
    useEffect(() => {
        if (profile) {
            setFormData({
                displayName: profile.displayName || "",
                email: profile.email || "",
                phone: profile.phone || ""
            });
        }
    }, [profile]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!profile) return;

        const success = await saveProfile({
            displayName: formData.displayName,
            email: formData.email,
            phone: formData.phone
        });

        if (success) {
            showToast("Profile updated successfully!", "success");
            setIsEditing(false);
        } else {
            showToast("Failed to update profile. Please try again.", "error");
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                displayName: profile.displayName || "",
                email: profile.email || "",
                phone: profile.phone || ""
            });
        }
        setIsEditing(false);
    };

    const handleRemoveVehicle = async (vehicleId: string) => {
        const success = await removeVehicle(vehicleId);
        if (success) {
            showToast("Vehicle removed successfully!", "success");
        } else {
            showToast("Failed to remove vehicle. Please try again.", "error");
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
                            Account Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your profile and vehicle information
                        </p>
                    </motion.div>

                    {/* Tab Navigation */}
                    <motion.div
                        className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <BoopWrapper>
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "profile"
                                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                    }`}
                            >
                                <FiUser className="h-4 w-4 mr-2" />
                                Profile
                            </button>
                        </BoopWrapper>
                        <BoopWrapper>
                            <button
                                onClick={() => setActiveTab("settings")}
                                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "settings"
                                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                    }`}
                            >
                                <FiSettings className="h-4 w-4 mr-2" />
                                Settings
                            </button>
                        </BoopWrapper>
                    </motion.div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Profile Information */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            Profile Information
                                        </h2>
                                        <BoopWrapper>
                                            <button
                                                onClick={() => setIsEditing(!isEditing)}
                                                className="flex items-center text-pink-500 hover:text-pink-600 font-medium"
                                            >
                                                <FiEdit3 className="h-4 w-4 mr-1" />
                                                {isEditing ? "Cancel" : "Edit"}
                                            </button>
                                        </BoopWrapper>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Full Name
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.displayName}
                                                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-gray-100">{formData.displayName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Email
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-gray-100">{formData.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Phone
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-gray-100">{formData.phone}</p>
                                            )}
                                        </div>

                                        {isEditing && (
                                            <div className="flex space-x-3 pt-4">
                                                <BoopWrapper>
                                                    <button
                                                        onClick={handleSave}
                                                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                    >
                                                        Save Changes
                                                    </button>
                                                </BoopWrapper>
                                                <BoopWrapper>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </BoopWrapper>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Vehicle Management */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            Vehicle Management
                                        </h2>
                                        <BoopWrapper>
                                            <button className="flex items-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                <FiPlus className="h-4 w-4 mr-1" />
                                                Add Vehicle
                                            </button>
                                        </BoopWrapper>
                                    </div>

                                    <div className="space-y-4">
                                        {loading ? (
                                            <div className="text-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                                                <p className="text-gray-500 dark:text-gray-400 mt-2">Loading vehicles...</p>
                                            </div>
                                        ) : profile?.vehicles && profile.vehicles.length > 0 ? (
                                            profile.vehicles.map((vehicle, index) => (
                                                <motion.div
                                                    key={vehicle.id}
                                                    className="bg-white dark:bg-gray-600 rounded-lg p-4 border border-gray-200 dark:border-gray-500"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            {vehicle.type === "Car" && <FaCar className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />}
                                                            {vehicle.type === "Truck" && <FiTruck className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />}
                                                            {vehicle.type === "Watercraft & RV" && <FaShip className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />}
                                                            {vehicle.type === "Motorcycle" && <FaMotorcycle className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />}
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                                                </h3>
                                                                {vehicle.vin && (
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        VIN: {vehicle.vin}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <BoopWrapper>
                                                                <button className="text-pink-500 hover:text-pink-600">
                                                                    <FiEdit3 className="h-4 w-4" />
                                                                </button>
                                                            </BoopWrapper>
                                                            <BoopWrapper>
                                                                <button
                                                                    onClick={() => handleRemoveVehicle(vehicle.id)}
                                                                    disabled={saving}
                                                                    className="text-red-500 hover:text-red-600 disabled:opacity-50"
                                                                >
                                                                    <FiTrash2 className="h-4 w-4" />
                                                                </button>
                                                            </BoopWrapper>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500 dark:text-gray-400">No vehicles added yet.</p>
                                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your first vehicle to get started.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "settings" && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        Account Settings
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                Change Password
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Update your password to keep your account secure
                                            </p>
                                            <BoopWrapper>
                                                <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                    Change Password
                                                </button>
                                            </BoopWrapper>
                                        </div>

                                        <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                Account Actions
                                            </h3>
                                            <div className="space-y-2">
                                                <BoopWrapper>
                                                    <button className="text-red-500 hover:text-red-600 font-medium">
                                                        Delete Account
                                                    </button>
                                                </BoopWrapper>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.main>
            </div>
        </div>
    );
} 