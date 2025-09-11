// Mock authentication client for development without Firebase
// This allows the app to run without Firebase credentials

export interface MockUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}

export interface MockAuth {
    currentUser: MockUser | null;
    onAuthStateChanged: (callback: (user: MockUser | null) => void) => () => void;
    signInWithEmailAndPassword: (email: string, password: string) => Promise<{ user: MockUser }>;
    signOut: () => Promise<void>;
    createUserWithEmailAndPassword: (email: string, password: string) => Promise<{ user: MockUser }>;
}

// Mock user data for development
const mockUsers: MockUser[] = [
    {
        uid: 'mock-user-1',
        email: 'demo@example.com',
        displayName: 'Demo User',
        photoURL: null,
        emailVerified: true
    },
    {
        uid: 'mock-provider-1',
        email: 'provider@example.com',
        displayName: 'Demo Provider',
        photoURL: null,
        emailVerified: true
    }
];

class MockAuthClient implements MockAuth {
    private currentUser: MockUser | null = null;
    private listeners: ((user: MockUser | null) => void)[] = [];

    constructor() {
        // Auto-login with demo user for development
        this.currentUser = mockUsers[0];
        console.log('🔧 Mock Auth: Development mode enabled - auto-logged in as demo user');
    }

    onAuthStateChanged(callback: (user: MockUser | null) => void) {
        this.listeners.push(callback);
        // Immediately call with current user
        callback(this.currentUser);

        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    async signInWithEmailAndPassword(email: string, password: string) {
        console.log('🔧 Mock Auth: Sign in attempt:', email);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = mockUsers.find(u => u.email === email);
        if (user) {
            this.currentUser = user;
            this.notifyListeners();
            return { user };
        } else {
            throw new Error('User not found');
        }
    }

    async signOut() {
        console.log('🔧 Mock Auth: Signing out');
        this.currentUser = null;
        this.notifyListeners();
    }

    async createUserWithEmailAndPassword(email: string, password: string) {
        console.log('🔧 Mock Auth: Creating user:', email);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const newUser: MockUser = {
            uid: `mock-user-${Date.now()}`,
            email,
            displayName: email.split('@')[0],
            photoURL: null,
            emailVerified: true
        };

        mockUsers.push(newUser);
        this.currentUser = newUser;
        this.notifyListeners();

        return { user: newUser };
    }

    private notifyListeners() {
        this.listeners.forEach(callback => callback(this.currentUser));
    }
}

// Create mock auth client
export const mockAuthClient = new MockAuthClient();

// Export as default for compatibility
export default mockAuthClient;
