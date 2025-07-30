"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiX } from "react-icons/fi";

interface ZipCodeSuggestion {
    id: string;
    zip: string;
    city: string;
    state: string;
    county?: string;
    displayText: string;
}

interface ZipCodeAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (suggestion: ZipCodeSuggestion) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    required?: boolean;
    maxLength?: number;
}

// Mock ZIP code suggestions - in production, this would come from a ZIP code database API
const mockZipCodeSuggestions: ZipCodeSuggestion[] = [
    { id: "1", zip: "84005", city: "Saratoga Springs", state: "UT", county: "Utah", displayText: "84005 - Saratoga Springs, UT" },
    { id: "2", zip: "84043", city: "Lehi", state: "UT", county: "Utah", displayText: "84043 - Lehi, UT" },
    { id: "3", zip: "84003", city: "American Fork", state: "UT", county: "Utah", displayText: "84003 - American Fork, UT" },
    { id: "4", zip: "84062", city: "Pleasant Grove", state: "UT", county: "Utah", displayText: "84062 - Pleasant Grove, UT" },
    { id: "5", zip: "84057", city: "Orem", state: "UT", county: "Utah", displayText: "84057 - Orem, UT" },
    { id: "6", zip: "84604", city: "Provo", state: "UT", county: "Utah", displayText: "84604 - Provo, UT" },
    { id: "7", zip: "84660", city: "Spanish Fork", state: "UT", county: "Utah", displayText: "84660 - Spanish Fork, UT" },
    { id: "8", zip: "84663", city: "Springville", state: "UT", county: "Utah", displayText: "84663 - Springville, UT" },
    { id: "9", zip: "84664", city: "Mapleton", state: "UT", county: "Utah", displayText: "84664 - Mapleton, UT" },
    { id: "10", zip: "84003", city: "Highland", state: "UT", county: "Utah", displayText: "84003 - Highland, UT" },
    { id: "11", zip: "84045", city: "Saratoga Springs", state: "UT", county: "Utah", displayText: "84045 - Saratoga Springs, UT" },
    { id: "12", zip: "84058", city: "Orem", state: "UT", county: "Utah", displayText: "84058 - Orem, UT" },
    { id: "13", zip: "84097", city: "Lehi", state: "UT", county: "Utah", displayText: "84097 - Lehi, UT" },
    { id: "14", zip: "84015", city: "American Fork", state: "UT", county: "Utah", displayText: "84015 - American Fork, UT" },
    { id: "15", zip: "84032", city: "Pleasant Grove", state: "UT", county: "Utah", displayText: "84032 - Pleasant Grove, UT" },
];

export default function ZipCodeAutocomplete({
    value,
    onChange,
    onSelect,
    placeholder = "Enter ZIP code...",
    className = "",
    disabled = false,
    error = false,
    required = false,
    maxLength = 5
}: ZipCodeAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<ZipCodeSuggestion[]>([]);
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
            const filtered = mockZipCodeSuggestions.filter(suggestion =>
                suggestion.zip.includes(value) ||
                suggestion.city.toLowerCase().includes(value.toLowerCase()) ||
                suggestion.displayText.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 8); // Limit to 8 suggestions

            setSuggestions(filtered);
            setIsOpen(filtered.length > 0);
            setIsLoading(false);
        }, 200);

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

    const handleSelect = (suggestion: ZipCodeSuggestion) => {
        onChange(suggestion.zip);
        onSelect?.(suggestion);
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers
        const numericValue = e.target.value.replace(/\D/g, '');
        onChange(numericValue);
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

    // Format ZIP code for display (add dash for ZIP+4)
    const formatZipCode = (zip: string) => {
        if (zip.length >= 5) {
            return zip.slice(0, 5) + (zip.length > 5 ? `-${zip.slice(5, 9)}` : '');
        }
        return zip;
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                    ref={inputRef}
                    type="text"
                    value={formatZipCode(value)}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    maxLength={maxLength === 5 ? 10 : maxLength} // Allow for ZIP+4 format
                    className={`
                        w-full pl-10 pr-10 py-3 border rounded-lg
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
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
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
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
                                <FiMapPin className="text-pink-500 h-4 w-4 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {suggestion.zip}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {suggestion.city}, {suggestion.state}
                                    </div>
                                </div>
                            </motion.button>
                        ))}

                        {suggestions.length === 0 && value.trim() && !isLoading && (
                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                No ZIP codes found
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 