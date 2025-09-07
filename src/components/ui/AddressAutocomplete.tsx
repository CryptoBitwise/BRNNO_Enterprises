"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiX } from "react-icons/fi";

interface AddressSuggestion {
    id: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    fullAddress: string;
}

interface AddressAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (suggestion: AddressSuggestion) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    required?: boolean;
}

// Mock address suggestions - in production, this would come from Google Places API
const mockAddressSuggestions = [
    { id: "1", address: "123 Main St", city: "Saratoga Springs", state: "UT", zip: "84045", fullAddress: "123 Main St, Saratoga Springs, UT 84045" },
    { id: "2", address: "456 State St", city: "Lehi", state: "UT", zip: "84043", fullAddress: "456 State St, Lehi, UT 84043" },
    { id: "3", address: "789 Center St", city: "American Fork", state: "UT", zip: "84003", fullAddress: "789 Center St, American Fork, UT 84003" },
    { id: "4", address: "321 Oak Ave", city: "Pleasant Grove", state: "UT", zip: "84062", fullAddress: "321 Oak Ave, Pleasant Grove, UT 84062" },
    { id: "5", address: "654 Pine Rd", city: "Highland", state: "UT", zip: "84003", fullAddress: "654 Pine Rd, Highland, UT 84003" },
    { id: "6", address: "987 Maple Dr", city: "Orem", state: "UT", zip: "84057", fullAddress: "987 Maple Dr, Orem, UT 84057" },
    { id: "7", address: "147 Cedar Ln", city: "Provo", state: "UT", zip: "84604", fullAddress: "147 Cedar Ln, Provo, UT 84604" },
    { id: "8", address: "258 Elm St", city: "Spanish Fork", state: "UT", zip: "84660", fullAddress: "258 Elm St, Spanish Fork, UT 84660" },
    { id: "9", address: "369 Birch Way", city: "Springville", state: "UT", zip: "84663", fullAddress: "369 Birch Way, Springville, UT 84663" },
    { id: "10", address: "741 Aspen Cir", city: "Mapleton", state: "UT", zip: "84664", fullAddress: "741 Aspen Cir, Mapleton, UT 84664" },
];

export default function AddressAutocomplete({
    value,
    onChange,
    onSelect,
    placeholder = "Enter address...",
    className = "",
    disabled = false,
    error = false,
    required = false
}: AddressAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter suggestions based on input value
    useEffect(() => {
        if (!value.trim()) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);

        // Simulate API delay
        const timer = setTimeout(() => {
            const filtered = mockAddressSuggestions.filter(suggestion =>
                suggestion.fullAddress.toLowerCase().includes(value.toLowerCase()) ||
                suggestion.address.toLowerCase().includes(value.toLowerCase()) ||
                suggestion.city.toLowerCase().includes(value.toLowerCase()) ||
                suggestion.zip.includes(value)
            ).slice(0, 5); // Limit to 5 suggestions

            setSuggestions(filtered);
            setIsOpen(filtered.length > 0);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [value]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setHighlightedIndex(prev =>
                        prev < suggestions.length - 1 ? prev + 1 : prev
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                    break;
                case "Enter":
                    e.preventDefault();
                    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
                        handleSelect(suggestions[highlightedIndex]);
                    }
                    break;
                case "Escape":
                    setIsOpen(false);
                    setHighlightedIndex(-1);
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, suggestions, highlightedIndex]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(e.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (suggestion: AddressSuggestion) => {
        onChange(suggestion.fullAddress);
        onSelect?.(suggestion);
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setHighlightedIndex(-1);
    };

    const handleInputFocus = () => {
        if (suggestions.length > 0) {
            setIsOpen(true);
        }
    };

    const clearInput = () => {
        onChange("");
        setSuggestions([]);
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.focus();
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
                        w-full pl-10 pr-10 py-3 border rounded-lg
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all duration-200
                        ${error
                            ? "border-red-500 ring-red-200 dark:ring-red-400"
                            : "border-gray-300 dark:border-gray-600"
                        }
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                />

                {/* Clear button */}
                {value && !disabled && (
                    <button
                        onClick={clearInput}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        type="button"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                )}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                    >
                        {suggestions.map((suggestion, index) => (
                            <motion.button
                                key={suggestion.id}
                                onClick={() => handleSelect(suggestion)}
                                className={`
                                    w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700
                                    transition-colors duration-150 flex items-center gap-3
                                    ${highlightedIndex === index ? "bg-gray-50 dark:bg-gray-700" : ""}
                                `}
                                whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiMapPin className="text-blue-500 h-4 w-4 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {suggestion.address}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {suggestion.city}, {suggestion.state} {suggestion.zip}
                                    </div>
                                </div>
                            </motion.button>
                        ))}

                        {suggestions.length === 0 && value.trim() && !isLoading && (
                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                No addresses found
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 