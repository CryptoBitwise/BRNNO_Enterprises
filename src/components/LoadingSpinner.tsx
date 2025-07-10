"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    color?: "pink" | "white" | "gray";
    className?: string;
}

export default function LoadingSpinner({
    size = "md",
    color = "pink",
    className = ""
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8"
    };

    const colorClasses = {
        pink: "border-pink-500",
        white: "border-white",
        gray: "border-gray-500"
    };

    return (
        <motion.div
            className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin ${className}`}
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    );
}

// Enhanced loading spinner with pulsing effect
export function PulsingSpinner({
    size = "md",
    color = "pink",
    className = ""
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8"
    };

    const colorClasses = {
        pink: "bg-pink-500",
        white: "bg-white",
        gray: "bg-gray-500"
    };

    return (
        <div className={`flex space-x-1 ${className}`}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
}

// Page loading overlay
export function PageLoader() {
    return (
        <motion.div
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="bg-white rounded-lg shadow-xl p-8 border border-gray-100"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <div className="flex flex-col items-center space-y-4">
                    <PulsingSpinner size="lg" color="pink" />
                    <motion.p
                        className="text-gray-600 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Loading...
                    </motion.p>
                </div>
            </motion.div>
        </motion.div>
    );
} 