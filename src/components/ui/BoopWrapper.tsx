"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BoopWrapperProps {
    children: ReactNode;
    className?: string;
    scale?: number;
    rotate?: number;
    duration?: number;
    stiffness?: number;
    damping?: number;
}

export default function BoopWrapper({
    children,
    className = "",
    scale = 1.03,
    rotate = 0,
    duration = 0.15,
    stiffness = 300,
    damping = 20
}: BoopWrapperProps) {
    return (
        <motion.div
            whileHover={{
                scale: scale,
                rotate: rotate
            }}
            whileTap={{
                scale: 0.95,
                rotate: rotate * 0.5 // Reduce rotation on tap
            }}
            transition={{
                type: "spring",
                stiffness,
                damping,
                duration
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Specialized variants for common use cases
export function BoopButton({ children, className = "", ...props }: BoopWrapperProps) {
    return (
        <BoopWrapper
            className={`cursor-pointer ${className}`}
            scale={1.02}
            {...props}
        >
            {children}
        </BoopWrapper>
    );
}

export function BoopIcon({ children, className = "", ...props }: BoopWrapperProps) {
    return (
        <BoopWrapper
            className={`cursor-pointer ${className}`}
            scale={1.1}
            rotate={5}
            {...props}
        >
            {children}
        </BoopWrapper>
    );
}

export function BoopCard({ children, className = "", ...props }: BoopWrapperProps) {
    return (
        <BoopWrapper
            className={`cursor-pointer ${className}`}
            scale={1.02}
            stiffness={200}
            {...props}
        >
            {children}
        </BoopWrapper>
    );
} 