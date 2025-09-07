"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    icon?: ReactNode;
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    onClick,
    type = "button",
    className = "",
    icon,
    fullWidth = false,
}: ButtonProps) {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    const variantClasses = {
        primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 shadow-sm hover:shadow-md",
        secondary: "bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500 shadow-sm hover:shadow-md",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500 hover:border-blue-300",
        ghost: "text-gray-700 hover:bg-gray-100 focus:ring-blue-500",
        danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-sm hover:shadow-md"
    };

    const widthClass = fullWidth ? "w-full" : "";

    const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={classes}
            whileHover={{
                scale: 1.02,
                boxShadow: variant === "primary" || variant === "danger"
                    ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    : undefined
            }}
            whileTap={{
                scale: 0.95,
                rotate: variant === "primary" ? -1 : 0 // Slight rotation for primary buttons
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 20
            }}
        >
            {loading && (
                <motion.div
                    className="mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                </motion.div>
            )}
            {icon && !loading && (
                <span className="mr-2">
                    {icon}
                </span>
            )}
            {children}
        </motion.button>
    );
}

// Specialized button variants for common use cases
export function PrimaryButton(props: Omit<ButtonProps, "variant">) {
    return <Button variant="primary" {...props} />;
}

export function SecondaryButton(props: Omit<ButtonProps, "variant">) {
    return <Button variant="secondary" {...props} />;
}

export function OutlineButton(props: Omit<ButtonProps, "variant">) {
    return <Button variant="outline" {...props} />;
}

export function GhostButton(props: Omit<ButtonProps, "variant">) {
    return <Button variant="ghost" {...props} />;
}

export function DangerButton(props: Omit<ButtonProps, "variant">) {
    return <Button variant="danger" {...props} />;
}

// Icon-only button variant
export function IconButton({
    icon,
    ...props
}: Omit<ButtonProps, "variant" | "children"> & { icon: ReactNode }) {
    return (
        <Button variant="ghost" {...props}>
            {icon}
        </Button>
    );
} 