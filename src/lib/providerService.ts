import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    addDoc,
    deleteDoc
} from "firebase/firestore";
import { dbClient } from "./firebaseClient";
import { ProviderProfile, ProviderService as ProviderServiceType, ProviderAvailability, ProviderRegistrationData } from "@/types/provider";

export class ProviderService {
    private static getProvidersCollection() {
        if (!dbClient) throw new Error('Firebase not initialized');
        return collection(dbClient, "providers");
    }

    private static getProviderDoc(providerId: string) {
        if (!dbClient) throw new Error('Firebase not initialized');
        return doc(dbClient, "providers", providerId);
    }

    private static getProviderServicesCollection(providerId: string) {
        if (!dbClient) throw new Error('Firebase not initialized');
        return collection(dbClient, "providers", providerId, "services");
    }

    private static getProviderAvailabilityCollection(providerId: string) {
        if (!dbClient) throw new Error('Firebase not initialized');
        return collection(dbClient, "providers", providerId, "availability");
    }

    // Create a new provider profile
    static async createProvider(providerId: string, data: ProviderRegistrationData): Promise<ProviderProfile> {
        try {
            const providerData: Omit<ProviderProfile, 'id'> = {
                businessName: data.businessName,
                businessType: data.businessType,
                contactPerson: data.contactPerson,
                email: data.email,
                phone: data.phone,
                website: data.website,
                businessDescription: data.businessDescription,
                yearsInBusiness: data.yearsInBusiness,
                licenseNumber: data.licenseNumber,
                insuranceProvider: data.insuranceProvider,
                insurancePolicyNumber: data.insurancePolicyNumber,
                address: data.address,
                serviceRadius: data.serviceRadius,
                serviceAreas: data.serviceAreas,
                serviceCategories: data.serviceCategories,
                specialties: data.specialties,
                businessHours: data.businessHours,
                baseCommissionRate: data.baseCommissionRate,
                minimumBookingAmount: data.minimumBookingAmount,
                verificationStatus: 'pending',
                verificationDocuments: {
                    businessLicense: data.verificationDocuments.businessLicense ?
                        await this.uploadDocument(providerId, 'businessLicense', data.verificationDocuments.businessLicense) : undefined,
                    insuranceCertificate: data.verificationDocuments.insuranceCertificate ?
                        await this.uploadDocument(providerId, 'insuranceCertificate', data.verificationDocuments.insuranceCertificate) : undefined,
                    idVerification: data.verificationDocuments.idVerification ?
                        await this.uploadDocument(providerId, 'idVerification', data.verificationDocuments.idVerification) : undefined,
                },
                verificationNotes: undefined,
                rating: 0,
                totalReviews: 0,
                completedJobs: 0,
                responseTime: 0,
                isActive: false, // Will be activated after verification
                isAcceptingBookings: false,
                autoAcceptBookings: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastActiveAt: new Date(),
            };

            await setDoc(this.getProviderDoc(providerId), providerData);

            return { id: providerId, ...providerData };
        } catch (error) {
            console.error('Error creating provider:', error);
            throw new Error('Failed to create provider profile');
        }
    }

    // Get provider profile by ID
    static async getProvider(providerId: string): Promise<ProviderProfile | null> {
        try {
            const docRef = this.getProviderDoc(providerId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as ProviderProfile;
            }
            return null;
        } catch (error) {
            console.error('Error getting provider:', error);
            throw new Error('Failed to get provider profile');
        }
    }

    // Update provider profile
    static async updateProvider(providerId: string, updates: Partial<ProviderProfile>): Promise<void> {
        try {
            const docRef = this.getProviderDoc(providerId);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Error updating provider:', error);
            throw new Error('Failed to update provider profile');
        }
    }

