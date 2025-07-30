import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
              <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
                <Navbar />
                <main className="flex-1 pt-16 flex items-center justify-center pb-8">
                  {children}
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
