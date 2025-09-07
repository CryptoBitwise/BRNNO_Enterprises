"use client";

import dynamic from "next/dynamic";


// Dynamically import Framer Motion components to avoid client boundary issues
const MotionDiv = dynamic(() => import("framer-motion").then((mod) => ({ default: mod.motion.div })), {
    ssr: false,
});

const MotionButton = dynamic(() => import("framer-motion").then((mod) => ({ default: mod.motion.button })), {
    ssr: false,
});

const MotionInput = dynamic(() => import("framer-motion").then((mod) => ({ default: mod.motion.input })), {
    ssr: false,
});

const MotionP = dynamic(() => import("framer-motion").then((mod) => ({ default: mod.motion.p })), {
    ssr: false,
});

const MotionH1 = dynamic(() => import("framer-motion").then((mod) => ({ default: mod.motion.h1 })), {
    ssr: false,
});

const MotionH2 = dynamic(() => import("framer-motion").then((mod) => ({ default: mod.motion.h2 })), {
    ssr: false,
});

const MotionSpan = dynamic(() => import("framer-motion").then((mod) => ({ default: mod.motion.span })), {
    ssr: false,
});

const MotionMain = dynamic(() => import("framer-motion").then((mod) => ({ default: mod.motion.main })), {
    ssr: false,
});

const AnimatePresence = dynamic(() => import("framer-motion").then((mod) => ({ default: mod.AnimatePresence })), {
    ssr: false,
});

// Export the components
export { MotionDiv, MotionButton, MotionInput, MotionP, MotionH1, MotionH2, MotionSpan, MotionMain, AnimatePresence };

// Helper function to get motion components
export const getMotionComponents = () => {
    return {
        motion: {
            div: MotionDiv,
            button: MotionButton,
            input: MotionInput,
            p: MotionP,
            h1: MotionH1,
            h2: MotionH2,
            span: MotionSpan,
            main: MotionMain,
        },
        AnimatePresence,
    };
}; 