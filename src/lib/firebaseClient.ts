import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Import mock clients for development mode
import { mockAuthClient, MockUser } from "./mockAuthClient";
import { mockFirestoreClient } from "./mockFirestoreClient";

// Check if we're in development mode (no Firebase config)
const isDevelopmentMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your-api-key-here' ||
    process.env.NODE_ENV === 'development';

// Firebase configuration - using environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: ReturnType<typeof initializeApp> | null = null;
let authClient: ReturnType<typeof getAuth> | null = null;
let dbClient: ReturnType<typeof getFirestore> | null = null;
let analytics: ReturnType<typeof getAnalytics> | null = null;

if (isDevelopmentMode) {
    console.log('🔧 Development Mode: Using mock Firebase clients');
    console.log('🔧 To use real Firebase, set up your .env.local file with Firebase credentials');

    // Use mock clients
    authClient = mockAuthClient as any;
    dbClient = mockFirestoreClient as any;
} else if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
        console.log('Firebase: Initializing with config:', firebaseConfig.projectId);
        app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
        authClient = getAuth(app);
        dbClient = getFirestore(app);
        console.log('Firebase initialized successfully');
        console.log('Firebase: authClient created:', !!authClient);
    } catch (error) {
        console.error('Firebase initialization error:', error);
        console.log('🔧 Falling back to mock clients due to Firebase error');
        authClient = mockAuthClient as any;
        dbClient = mockFirestoreClient as any;
    }

    // Initialize Analytics only in browser and with proper error handling
    if (typeof window !== "undefined" && app) {
        // Use Promise to handle the async isSupported check
        isSupported().then((analyticsSupported) => {
            if (analyticsSupported) {
                try {
                    analytics = getAnalytics(app);
                    console.log('Firebase Analytics initialized successfully');
                } catch (error) {
                    console.warn('Failed to initialize Firebase Analytics:', error);
                }
            } else {
                console.warn('Firebase Analytics is not supported in this environment');
            }
        }).catch((error) => {
            console.warn('Failed to check Firebase Analytics support:', error);
        });
    }
} else {
    console.warn('Firebase configuration not found. Using mock clients for development.');
    console.warn('To use real Firebase, create a .env.local file with your Firebase config.');
    authClient = mockAuthClient as any;
    dbClient = mockFirestoreClient as any;
}

export { authClient, dbClient, analytics }; 