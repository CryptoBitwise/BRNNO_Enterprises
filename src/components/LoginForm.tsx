"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authClient } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BoopButton } from "@/components/ui/BoopWrapper";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!authClient) {
            setError("Authentication is not available. Please check your configuration.");
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(authClient, email, password);
            router.push('/');
        } catch (err: unknown) {
            console.error('Sign in error:', err);
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-center text-gray-700">Welcome Back</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-4 py-2 rounded focus:ring-pink-500 focus:border-pink-500 transition-colors font-medium text-base text-gray-900"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border px-4 py-2 rounded focus:ring-pink-500 focus:border-pink-500 transition-colors font-medium text-base text-gray-900"
                />
                <button
                    type="submit"
                    className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition-colors text-center font-medium"
                >
                    {loading ? "Signing In..." : "Sign In"}
                </button>
            </form>

            <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link href="/signup" className="text-pink-600 hover:underline">
                    Create one
                </Link>
            </p>
        </div>
    );
} 