import { createClient } from '@supabase/supabase-js';

// Supabase configuration for BRNNO CSA sync
const supabaseUrl = 'https://ytjbqznnaeommgsgekeh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0amJxem5uYWVvbW1nc2dla2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1Mjg0MzMsImV4cCI6MjA3MDEwNDQzM30.5BqPsAxSt25x1h03ysXrdGSHLnhoCnj79d6MX3ff_Eo';

// Create Supabase client for server-side operations
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Types for Supabase tables
export interface SupabaseUser {
    id: string;
    email: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
}

export interface SupabaseJob {
    id: string;
    user_id: string;
    client_id: string;
    quote_id?: string;
    invoice_id?: string;
    title: string;
    description?: string;
    service_type: string;
    estimated_duration?: number;
    estimated_cost?: number;
    scheduled_date: string;
    scheduled_time: string;
    timezone?: string;
    status: string;
    priority?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    is_mobile_service?: boolean;
    client_notes?: string;
    internal_notes?: string;
    created_at: string;
    updated_at: string;
    completed_at?: string;
    cancelled_at?: string;
}

export interface SupabaseClient {
    id: string;
    user_id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

// Sync status tracking
export interface SyncStatus {
    success: boolean;
    error?: string;
    syncedAt: string;
    recordId?: string;
}
