import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    const serviceAccountPath = join(process.cwd(), "serviceAccountKey.json");

    try {
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error) {
        console.error("Error loading service account:", error.message);
        console.log("Please ensure serviceAccountKey.json exists in the project root");
        process.exit(1);
    }
}

// Replace with the target user's UID
const targetUid = process.argv[2];

if (!targetUid) {
    console.error("Usage: node scripts/setAdminClaim.js <USER_UID>");
    console.log("Example: node scripts/setAdminClaim.js abc123def456");
    process.exit(1);
}

async function grantAdmin() {
    try {
        await admin.auth().setCustomUserClaims(targetUid, { admin: true });
        console.log(`✅ Granted admin privileges to user: ${targetUid}`);

        // Verify the claim was set
        const user = await admin.auth().getUser(targetUid);
        console.log(`📧 User email: ${user.email}`);
        console.log(`🔑 Custom claims:`, user.customClaims);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error granting admin privileges:", error.message);
        process.exit(1);
    }
}

grantAdmin(); 