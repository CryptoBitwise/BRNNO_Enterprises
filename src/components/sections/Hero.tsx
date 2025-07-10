"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import useInView from '@/hooks/useInView';
import type { RefObject } from 'react';

export default function Hero() {
    const router = useRouter();
    const [zip, setZip] = useState("");
    const [error, setError] = useState("");

    // Simple US ZIP or ZIP+4 validator
    const zipRegex = /^\d{5}(?:-\d{4})?$/;

    const handleSearch = () => {
        const trimmedZip = zip.trim();
        if (!trimmedZip) {
            setError("Please enter a ZIP code.");
            return;
        }
        if (!zipRegex.test(trimmedZip)) {
            setError("Please enter a valid ZIP code (e.g. 12345 or 12345-6789).");
            return;
        }
        setError("");
        // Navigate to search results page
        router.push(`/search?zip=${encodeURIComponent(trimmedZip)}`);
    };

    const onBlur = () => {
        if (zip && !zipRegex.test(zip.trim())) {
            setError("Invalid format. Use 12345 or 12345-6789.");
        } else {
            setError("");
        }
    };

    // Add in-view animation
    const [ref, inView] = useInView({ threshold: 0.3 }) as [RefObject<HTMLDivElement>, boolean];

    return (
        <section
            className="relative bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        >
            <div className="bg-black/50">
                <div
                    ref={ref}
                    className="px-6 py-16 sm:py-24 lg:py-32 max-w-3xl mx-auto text-center text-white"
                >
                    <h1
                        className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 ${inView ? 'animate-fadeInUp' : 'opacity-100'}`}
                        style={{ animationDelay: '100ms' }}
                    >
                        Find Trusted Detailers Near You
                    </h1>

                    <p
                        className={`text-base sm:text-lg lg:text-xl mb-8 ${inView ? 'animate-fadeInUp' : 'opacity-100'}`}
                        style={{ animationDelay: '300ms' }}
                    >
                        Compare services, read reviews, and book your appointment in seconds.
                    </p>

                    <div
                        className={`w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-4 ${inView ? 'animate-fadeInUp' : 'opacity-100'}`}
                        style={{ animationDelay: '500ms' }}
                    >
                        <div className="relative flex-1">
                            <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                onBlur={onBlur}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                placeholder="Enter ZIP code"
                                aria-invalid={!!error}
                                aria-describedby="zip-error"
                                className={`
                  w-full pl-12 pr-4 py-3
                  rounded-md sm:rounded-r-none
                  text-gray-900 bg-white
                  focus:outline-none focus:ring-2
                  min-h-[44px]
                  ${error
                                        ? "ring-red-500 border-red-500"
                                        : "focus:ring-blue-500"}
                `}
                            />
                        </div>

                        <button
                            onClick={handleSearch}
                            disabled={!zip}
                            className={`
                w-full sm:w-auto
                bg-blue-500 hover:bg-blue-600 disabled:opacity-50
                text-white font-semibold
                px-6 py-3 rounded-md sm:rounded-l-none
                transition transform duration-200 ease-out
                min-h-[44px]
                hover:scale-105 active:scale-95
              `}
                        >
                            Search
                        </button>
                    </div>

                    {error && (
                        <p
                            id="zip-error"
                            className="mt-2 text-sm text-red-400"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
} 