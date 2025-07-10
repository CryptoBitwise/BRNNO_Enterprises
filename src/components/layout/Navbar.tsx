"use client";

import Link from "next/link";
import AvatarMenu from "@/components/AvatarMenu";
import { FiHome, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { BoopButton } from "@/components/ui/BoopWrapper";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm fixed w-full z-10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    Reviva
                </span>

                {/* Desktop Navigation Links */}
                <div className="hidden sm:flex items-center space-x-4">
                    <BoopButton>
                        <Link
                            href="/"
                            className="flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-md transition-colors duration-200 font-medium"
                        >
                            <FiHome className="h-4 w-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                    </BoopButton>
                </div>

                {/* Hamburger Icon for Mobile */}
                <button
                    className="sm:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {mobileMenuOpen ? (
                        <FiX className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                    ) : (
                        <FiMenu className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                    )}
                </button>

                {/* Avatar Menu (always visible) */}
                <AvatarMenu />
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden bg-white dark:bg-gray-800 shadow-md border-t border-gray-100 dark:border-gray-700 animate-fade-in-down">
                    <div className="px-6 py-4 flex flex-col space-y-2">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-md transition-colors duration-200 font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <FiHome className="h-5 w-5" />
                            <span>Home</span>
                        </Link>
                        {/* Add more nav links here if needed */}
                    </div>
                </div>
            )}
        </nav>
    );
}

// Add this to your global CSS for a simple fade-in-down animation:
// .animate-fade-in-down {
//   animation: fadeInDown 0.25s cubic-bezier(0.4, 0, 0.2, 1);
// }
// @keyframes fadeInDown {
//   from { opacity: 0; transform: translateY(-16px); }
//   to { opacity: 1; transform: translateY(0); }
// }