# Development Setup Guide

This guide explains how to run the BRNNO CSA application without Firebase credentials for development purposes.

## Quick Start (No Firebase Required)

1. **Copy the development environment file:**

   ```bash
   cp .env.development .env.local
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## What Happens in Development Mode

- **Automatic Login**: The app automatically logs you in as a demo user
- **Mock Database**: All data is stored in memory (resets on page refresh)
- **Mock Authentication**: No real Firebase authentication required
- **Full Functionality**: All features work as expected for testing

## Demo Users Available

The development mode includes these pre-configured users:

1. **Demo Customer**
   - Email: `demo@example.com`
   - Name: Demo User
   - Type: Customer

2. **Demo Provider**
   - Email: `provider@example.com`
   - Name: Demo Provider
   - Type: Service Provider

## Switching to Production Mode

To use real Firebase authentication:

1. **Get Firebase credentials** from your Firebase console
2. **Update `.env.local`** with real Firebase configuration:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_real_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_real_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_real_project_id
   # ... other Firebase config
   ```

3. **Restart the development server**

## Features Available in Development Mode

- ✅ User authentication (mock)
- ✅ User registration (mock)
- ✅ Dashboard access
- ✅ Service browsing
- ✅ Provider registration
- ✅ Booking system
- ✅ All UI components and pages

## Troubleshooting

### App won't start

- Make sure you have `.env.local` file with the development configuration
- Check that all dependencies are installed with `npm install`

### Authentication issues

- The app should automatically log you in as a demo user
- If not working, check the browser console for error messages

### Data not persisting

- This is expected in development mode - data is stored in memory
- Data will reset when you refresh the page or restart the server

## Need Help?

If you encounter any issues:

1. Check the browser console for error messages
2. Look for messages starting with "🔧" - these are development mode indicators
3. Make sure you're using the development environment configuration
