# Firebase Admin Debugging Guide

## 🚨 500 Error in Admin Bookings API

### Most Likely Causes

1. **Missing Environment Variables**
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

2. **Incorrect Environment Variable Names**
   - Fixed: Changed from `FIREBASE_ADMIN_*` to `FIREBASE_*` to match env.example

3. **Malformed Private Key**
   - Must include `\n` characters for line breaks
   - Should be wrapped in quotes in .env file

### 🔧 Debugging Steps

#### Step 1: Check Environment Variables

Create a `.env.local` file in your project root with:

```env
# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

#### Step 2: Test Firebase Admin Initialization

Run the test script:

```bash
node scripts/test-firebase-admin.js
```

#### Step 3: Check Server Logs

Look for these log messages when your app starts:

- ✅ "Firebase Admin initialized successfully"
- ❌ "Firebase Admin initialization failed"

#### Step 4: Test API Endpoint

Use curl or Postman to test the admin endpoint:

```bash
curl -H "Authorization: Bearer YOUR_ID_TOKEN" \
     http://localhost:3000/api/admin/bookings
```

### 🔍 Enhanced Logging Added

The updated code now includes:

- Environment variable validation
- Detailed error messages
- Token verification logging
- Private key length checking

### 🛠️ Quick Fixes

1. **If environment variables are missing:**

   ```bash
   # Copy from env.example and fill in your values
   cp env.example .env.local
   ```

2. **If private key is malformed:**
   - Ensure it's wrapped in quotes
   - Include `\n` for line breaks
   - Copy exactly from Firebase Console

3. **If Firebase Admin isn't initializing:**
   - Check that all three environment variables are set
   - Verify the private key format
   - Ensure you're using the correct project ID

### 📋 Environment Variable Checklist

- [ ] `FIREBASE_PROJECT_ID` - Your Firebase project ID
- [ ] `FIREBASE_CLIENT_EMAIL` - Service account email (ends with @your-project.iam.gserviceaccount.com)
- [ ] `FIREBASE_PRIVATE_KEY` - Private key from service account JSON (wrapped in quotes with \n)

### 🎯 Expected Behavior

After fixing the environment variables:

1. Server starts with "Firebase Admin initialized successfully"
2. API calls to `/api/admin/bookings` return 200 with bookings data
3. Admin page loads without 500 errors

### 🔗 Related Files

- `src/lib/firebaseAdmin.ts` - Firebase Admin initialization
- `src/app/api/admin/bookings/route.ts` - Admin bookings API
- `env.example` - Environment variable template
- `scripts/test-firebase-admin.js` - Test script
