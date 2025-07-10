"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

export interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type,
    isVisible,
    onClose,
    duration = 3000
}) => {
    React.useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FiCheck className="h-5 w-5" />;
            case 'error':
                return <FiX className="h-5 w-5" />;
            case 'info':
                return <FiInfo className="h-5 w-5" />;
            default:
                return <FiAlertCircle className="h-5 w-5" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white border-green-600';
            case 'error':
                return 'bg-red-500 text-white border-red-600';
            case 'info':
                return 'bg-blue-500 text-white border-blue-600';
            default:
                return 'bg-gray-500 text-white border-gray-600';
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.3 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${getStyles()}`}
                >
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <p className="text-sm font-medium">{message}</p>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 ml-2 hover:opacity-80 transition-opacity"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Toast context for global toast management

interface ToastContextType {
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'info';
        isVisible: boolean;
    }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type, isVisible: true });
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </ToastContext.Provider>
    );
}; 