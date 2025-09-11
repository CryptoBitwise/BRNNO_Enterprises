"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/firebaseClient";
import { onAuthStateChanged, User } from "firebase/auth";
import { MockUser } from "@/lib/mockAuthClient";

// Union type to handle both Firebase User and Mock User
type AuthUser = User | MockUser | null;

interface AuthContextType {
    user: AuthUser;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If auth client is not available, skip auth state monitoring
        if (!authClient) {
            setLoading(false);
            return;
        }

        // Add a shorter timeout to prevent long loading screens
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        // Check if we're using mock auth (has onAuthStateChanged method)
        if (typeof authClient.onAuthStateChanged === 'function') {
            const unsubscribe = authClient.onAuthStateChanged((user: AuthUser) => {
                clearTimeout(timeout);
                setUser(user);
                setLoading(false);
            });

            return () => {
                clearTimeout(timeout);
                unsubscribe();
            };
        } else {
            // Fallback for Firebase auth
            const unsubscribe = onAuthStateChanged(authClient as any, (user: User) => {
                clearTimeout(timeout);
                setUser(user);
                setLoading(false);
            });

            return () => {
                clearTimeout(timeout);
                unsubscribe();
            };
        }
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