"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

export default function PageTransition({ children, className = "" }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname} // This ensures re-animation on route changes
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for buttery smooth feel
                type: "spring",
                stiffness: 100,
                damping: 20
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Enhanced version with different animations based on route
export function RouteTransition({ children, className = "" }: PageTransitionProps) {
    const pathname = usePathname();

    // Different animations for different routes
    const getAnimation = () => {
        switch (pathname) {
            case "/":
                return {
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.95 }
                };
            case "/signin":
            case "/signup":
                return {
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 20 }
                };
            case "/admin":
                return {
                    initial: { opacity: 0, y: 30 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -30 }
                };
            default:
                return {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 }
                };
        }
    };

    const animation = getAnimation();

    return (
        <motion.div
            key={pathname}
            initial={animation.initial}
            animate={animation.animate}
            exit={animation.exit}
            transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
                damping: 20
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
} 