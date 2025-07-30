require('dotenv').config({ path: '.env.local' });

console.log('Testing Firebase Browser Initialization...');

// Simulate browser environment
global.window = {
    location: { protocol: 'https:' },
    navigator: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
};
global.document = {
    createElement: () => ({}),
    getElementsByTagName: () => []
};

try {
    const { initializeApp } = require('firebase/app');
    const { getAuth } = require('firebase/auth');
    const { getFirestore } = require('firebase/firestore');
    const { getAnalytics, isSupported } = require('firebase/analytics');

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    console.log('Initializing Firebase app...');
    const app = initializeApp(firebaseConfig);

    console.log('Initializing Auth...');
    const auth = getAuth(app);

    console.log('Initializing Firestore...');
    const db = getFirestore(app);

    console.log('Testing Analytics initialization...');

    // Test Analytics with error handling (like in the fixed firebaseClient.ts)
    isSupported().then((analyticsSupported) => {
        if (analyticsSupported) {
            try {
                const analytics = getAnalytics(app);
                console.log('✅ Firebase Analytics initialized successfully');
            } catch (error) {
                console.warn('⚠️ Failed to initialize Firebase Analytics:', error.message);
                console.log('This is expected if Analytics is not enabled in your Firebase project');
            }
        } else {
            console.warn('⚠️ Firebase Analytics is not supported in this environment');
        }
    }).catch((error) => {
        console.warn('⚠️ Failed to check Firebase Analytics support:', error.message);
    });

    console.log('✅ All Firebase services initialized successfully');
    console.log('✅ No installation errors detected');

} catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    process.exit(1);
} 