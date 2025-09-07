"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authClient } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";


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
        <div className="bg-black/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">ACCESS BRNNO</h2>
                <p className="text-gray-400 text-sm font-light tracking-wide">ENTER YOUR CREDENTIALS</p>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm backdrop-blur-xl">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <input
                        type="email"
                        placeholder="EMAIL"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium text-base text-white placeholder-gray-400 backdrop-blur-xl"
                    />
                </div>
                <div className="space-y-2">
                    <input
                        type="password"
                        placeholder="PASSWORD"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium text-base text-white placeholder-gray-400 backdrop-blur-xl"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center font-bold tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                    {loading ? "AUTHENTICATING..." : "SIGN IN"}
                </button>
            </form>

            <div className="text-center">
                <p className="text-sm text-gray-400">
                    NEW TO BRNNO?{" "}
                    <Link href="/signup" className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors duration-200">
                        CREATE ACCOUNT
                    </Link>
                </p>
            </div>
        </div>
    );
} 