"use client";

import Link from "next/link";
import AvatarMenu from "@/components/AvatarMenu";
import { FiHome, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { BoopButton } from "@/components/ui/BoopWrapper";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-black/80 backdrop-blur-xl border-b border-gray-800 shadow-2xl fixed w-full z-10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <span className="text-2xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                    BRNNO
                </span>

                {/* Desktop Navigation Links */}
                <div className="hidden sm:flex items-center space-x-4">
                    <BoopButton>
                        <Link
                            href="/"
                            className="flex items-center space-x-1 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 font-medium border border-transparent hover:border-gray-700"
                        >
                            <FiHome className="h-4 w-4" />
                            <span className="hidden sm:inline">HOME</span>
                        </Link>
                    </BoopButton>
                    <BoopButton>
                        <Link
                            href="/services"
                            className="flex items-center space-x-1 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 font-medium border border-transparent hover:border-gray-700"
                        >
                            <span className="hidden sm:inline">FIND SERVICES</span>
                        </Link>
                    </BoopButton>
                    <BoopButton>
                        <Link
                            href="/provider-register"
                            className="flex items-center space-x-1 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 font-medium border border-transparent hover:border-gray-700"
                        >
                            <span className="hidden sm:inline">BECOME A PROVIDER</span>
                        </Link>
                    </BoopButton>
                </div>

                {/* Hamburger Icon for Mobile */}
                <button
                    className="sm:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-800 hover:bg-gray-800/50 transition-all duration-200"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {mobileMenuOpen ? (
                        <FiX className="h-6 w-6 text-gray-300" />
                    ) : (
                        <FiMenu className="h-6 w-6 text-gray-300" />
                    )}
                </button>

                {/* Avatar Menu (always visible) */}
                <AvatarMenu />
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden bg-black/90 backdrop-blur-xl border-t border-gray-800 shadow-2xl animate-fade-in-down">
                    <div className="px-6 py-4 flex flex-col space-y-2">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 font-medium border border-transparent hover:border-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <FiHome className="h-5 w-5" />
                            <span>HOME</span>
                        </Link>
                        <Link
                            href="/services"
                            className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 font-medium border border-transparent hover:border-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span>FIND SERVICES</span>
                        </Link>
                        <Link
                            href="/provider-register"
                            className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 font-medium border border-transparent hover:border-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span>BECOME A PROVIDER</span>
                        </Link>
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