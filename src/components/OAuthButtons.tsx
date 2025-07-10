"use client";

import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { authClient } from "@/lib/firebaseClient";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { OutlineButton } from "@/components/ui/Button";

export default function OAuthButtons() {
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();

    const handleOAuth = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
        try {
            await signInWithPopup(authClient!, provider);
            // Success - Firebase AuthContext will update and redirect
        } catch (error: unknown) {
            console.error("OAuth error:", error);
            if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/popup-closed-by-user') {
                // User closed the popup - no need to show error
                return;
            }
            alert("Sign-in failed. Please try again.");
        }
    };

    return (
        <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
            >
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
                <OutlineButton
                    onClick={() => handleOAuth(googleProvider)}
                    icon={<FaGoogle className="h-4 w-4 text-red-500" />}
                    className="group"
                >
                    Google
                </OutlineButton>

                <OutlineButton
                    onClick={() => handleOAuth(githubProvider)}
                    icon={<FaGithub className="h-4 w-4" />}
                    className="group"
                >
                    GitHub
                </OutlineButton>
            </div>
        </motion.div>
    );
} 