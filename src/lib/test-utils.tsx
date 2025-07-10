import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock Firebase for testing
jest.mock('@/lib/firebaseClient', () => ({
    authClient: {
        currentUser: null,
        onAuthStateChanged: jest.fn(),
    },
    analytics: null,
}));

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Test data
export const mockUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
};

export const mockBooking = {
    id: 'test-booking-id',
    serviceTitle: 'Premium Detail',
    name: 'Test User',
    email: 'test@example.com',
    phone: '123-456-7890',
    date: '2025-01-15',
    time: '10:00',
    zipCode: '12345',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
};

export const mockService = {
    id: '1',
    title: 'Premium Detail',
    description: 'Complete interior and exterior detailing',
    price: 199,
    duration: '3-4 hours',
    features: ['Interior cleaning', 'Exterior wash', 'Waxing'],
    image: '/images/premium-detail.jpg',
}; 