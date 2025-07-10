import { authClient } from '@/lib/firebaseClient';

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: Record<string, unknown>;
}

export async function callApi(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
    if (!authClient) {
        throw new Error('Authentication not available');
    }

    const token = await authClient.currentUser?.getIdToken();
    if (!token) {
        throw new Error('User not authenticated');
    }

    // Ensure endpoint starts with /api
    const apiEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;

    const response = await fetch(`${apiEndpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
} 