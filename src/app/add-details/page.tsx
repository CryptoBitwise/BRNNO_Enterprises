"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BoopWrapper from "@/components/ui/BoopWrapper";
import { FiArrowLeft, FiTruck } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/components/Toast";

const types = ["Car", "Truck", "Watercraft & RV", "Motorcycle"];

// Define proper types for vehicle data
type VehicleData = {
    types?: string[];
    makes?: string[];
    models?: Record<string, string[]>;
    hullTypes?: string[];
    rvTypes?: string[];
    cabStyles?: string[];
    bedLengths?: string[];
    payloadClasses?: string[];
    engineSizes?: string[];
};

type VehicleDataType = Record<string, VehicleData>;

// Vehicle data structure
const vehicleData: VehicleDataType = {
    Car: {
        types: ["Convertible", "Coupe", "Hatchback", "Sedan", "Sports Car", "SUV", "Van", "Wagon"],
        makes: ["Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Dodge", "Ford", "Honda", "Hyundai", "Infiniti", "Jeep", "Kia", "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "Nissan", "Porsche", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"],
        models: {
            Ford: ["Bronco", "Edge", "EcoSport", "Escape", "Expedition", "Explorer", "Focus", "Fusion", "Mustang"],
            Toyota: ["4Runner", "Avalon", "Camry", "C-HR", "Corolla", "Highlander", "Prius", "RAV4", "Sienna", "Venza"],
            Honda: ["Accord", "Clarity", "Civic", "CR-V", "Fit", "HR-V", "Insight", "Odyssey", "Passport", "Pilot"],
            Chevrolet: ["Bolt", "Camaro", "Corvette", "Equinox", "Malibu", "Sonic", "Spark", "Suburban", "Tahoe", "Traverse"],
            BMW: ["3 Series", "5 Series", "i3", "i8", "M3", "M5", "X1", "X3", "X5", "X7"],
            Tesla: ["Model 3", "Model S", "Model X", "Model Y", "Roadster"],
            Nissan: ["Altima", "Ariya", "Kicks", "Leaf", "Maxima", "Murano", "Pathfinder", "Rogue", "Sentra", "Versa"]
        }
    },
    "Watercraft & RV": {
        types: ["Cabin Cruiser", "Fishing Boat", "Jet Ski", "Motorboat", "Pontoon", "Sailboat", "Speedboat", "Yacht", "Class A RV", "Class B RV", "Class C RV", "Travel Trailer", "Fifth Wheel", "Pop-up Camper", "Toy Hauler"],
        makes: ["Bayliner", "Boston Whaler", "Chaparral", "Crownline", "Four Winns", "Grady-White", "Larson", "Regal", "Sea Ray", "Stingray", "Airstream", "Coachmen", "Forest River", "Jayco", "Keystone", "Newmar", "Thor", "Winnebago"],
        hullTypes: ["Aluminum", "Catamaran", "Deep V", "Fiberglass", "Flat Bottom", "Modified V", "Pontoon", "Steel", "Tunnel Hull", "V-Hull"],
        rvTypes: ["Class A", "Class B", "Class C", "Travel Trailer", "Fifth Wheel", "Pop-up", "Toy Hauler"]
    },
    Motorcycle: {
        types: ["Adventure", "Cruiser", "Custom", "Dirt", "Dual Sport", "Naked", "Scooter", "Sport", "Sport Touring", "Touring"],
        makes: ["Aprilia", "BMW", "Ducati", "Harley-Davidson", "Honda", "Indian", "Kawasaki", "KTM", "Moto Guzzi", "Royal Enfield", "Suzuki", "Triumph", "Victory", "Yamaha"],
        engineSizes: ["1000cc", "1100cc", "1200cc", "1300cc", "1500cc", "1800cc", "2000cc+", "250cc", "500cc", "600cc", "750cc"]
    },
    Truck: {
        cabStyles: ["Crew", "Extended", "Mega", "Quad", "Regular"],
        bedLengths: ["Extra Long (8'6\")", "Long (8')", "Short (5'5\")", "Standard (6'5\")"],
        payloadClasses: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Commercial", "Heavy Duty", "Light Duty", "Medium Duty"],
        makes: ["Chevrolet", "Dodge", "Ford", "Freightliner", "GMC", "Honda", "International", "Isuzu", "Kenworth", "Mack", "Mazda", "Mitsubishi", "Nissan", "Peterbilt", "Toyota"],
        models: {
            Ford: ["F-150", "F-250", "F-350", "F-450", "F-550", "F-650", "F-750", "Maverick", "Ranger"],
            Chevrolet: ["Colorado", "Express", "S10", "Silverado 1500", "Silverado 2500", "Silverado 3500"],
            GMC: ["Canyon", "Savana", "Sierra 1500", "Sierra 2500", "Sierra 3500", "Sonoma"],
            Dodge: ["Dakota", "Ram 1500", "Ram 2500", "Ram 3500", "Ram 4500", "Ram 5500"]
        }
    }
};