    // Get all providers (for admin)
    static async getAllProviders(limitCount: number = 50): Promise<ProviderProfile[]> {
        try {
            const q = query(
                this.getProvidersCollection(),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ProviderProfile[];
        } catch (error) {
            console.error('Error getting all providers:', error);
            throw new Error('Failed to get providers');
        }
    }

    // Get providers by verification status
    static async getProvidersByStatus(status: ProviderProfile['verificationStatus']): Promise<ProviderProfile[]> {
        try {
            const q = query(
                this.getProvidersCollection(),
                where('verificationStatus', '==', status)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ProviderProfile[];
        } catch (error) {
            console.error('Error getting providers by status:', error);
            throw new Error('Failed to get providers by status');
        }
    }

    // Search providers by location and service category
    static async searchProviders(
        location: string,
        category: string,
        radius: number = 25
    ): Promise<ProviderProfile[]> {
        try {
            // This is a simplified search - in production, you'd want to use geospatial queries
            const q = query(
                this.getProvidersCollection(),
                where('serviceCategories', 'array-contains', category),
                where('isActive', '==', true),
                where('isAcceptingBookings', '==', true)
            );

            const querySnapshot = await getDocs(q);
            const providers = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ProviderProfile[];

            // Filter by service areas (simplified)
            return providers.filter(provider =>
                provider.serviceAreas.some(area =>
                    area.toLowerCase().includes(location.toLowerCase())
                )
            );
        } catch (error) {
            console.error('Error searching providers:', error);
            throw new Error('Failed to search providers');
        }
    }

    // Create a service for a provider
    static async createProviderService(providerId: string, serviceData: Omit<ProviderServiceType, 'id' | 'providerId' | 'createdAt' | 'updatedAt'>): Promise<ProviderServiceType> {
        try {
            const serviceRef = await addDoc(this.getProviderServicesCollection(providerId), {
                ...serviceData,
                providerId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return {
                id: serviceRef.id,
                providerId,
                ...serviceData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        } catch (error) {
            console.error('Error creating provider service:', error);
            throw new Error('Failed to create provider service');
        }
    }

    // Get services for a provider
    static async getProviderServices(providerId: string): Promise<ProviderServiceType[]> {
        try {
            const q = query(
                this.getProviderServicesCollection(providerId),
                where('isActive', '==', true),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ProviderServiceType[];
        } catch (error) {
            console.error('Error getting provider services:', error);
            throw new Error('Failed to get provider services');
        }
    }

    // Update provider service
    static async updateProviderService(providerId: string, serviceId: string, updates: Partial<ProviderServiceType>): Promise<void> {
        try {
            const serviceRef = doc(this.getProviderServicesCollection(providerId), serviceId);
            await updateDoc(serviceRef, {
                ...updates,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Error updating provider service:', error);
            throw new Error('Failed to update provider service');
        }
    }

    // Delete provider service
    static async deleteProviderService(providerId: string, serviceId: string): Promise<void> {
        try {
            const serviceRef = doc(this.getProviderServicesCollection(providerId), serviceId);
            await deleteDoc(serviceRef);
        } catch (error) {
            console.error('Error deleting provider service:', error);
            throw new Error('Failed to delete provider service');
        }
    }

    // Set provider availability
    static async setProviderAvailability(providerId: string, availability: Omit<ProviderAvailability, 'id' | 'providerId' | 'createdAt' | 'updatedAt'>): Promise<ProviderAvailability> {
        try {
            const availabilityRef = await addDoc(this.getProviderAvailabilityCollection(providerId), {
                ...availability,
                providerId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return {
                id: availabilityRef.id,
                providerId,
                ...availability,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        } catch (error) {
            console.error('Error setting provider availability:', error);
            throw new Error('Failed to set provider availability');
        }
    }

    // Get provider availability
    static async getProviderAvailability(providerId: string, date?: string): Promise<ProviderAvailability[]> {
        try {
            let q = query(this.getProviderAvailabilityCollection(providerId));

            if (date) {
                q = query(
                    this.getProviderAvailabilityCollection(providerId),
                    where('date', '==', date)
                );
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ProviderAvailability[];
        } catch (error) {
            console.error('Error getting provider availability:', error);
            throw new Error('Failed to get provider availability');
        }
    }

    // Upload verification document (placeholder - implement with your storage solution)
    private static async uploadDocument(providerId: string, documentType: string, file: File): Promise<string> {
        // This is a placeholder - you'll need to implement file upload to Firebase Storage
        // For now, return a placeholder URL
        return `https://storage.googleapis.com/brnno-enterprises.appspot.com/providers/${providerId}/${documentType}_${Date.now()}.${file.name.split('.').pop()}`;
    }

    // Verify provider (admin function)
    static async verifyProvider(providerId: string, status: 'verified' | 'rejected', notes?: string): Promise<void> {
        try {
            const updates: Partial<ProviderProfile> = {
                verificationStatus: status,
                verificationNotes: notes,
                verifiedAt: status === 'verified' ? new Date() : undefined,
                isActive: status === 'verified',
                isAcceptingBookings: status === 'verified',
            };

            await this.updateProvider(providerId, updates);
        } catch (error) {
            console.error('Error verifying provider:', error);
            throw new Error('Failed to verify provider');
        }
    }

    // Update provider rating (called after job completion)
    static async updateProviderRating(providerId: string, newRating: number): Promise<void> {
        try {
            const provider = await this.getProvider(providerId);
            if (!provider) throw new Error('Provider not found');

            const updatedTotalReviews = provider.totalReviews + 1;
            const updatedRating = ((provider.rating * provider.totalReviews) + newRating) / updatedTotalReviews;

            await this.updateProvider(providerId, {
                rating: updatedRating,
                totalReviews: updatedTotalReviews,
                completedJobs: provider.completedJobs + 1,
            });
        } catch (error) {
            console.error('Error updating provider rating:', error);
            throw new Error('Failed to update provider rating');
        }
    }

    // Check if provider exists
    static async providerExists(providerId: string): Promise<boolean> {
        try {
            const provider = await this.getProvider(providerId);
            return provider !== null;
        } catch (error) {
            console.error('Error checking provider existence:', error);
            return false;
        }
    }

    // Get provider dashboard stats
    static async getProviderStats(providerId: string): Promise<any> {
        try {
            // This would typically involve more complex queries
            // For now, return basic stats
            const provider = await this.getProvider(providerId);
            if (!provider) throw new Error('Provider not found');

            return {
                totalBookings: provider.completedJobs,
                completedBookings: provider.completedJobs,
                pendingBookings: 0, // Would need to query bookings
                cancelledBookings: 0, // Would need to query bookings
                totalEarnings: 0, // Would need to query transactions
                thisMonthEarnings: 0, // Would need to query transactions
                averageRating: provider.rating,
                responseTime: provider.responseTime,
                upcomingBookings: 0, // Would need to query bookings
            };
        } catch (error) {
            console.error('Error getting provider stats:', error);
            throw new Error('Failed to get provider stats');
        }
    }
}
