"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { callApi } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import BoopWrapper from "./ui/BoopWrapper";

const zipRegex = /^\d{5}(?:-\d{4})?$/;

export default function BookingForm({ serviceTitle, serviceId, onClose }) {
    const { user } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        zip: "",
        date: "",
        time: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Name is required.";
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
            errs.email = "Valid email is required.";
        if (!zipRegex.test(form.zip)) errs.zip = "Valid ZIP code required.";
        if (!form.date) errs.date = "Select a date.";
        if (!form.time) errs.time = "Select a time.";
        return errs;
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if user is authenticated
        if (!user) {
            alert("Please sign in to book a service.");
            onClose();
            router.push("/signin");
            return;
        }

        const validation = validate();
        if (Object.keys(validation).length) {
            setErrors(validation);
            return;
        }
        setErrors({});
        setLoading(true);

        try {
            // 1) Persist booking to Firestore with secure API call
            const bookingData = await callApi("/api/book", {
                method: "POST",
                body: JSON.stringify({
                    serviceId,
                    ...form,
                }),
            });

            // 2) Send confirmation email with secure API call
            try {
                await callApi("/api/send-confirmation", {
                    method: "POST",
                    body: JSON.stringify({
                        email: form.email,
                        name: form.name,
                        serviceTitle,
                        date: form.date,
                        time: form.time,
                    }),
                });
                console.log("Email confirmation sent successfully");
            } catch (error) {
                console.warn("Email send failed:", error);
                // Don't fail the booking if email fails
            }

            // 3) Close modal and redirect to thank-you
            onClose();
            window.location.href = `/thank-you?bookingId=${bookingData.id}`;
        } catch (error) {
            console.error("Booking error:", error);
            alert(error.message || "Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ backdropFilter: 'blur(6px)' }}
            >
                {/* Backdrop only, no content or button */}
                <div
                    className="absolute inset-0 bg-black/50"
                    onClick={onClose}
                    aria-label="Close modal background"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 p-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    <BoopWrapper>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-pink-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400"
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </BoopWrapper>

                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100"
                    >
                        Book: {serviceTitle}
                    </motion.h2>

                    {!user && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-yellow-100 border border-yellow-400 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded mb-4"
                        >
                            Please sign in to book this service.
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { label: "Name", name: "name", type: "text" },
                            { label: "Email", name: "email", type: "email" },
                            { label: "ZIP Code", name: "zip", type: "text" },
                            { label: "Date", name: "date", type: "date" },
                            { label: "Time", name: "time", type: "time" },
                        ].map(({ label, name, type }, index) => (
                            <motion.div
                                key={name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
                                    {label}
                                </label>
                                <motion.input
                                    name={name}
                                    type={type}
                                    value={form[name]}
                                    onChange={handleChange}
                                    disabled={loading}
                                    whileFocus={{ scale: 1.02 }}
                                    className={`
                                        w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800
                                        text-gray-900 dark:text-gray-100
                                        focus:outline-none focus:ring-2
                                        ${errors[name]
                                            ? "border-red-500 ring-red-200 dark:ring-red-400"
                                            : "border-gray-300 dark:border-gray-600 ring-blue-200 dark:ring-blue-400"}
                                        ${loading ? "opacity-50 cursor-not-allowed" : ""}
                                    `}
                                />
                                <AnimatePresence>
                                    {errors[name] && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-red-500 dark:text-red-400 text-sm mt-1"
                                        >
                                            {errors[name]}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <BoopWrapper>
                                <button
                                    type="submit"
                                    disabled={!user || loading}
                                    className="
                                        w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-semibold
                                        py-2 rounded-md transition-colors
                                    "
                                >
                                    {loading
                                        ? "Processing..."
                                        : user
                                            ? "Confirm Booking"
                                            : "Sign In to Book"
                                    }
                                </button>
                            </BoopWrapper>
                        </motion.div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
} 