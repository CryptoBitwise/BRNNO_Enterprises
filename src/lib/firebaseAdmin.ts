import admin from "firebase-admin";

// Initialize Firebase Admin SDK
let dbAdmin: admin.firestore.Firestore | null = null;

if (!admin.apps.length) {
    try {
        console.log("Initializing Firebase Admin...");
        console.log("Project ID:", process.env.FIREBASE_PROJECT_ID);
        console.log("Client Email:", process.env.FIREBASE_CLIENT_EMAIL);
        console.log("Private Key exists:", !!process.env.FIREBASE_PRIVATE_KEY);
        console.log("Private Key length:", process.env.FIREBASE_PRIVATE_KEY?.length || 0);

        // Validate required environment variables
        if (!process.env.FIREBASE_PROJECT_ID) {
            throw new Error("FIREBASE_PROJECT_ID environment variable is required");
        }
        if (!process.env.FIREBASE_CLIENT_EMAIL) {
            throw new Error("FIREBASE_CLIENT_EMAIL environment variable is required");
        }
        if (!process.env.FIREBASE_PRIVATE_KEY) {
            throw new Error("FIREBASE_PRIVATE_KEY environment variable is required");
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
        dbAdmin = admin.firestore();
        console.log("Firebase Admin initialized successfully");
    } catch (error) {
        console.error("Firebase Admin initialization failed:", error);
        console.error("Please check your environment variables:");
        console.error("- FIREBASE_PROJECT_ID");
        console.error("- FIREBASE_CLIENT_EMAIL");
        console.error("- FIREBASE_PRIVATE_KEY");
        dbAdmin = null;
    }
} else {
    dbAdmin = admin.firestore();
    console.log("Firebase Admin already initialized");
}

export { admin, dbAdmin };

// Helper function to verify ID tokens
export async function verifyIdToken(token: string) {
    if (!admin.apps.length) {
        throw new Error("Firebase Admin not initialized");
    }

    try {
        console.log("Verifying ID token...");
        const decoded = await admin.auth().verifyIdToken(token);
        console.log("Token verified successfully");
        return decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        throw error;
    }
} 