export default function AddDetailsPage() {
    const [selected, setSelected] = useState("Car");
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <motion.main
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                    >
                        <BoopWrapper>
                            <button
                                onClick={() => router.back()}
                                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                            >
                                <FiArrowLeft className="mr-2" />
                                Back
                            </button>
                        </BoopWrapper>
                    </motion.div>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <FiTruck className="h-8 w-8 text-pink-500 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Add Vehicle Details
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Tell us about your vehicle to help us provide the best service recommendations
                            and ensure we have all the information needed for your appointment.
                        </p>
                    </motion.div>

                    {/* Vehicle Type Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                            Vehicle Type
                        </h3>
                        <div className="flex gap-3 flex-wrap justify-center">
                            {types.map((type, index) => (
                                <motion.div
                                    key={type}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                >
                                    <BoopWrapper>
                                        <button
                                            onClick={() => setSelected(type)}
                                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${selected === type
                                                ? "bg-pink-500 text-white shadow-lg"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:border-pink-300"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    </BoopWrapper>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Dynamic Form */}
                    <DetailsForm type={selected} />
                </motion.main>
            </div>
        </div>
    );
}

function DetailsForm({ type }: { type: string }) {
    const { user } = useAuth();
    const { addVehicle, saving } = useProfile();
    const { showToast } = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState({
        make: "",
        model: "",
        year: "",
        extra: "",
        subType: "",
        extra2: "",
        vin: ""
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.uid) {
            showToast("Please sign in to save vehicle details.", "error");
            return;
        }

        // Validate required fields
        if (!formData.make || !formData.model || !formData.year) {
            showToast("Please fill in all required fields.", "error");
            return;
        }

        const vehicle = {
            id: Date.now().toString(), // Simple ID generation
            type: type as "Car" | "Truck" | "Watercraft & RV" | "Motorcycle",
            make: formData.make,
            model: formData.model,
            year: formData.year,
            vin: formData.vin || undefined,
            subType: formData.subType || undefined,
            extra: formData.extra || undefined,
            extra2: formData.extra2 || undefined
        };

        const success = await addVehicle(vehicle);

        if (success) {
            showToast("Vehicle added successfully!", "success");
            router.push("/account");
        } else {
            showToast("Failed to add vehicle. Please try again.", "error");
        }
    };

    const getData = (): VehicleData => {
        return vehicleData[type as keyof typeof vehicleData] || {};
    };

    const data = getData();

    return (
        <motion.form
            className="space-y-4 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
        >
            {/* Vehicle Type Dropdown */}
            {data.types && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {type} Type
                    </label>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        value={formData.subType}
                        onChange={(e) => handleInputChange("subType", e.target.value)}
                    >
                        <option value="">Select {type} Type</option>
                        {data.types.map((typeOption: string) => (
                            <option key={typeOption} value={typeOption}>{typeOption}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Make Dropdown */}
            {data.makes && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Make
                    </label>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        value={formData.make}
                        onChange={(e) => handleInputChange("make", e.target.value)}
                    >
                        <option value="">Select Make</option>
                        {data.makes.map((make: string) => (
                            <option key={make} value={make}>{make}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Model Dropdown (filtered by make) */}
            {data.models && formData.make && data.models[formData.make as keyof typeof data.models] && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model
                    </label>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        value={formData.model}
                        onChange={(e) => handleInputChange("model", e.target.value)}
                    >
                        <option value="">Select Model</option>
                        {data.models[formData.make as keyof typeof data.models].map((model: string) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Year Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                </label>
                <input
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    placeholder="e.g., 2020"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                />
            </div>

            {/* VIN Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    VIN (Optional)
                </label>
                <input
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    placeholder="e.g., 1G1RC6E30D0123456"
                    value={formData.vin}
                    onChange={(e) => handleInputChange("vin", e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Vehicle Identification Number - helps with service history and recalls
                </p>
            </div>

            {/* Type-specific dropdowns */}
            {type === "Watercraft & RV" && data.hullTypes && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hull Type
                    </label>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        value={formData.extra}
                        onChange={(e) => handleInputChange("extra", e.target.value)}
                    >
                        <option value="">Select Hull Type</option>
                        {data.hullTypes.map((hullType: string) => (
                            <option key={hullType} value={hullType}>{hullType}</option>
                        ))}
                    </select>
                </div>
            )}

            {type === "Motorcycle" && data.engineSizes && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Engine Size
                    </label>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        value={formData.extra}
                        onChange={(e) => handleInputChange("extra", e.target.value)}
                    >
                        <option value="">Select Engine Size</option>
                        {data.engineSizes.map((engineSize: string) => (
                            <option key={engineSize} value={engineSize}>{engineSize}</option>
                        ))}
                    </select>
                </div>
            )}

            {type === "Truck" && (
                <>
                    {data.cabStyles && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cab Style
                            </label>
                            <select
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                value={formData.extra}
                                onChange={(e) => handleInputChange("extra", e.target.value)}
                            >
                                <option value="">Select Cab Style</option>
                                {data.cabStyles.map((cabStyle: string) => (
                                    <option key={cabStyle} value={cabStyle}>{cabStyle}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {data.bedLengths && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bed Length
                            </label>
                            <select
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                value={formData.extra2}
                                onChange={(e) => handleInputChange("extra2", e.target.value)}
                            >
                                <option value="">Select Bed Length</option>
                                {data.bedLengths.map((bedLength: string) => (
                                    <option key={bedLength} value={bedLength}>{bedLength}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </>
            )}

            {/* Submit Button */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
            >
                <BoopWrapper>
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            "Save Details"
                        )}
                    </button>
                </BoopWrapper>
            </motion.div>
        </motion.form>
    );
} 