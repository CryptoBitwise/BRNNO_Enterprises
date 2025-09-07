"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/firebaseClient";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If Firebase auth is not available, skip auth state monitoring
        if (!authClient) {
            setLoading(false);
            return;
        }

        // Add a shorter timeout to prevent long loading screens
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        const unsubscribe = onAuthStateChanged(authClient, (user) => {
            clearTimeout(timeout);
            setUser(user);
            setLoading(false);
        });

        return () => {
            clearTimeout(timeout);
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 