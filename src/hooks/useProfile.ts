import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileService, UserProfile } from '@/lib/profileService';

export const useProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load profile data
    const loadProfile = useCallback(async () => {
        if (!user?.uid) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const profileData = await ProfileService.getProfile(user.uid);
            setProfile(profileData);
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.uid]);

    // Save profile data
    const saveProfile = useCallback(async (updates: Partial<UserProfile>) => {
        if (!user?.uid) return false;

        try {
            setSaving(true);
            const success = await ProfileService.updateProfile(user.uid, updates);

            if (success) {
                setProfile(prev => prev ? { ...prev, ...updates } : null);
            }

            return success;
        } catch (error) {
            console.error('Error saving profile:', error);
            return false;
        } finally {
            setSaving(false);
        }
    }, [user?.uid]);

    // Add vehicle
    const addVehicle = useCallback(async (vehicle: UserProfile['vehicles'][0]) => {
        if (!user?.uid) return false;

        try {
            setSaving(true);
            const success = await ProfileService.addVehicle(user.uid, vehicle);

            if (success) {
                setProfile(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        vehicles: [...prev.vehicles, vehicle]
                    };
                });
            }

            return success;
        } catch (error) {
            console.error('Error adding vehicle:', error);
            return false;
        } finally {
            setSaving(false);
        }
    }, [user?.uid]);

    // Update vehicle
    const updateVehicle = useCallback(async (vehicleId: string, updates: Partial<UserProfile['vehicles'][0]>) => {
        if (!user?.uid) return false;

        try {
            setSaving(true);
            const success = await ProfileService.updateVehicle(user.uid, vehicleId, updates);

            if (success) {
                setProfile(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        vehicles: prev.vehicles.map(vehicle =>
                            vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle
                        )
                    };
                });
            }

            return success;
        } catch (error) {
            console.error('Error updating vehicle:', error);
            return false;
        } finally {
            setSaving(false);
        }
    }, [user?.uid]);

    // Remove vehicle
    const removeVehicle = useCallback(async (vehicleId: string) => {
        if (!user?.uid) return false;

        try {
            setSaving(true);
            const success = await ProfileService.removeVehicle(user.uid, vehicleId);

            if (success) {
                setProfile(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        vehicles: prev.vehicles.filter(vehicle => vehicle.id !== vehicleId)
                    };
                });
            }

            return success;
        } catch (error) {
            console.error('Error removing vehicle:', error);
            return false;
        } finally {
            setSaving(false);
        }
    }, [user?.uid]);

    // Update preferences
    const updatePreferences = useCallback(async (preferences: Partial<UserProfile['preferences']>) => {
        if (!user?.uid) return false;

        try {
            setSaving(true);
            const success = await ProfileService.updatePreferences(user.uid, preferences);

            if (success) {
                setProfile(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        preferences: { ...prev.preferences, ...preferences }
                    };
                });
            }

            return success;
        } catch (error) {
            console.error('Error updating preferences:', error);
            return false;
        } finally {
            setSaving(false);
        }
    }, [user?.uid]);

    // Load profile on mount and when user changes
    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    return {
        profile,
        loading,
        saving,
        saveProfile,
        addVehicle,
        updateVehicle,
        removeVehicle,
        updatePreferences,
        refreshProfile: loadProfile
    };
}; 