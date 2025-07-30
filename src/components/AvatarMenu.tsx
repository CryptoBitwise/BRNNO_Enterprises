"use client";

import { useState, useRef, useEffect } from "react";
import { FiUser, FiBookOpen, FiSettings, FiLogIn, FiLogOut, FiShield, FiMapPin } from "react-icons/fi";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { authClient } from "@/lib/firebaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function AvatarMenu() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Check admin status
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (authClient?.currentUser) {
                try {
                    const { claims } = await authClient.currentUser.getIdTokenResult();
                    setIsAdmin(!!claims.admin);
                } catch (error) {
                    console.error("Error checking admin status:", error);
                }
            }
        };

        checkAdminStatus();
    }, [user]);

    // Close menu on outside click
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        window.addEventListener("click", onClick);
        return () => window.removeEventListener("click", onClick);
    }, []);

    return (
        <div className="relative" ref={ref}>
            {/* Avatar button - enhanced with hover effects */}
            <motion.button
                onClick={() => setOpen((o) => !o)}
                className="
                    w-12 h-12 rounded-full bg-gray-100
                    flex items-center justify-center
                    hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
                    transition-all duration-200 ease-out
                    min-w-[48px] min-h-[48px]
                    hover:ring-2 hover:ring-pink-400 hover:scale-105
                    active:scale-95
                "
                aria-label="Account menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                <FiUser className="text-gray-600 transition-colors duration-200" size={24} />
            </motion.button>

            {/* Dropdown - enhanced with Framer Motion */}
            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            duration: 0.2
                        }}
                        className="
                            absolute right-0 mt-2 w-48 bg-white border border-gray-200
                            rounded-lg shadow-xl overflow-hidden z-50
                            sm:w-40
                            max-w-[calc(100vw-2rem)]
                            backdrop-blur-sm bg-white/95
                        "
                    >
                        {user ? (
                            <>
                                <motion.li
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Link
                                        href="/my-bookings"
                                        className="flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-pink-600 transition-all duration-200 min-h-[48px] group"
                                        onClick={() => setOpen(false)}
                                    >
                                        <FiBookOpen className="mr-3 text-lg transition-transform duration-200 group-hover:scale-110" />
                                        <span className="text-sm font-medium">My Bookings</span>
                                    </Link>
                                </motion.li>
                                <motion.li
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <Link
                                        href="/account/settings"
                                        className="flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-pink-600 transition-all duration-200 min-h-[48px] group"
                                        onClick={() => setOpen(false)}
                                    >
                                        <FiSettings className="mr-3 text-lg transition-transform duration-200 group-hover:scale-110" />
                                        <span className="text-sm font-medium">Settings</span>
                                    </Link>
                                </motion.li>
                                <motion.li
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Link
                                        href="/account"
                                        className="flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-pink-600 transition-all duration-200 min-h-[48px] group"
                                        onClick={() => setOpen(false)}
                                    >
                                        <FiUser className="mr-3 text-lg transition-transform duration-200 group-hover:scale-110" />
                                        <span className="text-sm font-medium">Account</span>
                                    </Link>
                                </motion.li>
                                <motion.li
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Link
                                        href="/locations"
                                        className="flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-pink-600 transition-all duration-200 min-h-[48px] group"
                                        onClick={() => setOpen(false)}
                                    >
                                        <FiMapPin className="mr-3 text-lg transition-transform duration-200 group-hover:scale-110" />
                                        <span className="text-sm font-medium">Saved Locations</span>
                                    </Link>
                                </motion.li>
                                {isAdmin && (
                                    <motion.li
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Link
                                            href="/admin"
                                            className="flex items-center px-4 py-4 text-pink-600 hover:bg-pink-50 transition-all duration-200 min-h-[48px] group"
                                            onClick={() => setOpen(false)}
                                        >
                                            <FiShield className="mr-3 text-lg transition-transform duration-200 group-hover:scale-110" />
                                            <span className="text-sm font-medium">Admin Dashboard</span>
                                        </Link>
                                    </motion.li>
                                )}
                                <motion.li
                                    className="border-t border-gray-100"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 }}
                                >
                                    <button
                                        onClick={() => {
                                            if (authClient) {
                                                signOut(authClient);
                                            }
                                            setOpen(false);
                                        }}
                                        className="w-full text-left flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-all duration-200 min-h-[48px] group"
                                    >
                                        <FiLogOut className="mr-3 text-lg transition-transform duration-200 group-hover:scale-110" />
                                        <span className="text-sm font-medium">Sign Out</span>
                                    </button>
                                </motion.li>
                            </>
                        ) : (
                            <motion.li
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Link
                                    href="/signin"
                                    className="flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-pink-600 transition-all duration-200 min-h-[48px] group"
                                    onClick={() => setOpen(false)}
                                >
                                    <FiLogIn className="mr-3 text-lg transition-transform duration-200 group-hover:scale-110" />
                                    <span className="text-sm font-medium">Sign In</span>
                                </Link>
                            </motion.li>
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}