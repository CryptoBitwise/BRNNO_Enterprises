import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BRNNO',
  description: 'The future of service booking - seamless, powerful, connected',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black dark:bg-black text-white">
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
