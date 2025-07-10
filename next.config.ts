import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    fallbacks: {
        document: "/offline.html",
        image: "/images/fallback.png",
    },
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
                cacheName: "google-fonts",
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
        },
        {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
                cacheName: "firestore-data",
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
            },
        },
        {
            urlPattern: /^https:\/\/firebase\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
                cacheName: "firebase-auth",
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 10 },
            },
        },
    ],
});

const nextConfig: NextConfig = {
    reactStrictMode: true,
};

export default withPWA(nextConfig);
