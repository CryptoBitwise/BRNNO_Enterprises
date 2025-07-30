export interface LocationPreferences {
    zipCode: string;
    radius: number;
    preferredServiceTypes: string[];
    preferredTimeSlots: string[];
    lastUsed: string;
    searchCount: number;
}

export interface UserPreferences {
    defaultRadius: number;
    favoriteServiceTypes: string[];
    preferredTimeSlots: string[];
    autoFillEnabled: boolean;
}

// Get location-specific preferences
export function getLocationPreferences(zipCode: string): LocationPreferences | null {
    try {
        const stored = localStorage.getItem(`location_prefs_${zipCode}`);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error loading location preferences:', error);
        return null;
    }
}

// Save location-specific preferences
export function saveLocationPreferences(prefs: LocationPreferences): void {
    try {
        localStorage.setItem(`location_prefs_${prefs.zipCode}`, JSON.stringify(prefs));
    } catch (error) {
        console.error('Error saving location preferences:', error);
    }
}

// Get user's global preferences
export function getUserPreferences(): UserPreferences {
    try {
        const stored = localStorage.getItem('user_preferences');
        return stored ? JSON.parse(stored) : getDefaultUserPreferences();
    } catch (error) {
        console.error('Error loading user preferences:', error);
        return getDefaultUserPreferences();
    }
}

// Save user's global preferences
export function saveUserPreferences(prefs: UserPreferences): void {
    try {
        localStorage.setItem('user_preferences', JSON.stringify(prefs));
    } catch (error) {
        console.error('Error saving user preferences:', error);
    }
}

// Get default user preferences
export function getDefaultUserPreferences(): UserPreferences {
    return {
        defaultRadius: 10,
        favoriteServiceTypes: ['Mobile Detailing', 'Drop-off Location'],
        preferredTimeSlots: ['morning', 'afternoon'],
        autoFillEnabled: true
    };
}

// Get smart radius suggestion based on location type
export function getSmartRadius(locationCategory?: 'home' | 'work' | 'other'): number {
    switch (locationCategory) {
        case 'home':
            return 15; // Wider radius for home searches
        case 'work':
            return 10; // Medium radius for work
        default:
            return 10; // Default radius
    }
}

// Get smart time slot suggestions based on location
export function getSmartTimeSlots(locationCategory?: 'home' | 'work' | 'other'): string[] {
    switch (locationCategory) {
        case 'home':
            return ['morning', 'afternoon', 'evening']; // More flexible for home
        case 'work':
            return ['morning', 'lunch', 'afternoon']; // Work-friendly times
        default:
            return ['morning', 'afternoon'];
    }
}

// Get smart service type suggestions based on location
export function getSmartServiceTypes(locationCategory?: 'home' | 'work' | 'other'): string[] {
    switch (locationCategory) {
        case 'home':
            return ['Mobile Detailing']; // Mobile service preferred for home
        case 'work':
            return ['Drop-off Location', 'Mobile Detailing']; // Both options for work
        default:
            return ['Mobile Detailing', 'Drop-off Location'];
    }
}

// Update location preferences after a search
export function updateLocationPreferences(
    zipCode: string,
    radius: number,
    locationCategory?: 'home' | 'work' | 'other'
): void {
    const existing = getLocationPreferences(zipCode);
    const now = new Date().toISOString();

    const updated: LocationPreferences = {
        zipCode,
        radius,
        preferredServiceTypes: getSmartServiceTypes(locationCategory),
        preferredTimeSlots: getSmartTimeSlots(locationCategory),
        lastUsed: now,
        searchCount: (existing?.searchCount || 0) + 1
    };

    saveLocationPreferences(updated);
}

// Get auto-fill suggestions for a location
export function getAutoFillSuggestions(
    zipCode: string,
    locationCategory?: 'home' | 'work' | 'other'
): {
    radius: number;
    serviceTypes: string[];
    timeSlots: string[];
} {
    const locationPrefs = getLocationPreferences(zipCode);
    const userPrefs = getUserPreferences();

    if (locationPrefs && userPrefs.autoFillEnabled) {
        return {
            radius: locationPrefs.radius,
            serviceTypes: locationPrefs.preferredServiceTypes,
            timeSlots: locationPrefs.preferredTimeSlots
        };
    }

    // Fallback to smart defaults
    return {
        radius: getSmartRadius(locationCategory),
        serviceTypes: getSmartServiceTypes(locationCategory),
        timeSlots: getSmartTimeSlots(locationCategory)
    };
} 