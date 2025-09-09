"use client";

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

interface ConditionalLayoutProps {
    children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname();
    const { user, loading } = useAuth();

    // Show loading state while auth is initializing
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-blue-500 text-lg font-light tracking-wide mb-4">INITIALIZING BRNNO...</div>
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    // Routes that should not show header and footer (landing page only when not authenticated)
    const hideHeaderFooter = pathname === '/' && !user;

    if (hideHeaderFooter) {
        // Landing page for unauthenticated users - no header/footer, full screen
        return (
            <div className="min-h-screen">
                {children}
            </div>
        );
    }

    // All other pages OR authenticated users on home page - show header and footer
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <Navbar />
            <main className="flex-1 pt-16 flex items-center justify-center pb-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}
