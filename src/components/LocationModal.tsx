"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMapPin, FiUser, FiFileText, FiHome, FiBriefcase, FiMapPin as FiMapPinAlt } from "react-icons/fi";
import BoopWrapper from "@/components/ui/BoopWrapper";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";

interface SavedLocation {
    id: string;
    name: string;
    address: string;
    zip: string;
    notes?: string;
    category?: 'home' | 'work' | 'other';
    isDefault?: boolean;
    createdAt: string;
}

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (location: SavedLocation) => void;
    defaultValues?: Omit<SavedLocation, 'id'> & { id?: string };
    title?: string;
}

export default function LocationModal({
    isOpen,
    onClose,
    onSave,
    defaultValues,
    title = "Save Location"
}: LocationModalProps) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [zip, setZip] = useState("");
    const [notes, setNotes] = useState("");
    const [category, setCategory] = useState<'home' | 'work' | 'other'>('other');
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
        if (defaultValues) {
            setName(defaultValues.name || "");
            setAddress(defaultValues.address || "");
            setZip(defaultValues.zip || "");
            setNotes(defaultValues.notes || "");
            setCategory(defaultValues.category || 'other');
            setIsDefault(defaultValues.isDefault || false);
        } else {
            setName("");
            setAddress("");
            setZip("");
            setNotes("");
            setCategory('other');
            setIsDefault(false);
        }
    }, [defaultValues, isOpen]);

    const handleSave = () => {
        if (!name.trim() || !address.trim()) {
            return; // Don't save if required fields are empty
        }

        const newLocation: SavedLocation = {
            id: defaultValues?.id || Date.now().toString(),
            name: name.trim(),
            address: address.trim(),
            zip: zip.trim(),
            notes: notes.trim() || undefined,
            category,
            isDefault,
            createdAt: defaultValues?.createdAt || new Date().toISOString()
        };

        onSave(newLocation);
        onClose();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
            e.preventDefault();
            handleSave();
        }
    };

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'home':
                return <FiHome className="h-4 w-4" />;
            case 'work':
                return <FiBriefcase className="h-4 w-4" />;
            default:
                return <FiMapPinAlt className="h-4 w-4" />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FiMapPin className="h-5 w-5 text-pink-500" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                            </div>
                            <BoopWrapper>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </BoopWrapper>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Location Name *
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Home, Work, etc."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['home', 'work', 'other'] as const).map((cat) => (
                                        <BoopWrapper key={cat}>
                                            <button
                                                type="button"
                                                onClick={() => setCategory(cat)}
                                                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${category === cat
                                                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-pink-300 dark:hover:border-pink-600'
                                                    }`}
                                            >
                                                {getCategoryIcon(cat)}
                                                <span className="capitalize">{cat}</span>
                                            </button>
                                        </BoopWrapper>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Address *
                                </label>
                                <AddressAutocomplete
                                    value={address}
                                    onChange={setAddress}
                                    placeholder="123 Main St, City, State"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ZIP Code
                                </label>
                                <input
                                    type="text"
                                    placeholder="12345"
                                    value={zip}
                                    onChange={(e) => setZip(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Notes
                                </label>
                                <div className="relative">
                                    <FiFileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                    <textarea
                                        placeholder="Any additional notes about this location..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <BoopWrapper>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isDefault}
                                            onChange={(e) => setIsDefault(e.target.checked)}
                                            className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Set as default location
                                        </span>
                                    </label>
                                </BoopWrapper>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <BoopWrapper>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </BoopWrapper>
                            <BoopWrapper>
                                <button
                                    onClick={handleSave}
                                    disabled={!name.trim() || !address.trim()}
                                    className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Save Location
                                </button>
                            </BoopWrapper>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 