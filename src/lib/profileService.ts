import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { dbClient } from "./firebaseClient";

export interface UserProfile {
    displayName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    memberSince: string;
    preferences: {
        theme: "light" | "dark";
        notifications: boolean;
        emailNotifications: boolean;
        smsNotifications: boolean;
        locationServices: boolean;
        dataSharing: boolean;
        saveBookingHistory: boolean;
    };
    vehicles: Array<{
        id: string;
        type: "Car" | "Truck" | "Watercraft & RV" | "Motorcycle";
        make: string;
        model: string;
        year: string;
        vin?: string;
        subType?: string;
        extra?: string;
        extra2?: string;
    }>;
}

export class ProfileService {
    private static getProfileDoc(userId: string) {
        return doc(dbClient, "users", userId);
    }

    static async getProfile(userId: string): Promise<UserProfile | null> {
        try {
            if (!dbClient) {
                console.warn('Firestore not available. Please configure Firebase in .env.local');
                return null;
            }

            const docSnap = await getDoc(this.getProfileDoc(userId));

            if (docSnap.exists()) {
                const data = docSnap.data();
                return data.profile as UserProfile;
            }

            return null;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    }

    static async saveProfile(userId: string, profile: Partial<UserProfile>): Promise<boolean> {
        try {
            if (!dbClient) {
                console.warn('Firestore not available. Please configure Firebase in .env.local');
                return false;
            }

            await setDoc(
                this.getProfileDoc(userId),
                { profile },
                { merge: true }
            );
            return true;
        } catch (error) {
            console.error("Error saving profile:", error);
            return false;
        }
    }

    static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
        try {
            const profileRef = this.getProfileDoc(userId);
            const docSnap = await getDoc(profileRef);

            if (docSnap.exists()) {
                const currentProfile = docSnap.data().profile as UserProfile;
                const updatedProfile = { ...currentProfile, ...updates };

                await setDoc(profileRef, { profile: updatedProfile }, { merge: true });
            } else {
                // If profile doesn't exist, create it
                await this.saveProfile(userId, updates);
            }

            return true;
        } catch (error) {
            console.error("Error updating profile:", error);
            return false;
        }
    }

    static async addVehicle(userId: string, vehicle: UserProfile['vehicles'][0]): Promise<boolean> {
        try {
            const profileRef = this.getProfileDoc(userId);
            const docSnap = await getDoc(profileRef);

            if (docSnap.exists()) {
                const currentProfile = docSnap.data().profile as UserProfile;
                const updatedVehicles = [...currentProfile.vehicles, vehicle];

                await updateDoc(profileRef, {
                    "profile.vehicles": updatedVehicles
                });
            } else {
                // Create new profile with vehicle
                await this.saveProfile(userId, {
                    vehicles: [vehicle],
                    displayName: "",
                    email: "",
                    phone: "",
                    memberSince: new Date().toISOString(),
                    preferences: {
                        theme: "light",
                        notifications: true,
                        emailNotifications: true,
                        smsNotifications: false,
                        locationServices: true,
                        dataSharing: false,
                        saveBookingHistory: true
                    }
                });
            }

            return true;
        } catch (error) {
            console.error("Error adding vehicle:", error);
            return false;
        }
    }

    static async updateVehicle(userId: string, vehicleId: string, updates: Partial<UserProfile['vehicles'][0]>): Promise<boolean> {
        try {
            const profileRef = this.getProfileDoc(userId);
            const docSnap = await getDoc(profileRef);

            if (docSnap.exists()) {
                const currentProfile = docSnap.data().profile as UserProfile;
                const updatedVehicles = currentProfile.vehicles.map(vehicle =>
                    vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle
                );

                await updateDoc(profileRef, {
                    "profile.vehicles": updatedVehicles
                });

                return true;
            }

            return false;
        } catch (error) {
            console.error("Error updating vehicle:", error);
            return false;
        }
    }

    static async removeVehicle(userId: string, vehicleId: string): Promise<boolean> {
        try {
            const profileRef = this.getProfileDoc(userId);
            const docSnap = await getDoc(profileRef);

            if (docSnap.exists()) {
                const currentProfile = docSnap.data().profile as UserProfile;
                const updatedVehicles = currentProfile.vehicles.filter(vehicle => vehicle.id !== vehicleId);

                await updateDoc(profileRef, {
                    "profile.vehicles": updatedVehicles
                });

                return true;
            }

            return false;
        } catch (error) {
            console.error("Error removing vehicle:", error);
            return false;
        }
    }

    static async updatePreferences(userId: string, preferences: Partial<UserProfile['preferences']>): Promise<boolean> {
        try {
            const profileRef = this.getProfileDoc(userId);
            const docSnap = await getDoc(profileRef);

            if (docSnap.exists()) {
                const currentProfile = docSnap.data().profile as UserProfile;
                const updatedPreferences = { ...currentProfile.preferences, ...preferences };

                await updateDoc(profileRef, {
                    "profile.preferences": updatedPreferences
                });

                return true;
            }

            return false;
        } catch (error) {
            console.error("Error updating preferences:", error);
            return false;
        }
    }
} 