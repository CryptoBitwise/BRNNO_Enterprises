"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiCheck, FiUpload, FiX } from "react-icons/fi";
import { FaCar, FaTruck, FaShip, FaMotorcycle } from "react-icons/fa";
import { ProviderRegistrationData } from "@/types/provider";
import BoopWrapper from "@/components/ui/BoopWrapper";

interface ProviderRegistrationFormProps {
    onComplete: (data: ProviderRegistrationData) => void;
    onCancel: () => void;
}

const steps = [
    { id: 1, title: "Basic Information", icon: "👤" },
    { id: 2, title: "Business Details", icon: "🏢" },
    { id: 3, title: "Location & Service Area", icon: "📍" },
    { id: 4, title: "Services Offered", icon: "🔧" },
    { id: 5, title: "Business Hours", icon: "⏰" },
    { id: 6, title: "Pricing & Commission", icon: "💰" },
    { id: 7, title: "Verification Documents", icon: "📄" }
];

const serviceCategories = [
    { key: "automotive", label: "Automotive", icon: FaCar },
    { key: "transportation", label: "Transportation", icon: FaTruck },
    { key: "maritime", label: "Maritime", icon: FaShip },
    { key: "motorcycle", label: "Motorcycle", icon: FaMotorcycle },
    { key: "cleaning", label: "Cleaning", icon: "🧹" },
    { key: "maintenance", label: "Maintenance", icon: "🔧" },
    { key: "repair", label: "Repair", icon: "⚙️" },
    { key: "installation", label: "Installation", icon: "📦" }
];

const daysOfWeek = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

