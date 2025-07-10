require('dotenv').config({ path: '.env.local' });
// Test script to debug Firebase Admin initialization
const admin = require('firebase-admin');

console.log('Testing Firebase Admin initialization...');
console.log('Environment variables:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Not set');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Not set');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'Set' : 'Not set');

try {
    if (!admin.apps.length) {
        console.log('Initializing Firebase Admin...');
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        console.log('Firebase Admin initialized successfully');
    } else {
        console.log('Firebase Admin already initialized');
    }

    // Test token verification (you'll need to provide a valid token)
    console.log('Firebase Admin is ready for use');
} catch (error) {
    console.error('Firebase Admin initialization failed:', error);
    process.exit(1);
} 