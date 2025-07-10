import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Check if Firebase config is available
const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const firebaseConfig = hasFirebaseConfig ? {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} : null;

let app: any = null;
let authClient: any = null;
let dbClient: any = null;
let analytics: any = null;

if (firebaseConfig) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    authClient = getAuth(app);
    dbClient = getFirestore(app);
    analytics = (typeof window !== "undefined") ? getAnalytics(app) : null;
} else {
    console.warn('Firebase configuration not found. Please create a .env.local file with your Firebase config.');
}

export { authClient, dbClient, analytics }; 