export default function ProviderRegistrationForm({ onComplete, onCancel }: ProviderRegistrationFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ProviderRegistrationData>({
        businessName: "",
        businessType: "individual",
        contactPerson: "",
        email: "",
        phone: "",
        website: "",
        businessDescription: "",
        yearsInBusiness: 0,
        licenseNumber: "",
        insuranceProvider: "",
        insurancePolicyNumber: "",
        businessAddress: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "US"
        },
        serviceArea: {
            radius: 25,
            zipCodes: []
        },
        serviceCategories: [],
        services: [],
        businessHours: {
            monday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
            tuesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
            wednesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
            thursday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
            friday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
            saturday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
            sunday: { isOpen: false, openTime: "09:00", closeTime: "17:00" }
        },
        pricing: {
            baseCommissionRate: 15,
            minimumJobValue: 50,
            maximumJobValue: 10000
        },
        verificationDocuments: {
            businessLicense: null,
            insuranceCertificate: null,
            idVerification: null
        }
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 1:
                if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
                if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact person is required";
                if (!formData.email.trim()) newErrors.email = "Email is required";
                if (!formData.phone.trim()) newErrors.phone = "Phone is required";
                break;
            case 2:
                if (!formData.businessDescription.trim()) newErrors.businessDescription = "Business description is required";
                if (formData.yearsInBusiness < 0) newErrors.yearsInBusiness = "Years in business must be 0 or greater";
                break;
            case 3:
                if (!formData.businessAddress.street.trim()) newErrors.street = "Street address is required";
                if (!formData.businessAddress.city.trim()) newErrors.city = "City is required";
                if (!formData.businessAddress.state.trim()) newErrors.state = "State is required";
                if (!formData.businessAddress.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
                break;
            case 4:
                if (formData.serviceCategories.length === 0) newErrors.serviceCategories = "At least one service category is required";
                break;
            case 6:
                if (formData.pricing.baseCommissionRate < 5 || formData.pricing.baseCommissionRate > 30) {
                    newErrors.baseCommissionRate = "Commission rate must be between 5% and 30%";
                }
                if (formData.pricing.minimumJobValue < 10) {
                    newErrors.minimumJobValue = "Minimum job value must be at least $10";
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = () => {
        if (validateStep(currentStep)) {
            onComplete(formData);
        }
    };

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => {
            const keys = field.split('.');
            if (keys.length === 1) {
                return { ...prev, [field]: value };
            } else if (keys.length === 2) {
                return { ...prev, [keys[0]]: { ...prev[keys[0] as keyof typeof prev], [keys[1]]: value } };
            }
            return prev;
        });
    };

    const toggleArrayItem = (field: string, value: string) => {
        const currentArray = field.includes('.')
            ? formData[field.split('.')[0] as keyof typeof formData] as string[]
            : formData[field as keyof typeof formData] as string[];

        const newArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];

        updateFormData(field, newArray);
    };

    const handleFileUpload = (field: string, file: File) => {
        updateFormData(`verificationDocuments.${field}`, file);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => updateFormData("businessName", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                    placeholder="Enter your business name"
                                />
                                {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                                <select
                                    value={formData.businessType}
                                    onChange={(e) => updateFormData("businessType", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                >
                                    <option value="individual">Individual/Sole Proprietor</option>
                                    <option value="company">Company/Corporation</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                                <input
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={(e) => updateFormData("contactPerson", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                    placeholder="Your full name"
                                />
                                {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateFormData("email", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                    placeholder="business@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateFormData("phone", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                    placeholder="(555) 123-4567"
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => updateFormData("website", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Business Details</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Description *</label>
                            <textarea
                                value={formData.businessDescription}
                                onChange={(e) => updateFormData("businessDescription", e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                placeholder="Tell us about your business, experience, and what makes you unique..."
                            />
                            {errors.businessDescription && <p className="text-red-500 text-sm mt-1">{errors.businessDescription}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Years in Business *</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.yearsInBusiness}
                                    onChange={(e) => updateFormData("yearsInBusiness", parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                />
                                {errors.yearsInBusiness && <p className="text-red-500 text-sm mt-1">{errors.yearsInBusiness}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                                <input
                                    type="text"
                                    value={formData.licenseNumber}
                                    onChange={(e) => updateFormData("licenseNumber", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                    placeholder="Business license number (if applicable)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
                                <input
                                    type="text"
                                    value={formData.insuranceProvider}
                                    onChange={(e) => updateFormData("insuranceProvider", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                    placeholder="Insurance company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Policy Number</label>
                                <input
                                    type="text"
                                    value={formData.insurancePolicyNumber}
                                    onChange={(e) => updateFormData("insurancePolicyNumber", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                    placeholder="Policy number"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Location & Service Area</h3>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800">Business Address</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                                    <input
                                        type="text"
                                        value={formData.businessAddress.street}
                                        onChange={(e) => updateFormData("businessAddress.street", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                        placeholder="123 Main Street"
                                    />
                                    {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                    <input
                                        type="text"
                                        value={formData.businessAddress.city}
                                        onChange={(e) => updateFormData("businessAddress.city", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                        placeholder="City"
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                    <input
                                        type="text"
                                        value={formData.businessAddress.state}
                                        onChange={(e) => updateFormData("businessAddress.state", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                        placeholder="State"
                                    />
                                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                                    <input
                                        type="text"
                                        value={formData.businessAddress.zipCode}
                                        onChange={(e) => updateFormData("businessAddress.zipCode", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                        placeholder="12345"
                                    />
                                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800">Service Area</h4>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Service Radius (miles)</label>
                                <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    value={formData.serviceArea.radius}
                                    onChange={(e) => updateFormData("serviceArea.radius", parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-1">
                                    <span>5 miles</span>
                                    <span className="font-medium">{formData.serviceArea.radius} miles</span>
                                    <span>100 miles</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Services Offered</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">Service Categories *</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {serviceCategories.map((category) => (
                                        <BoopWrapper key={category.key}>
                                            <button
                                                type="button"
                                                onClick={() => toggleArrayItem("serviceCategories", category.key)}
                                                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${formData.serviceCategories.includes(category.key)
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center space-y-2">
                                                    {typeof category.icon === "string" ? (
                                                        <span className="text-2xl">{category.icon}</span>
                                                    ) : (
                                                        <category.icon className="w-6 h-6" />
                                                    )}
                                                    <span className="text-sm font-medium text-center">{category.label}</span>
                                                </div>
                                            </button>
                                        </BoopWrapper>
                                    ))}
                                </div>
                                {errors.serviceCategories && <p className="text-red-500 text-sm mt-2">{errors.serviceCategories}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Specific Services</label>
                                <textarea
                                    value={formData.services.join(", ")}
                                    onChange={(e) => updateFormData("services", e.target.value.split(", ").filter(s => s.trim()))}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                    placeholder="List specific services you offer (comma-separated)"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Business Hours</h3>

                        <div className="space-y-4">
                            {Object.entries(formData.businessHours).map(([day, hours]) => (
                                <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-20">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={hours.isOpen}
                                                onChange={(e) => updateFormData(`businessHours.${day}.isOpen`, e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium capitalize">{day}</span>
                                        </label>
                                    </div>
                                    {hours.isOpen && (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="time"
                                                value={hours.openTime}
                                                onChange={(e) => updateFormData(`businessHours.${day}.openTime`, e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                            />
                                            <span className="text-gray-500">to</span>
                                            <input
                                                type="time"
                                                value={hours.closeTime}
                                                onChange={(e) => updateFormData(`businessHours.${day}.closeTime`, e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                            />
                                        </div>
                                    )}
                                    {!hours.isOpen && (
                                        <span className="text-gray-500 text-sm">Closed</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Pricing & Commission</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Base Commission Rate (%) *</label>
                                <input
                                    type="number"
                                    min="5"
                                    max="30"
                                    value={formData.pricing.baseCommissionRate}
                                    onChange={(e) => updateFormData("pricing.baseCommissionRate", parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                />
                                {errors.baseCommissionRate && <p className="text-red-500 text-sm mt-1">{errors.baseCommissionRate}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Job Value ($)</label>
                                <input
                                    type="number"
                                    min="10"
                                    value={formData.pricing.minimumJobValue}
                                    onChange={(e) => updateFormData("pricing.minimumJobValue", parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                />
                                {errors.minimumJobValue && <p className="text-red-500 text-sm mt-1">{errors.minimumJobValue}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Job Value ($)</label>
                                <input
                                    type="number"
                                    min="100"
                                    value={formData.pricing.maximumJobValue}
                                    onChange={(e) => updateFormData("pricing.maximumJobValue", parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Commission Structure</h4>
                            <p className="text-blue-800 text-sm">
                                BRNNO charges a {formData.pricing.baseCommissionRate}% commission on all completed jobs.
                                This helps us maintain the platform, provide customer support, and handle payments securely.
                            </p>
                        </div>
                    </div>
                );

            case 7:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Verification Documents</h3>

                        <div className="space-y-6">
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-yellow-900 mb-2">Verification Required</h4>
                                <p className="text-yellow-800 text-sm">
                                    To ensure the safety and quality of our platform, we require verification documents.
                                    Your account will be reviewed within 1-2 business days.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business License</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileUpload("businessLicense", file);
                                            }}
                                            className="hidden"
                                            id="businessLicense"
                                        />
                                        <label htmlFor="businessLicense" className="cursor-pointer">
                                            <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">Click to upload</p>
                                            <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                                        </label>
                                        {formData.verificationDocuments.businessLicense && (
                                            <p className="text-sm text-green-600 mt-2">
                                                ✓ {formData.verificationDocuments.businessLicense.name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Certificate</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileUpload("insuranceCertificate", file);
                                            }}
                                            className="hidden"
                                            id="insuranceCertificate"
                                        />
                                        <label htmlFor="insuranceCertificate" className="cursor-pointer">
                                            <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">Click to upload</p>
                                            <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                                        </label>
                                        {formData.verificationDocuments.insuranceCertificate && (
                                            <p className="text-sm text-green-600 mt-2">
                                                ✓ {formData.verificationDocuments.insuranceCertificate.name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ID Verification</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileUpload("idVerification", file);
                                            }}
                                            className="hidden"
                                            id="idVerification"
                                        />
                                        <label htmlFor="idVerification" className="cursor-pointer">
                                            <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">Click to upload</p>
                                            <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                                        </label>
                                        {formData.verificationDocuments.idVerification && (
                                            <p className="text-sm text-green-600 mt-2">
                                                ✓ {formData.verificationDocuments.idVerification.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Join BRNNO as a Service Provider</h1>
                    <p className="text-gray-600">Complete your registration to start offering services on our platform</p>
                </div>

                {/* Main Card Container */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Progress Bar */}
                    <div className="p-8">
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="flex items-center">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : 'border-gray-300 text-gray-500'
                                            }`}>
                                            {currentStep > step.id ? (
                                                <FiCheck className="w-5 h-5" />
                                            ) : (
                                                <span className="text-sm font-medium">{step.id}</span>
                                            )}
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`w-16 h-0.5 mx-2 ${currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'
                                                }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-gray-900">{steps[currentStep - 1]?.title}</h2>
                                <p className="text-sm text-gray-600">Step {currentStep} of {steps.length}</p>
                            </div>
                        </div>

                        {/* Step Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderStepContent()}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                            <BoopWrapper>
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <FiArrowLeft className="w-4 h-4 mr-2" />
                                    Previous
                                </button>
                            </BoopWrapper>

                            {currentStep < steps.length ? (
                                <BoopWrapper>
                                    <button
                                        onClick={nextStep}
                                        className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200"
                                    >
                                        Next
                                        <FiArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </BoopWrapper>
                            ) : (
                                <BoopWrapper>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200"
                                    >
                                        Complete Registration
                                        <FiCheck className="w-4 h-4 ml-2" />
                                    </button>
                                </BoopWrapper>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
