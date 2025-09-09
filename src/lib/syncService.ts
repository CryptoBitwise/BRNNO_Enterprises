import { supabaseClient, SupabaseUser, SupabaseJob, SupabaseClient, SyncStatus } from './supabaseClient';
import { ProviderRegistrationData } from '@/types/provider';

export class SyncService {
    /**
     * Sync provider registration from Firebase to Supabase
     * Creates a user record in Supabase when a provider registers in Firebase
     */
    static async syncProviderRegistration(
        firebaseUserId: string,
        providerData: ProviderRegistrationData
    ): Promise<SyncStatus> {
        try {
            console.log('Starting provider sync to Supabase...', { firebaseUserId, businessName: providerData.businessName });

            // Check if user already exists in Supabase
            const { data: existingUser, error: checkError } = await supabaseClient
                .from('users')
                .select('id')
                .eq('id', firebaseUserId)
                .single();

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Error checking existing user:', checkError);
                return {
                    success: false,
                    error: `Failed to check existing user: ${checkError.message}`,
                    syncedAt: new Date().toISOString()
                };
            }

            if (existingUser) {
                console.log('User already exists in Supabase, skipping sync');
                return {
                    success: true,
                    error: 'User already exists in Supabase',
                    syncedAt: new Date().toISOString(),
                    recordId: existingUser.id
                };
            }

            // Create user record in Supabase
            const userData: Partial<SupabaseUser> = {
                id: firebaseUserId,
                email: providerData.email,
                password_hash: '', // Will be set by Supabase auth
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data: newUser, error: insertError } = await supabaseClient
                .from('users')
                .insert([userData])
                .select()
                .single();

            if (insertError) {
                console.error('Error creating user in Supabase:', insertError);
                return {
                    success: false,
                    error: `Failed to create user in Supabase: ${insertError.message}`,
                    syncedAt: new Date().toISOString()
                };
            }

            console.log('Successfully synced provider to Supabase:', newUser);
            return {
                success: true,
                syncedAt: new Date().toISOString(),
                recordId: newUser.id
            };

        } catch (error) {
            console.error('Unexpected error in provider sync:', error);
            return {
                success: false,
                error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                syncedAt: new Date().toISOString()
            };
        }
    }

    /**
     * Sync booking from Firebase to Supabase
     * Creates a job record in Supabase when a customer books a service
     */
    static async syncBooking(
        firebaseUserId: string,
        bookingData: {
            serviceId: string;
            customerName: string;
            customerEmail: string;
            customerPhone?: string;
            scheduledDate: string;
            scheduledTime: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            serviceType: string;
            estimatedCost?: number;
            notes?: string;
        }
    ): Promise<SyncStatus> {
        try {
            console.log('Starting booking sync to Supabase...', { firebaseUserId, serviceId: bookingData.serviceId });

            // First, create or find client record
            let clientId: string;

            // Check if client already exists
            const { data: existingClient, error: clientCheckError } = await supabaseClient
                .from('clients')
                .select('id')
                .eq('user_id', firebaseUserId)
                .eq('email', bookingData.customerEmail)
                .single();

            if (clientCheckError && clientCheckError.code !== 'PGRST116') {
                console.error('Error checking existing client:', clientCheckError);
                return {
                    success: false,
                    error: `Failed to check existing client: ${clientCheckError.message}`,
                    syncedAt: new Date().toISOString()
                };
            }

            if (existingClient) {
                clientId = existingClient.id;
                console.log('Using existing client:', clientId);
            } else {
                // Create new client
                const clientData: Partial<SupabaseClient> = {
                    user_id: firebaseUserId,
                    name: bookingData.customerName,
                    email: bookingData.customerEmail,
                    phone: bookingData.customerPhone,
                    address: bookingData.address,
                    city: bookingData.city,
                    state: bookingData.state,
                    zip_code: bookingData.zipCode,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                const { data: newClient, error: clientInsertError } = await supabaseClient
                    .from('clients')
                    .insert([clientData])
                    .select()
                    .single();

                if (clientInsertError) {
                    console.error('Error creating client in Supabase:', clientInsertError);
                    return {
                        success: false,
                        error: `Failed to create client in Supabase: ${clientInsertError.message}`,
                        syncedAt: new Date().toISOString()
                    };
                }

                clientId = newClient.id;
                console.log('Created new client:', clientId);
            }

            // Create job record
            const jobData: Partial<SupabaseJob> = {
                user_id: firebaseUserId,
                client_id: clientId,
                title: `${bookingData.serviceType} - ${bookingData.customerName}`,
                description: bookingData.notes || `Service booking for ${bookingData.customerName}`,
                service_type: bookingData.serviceType,
                estimated_cost: bookingData.estimatedCost,
                scheduled_date: bookingData.scheduledDate,
                scheduled_time: bookingData.scheduledTime,
                timezone: 'UTC',
                status: 'scheduled',
                priority: 'medium',
                address: bookingData.address,
                city: bookingData.city,
                state: bookingData.state,
                zip_code: bookingData.zipCode,
                is_mobile_service: true, // Assuming mobile service for now
                client_notes: bookingData.notes,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data: newJob, error: jobInsertError } = await supabaseClient
                .from('jobs')
                .insert([jobData])
                .select()
                .single();

            if (jobInsertError) {
                console.error('Error creating job in Supabase:', jobInsertError);
                return {
                    success: false,
                    error: `Failed to create job in Supabase: ${jobInsertError.message}`,
                    syncedAt: new Date().toISOString()
                };
            }

            console.log('Successfully synced booking to Supabase:', newJob);
            return {
                success: true,
                syncedAt: new Date().toISOString(),
                recordId: newJob.id
            };

        } catch (error) {
            console.error('Unexpected error in booking sync:', error);
            return {
                success: false,
                error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                syncedAt: new Date().toISOString()
            };
        }
    }

    /**
     * Test Supabase connection
     */
    static async testConnection(): Promise<SyncStatus> {
        try {
            const { data, error } = await supabaseClient
                .from('users')
                .select('count')
                .limit(1);

            if (error) {
                return {
                    success: false,
                    error: `Supabase connection failed: ${error.message}`,
                    syncedAt: new Date().toISOString()
                };
            }

            return {
                success: true,
                syncedAt: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                syncedAt: new Date().toISOString()
            };
        }
    }
}
