// Provider Types for BRNNO Marketplace

export interface ProviderProfile {
    id: string; // Firebase UID
    businessName: string;
    businessType: 'individual' | 'company' | 'LLC' | 'Sole Proprietorship' | 'Corporation';
    contactPerson: string;
    email: string;
    phone: string;
    website?: string;

    // Business Information
    businessDescription: string;
    yearsInBusiness: number;
    licenseNumber?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;

    // Location & Service Area (flexible structure)
    address: string | {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    city?: string;
    state?: string;
    zipCode?: string;
    serviceRadius: number; // in miles
    serviceAreas: string[]; // specific cities/areas

    // Service Categories
    serviceCategories: string[]; // ['cars', 'trucks', 'watercraft-rv', 'motorcycles']
    specialties?: string[]; // ['detailing', 'washing', 'waxing', etc.]

    // Business Hours (optional for now)
    businessHours?: {
        monday: { open: string; close: string; closed: boolean };
        tuesday: { open: string; close: string; closed: boolean };
        wednesday: { open: string; close: string; closed: boolean };
        thursday: { open: string; close: string; closed: boolean };
        friday: { open: string; close: string; closed: boolean };
        saturday: { open: string; close: string; closed: boolean };
        sunday: { open: string; close: string; closed: boolean };
    };

    // Pricing & Commission (optional for now)
    baseCommissionRate?: number; // percentage (e.g., 15 for 15%)
    minimumBookingAmount?: number;
    hourlyRate?: number;
    flatRateMin?: number;
    flatRateMax?: number;
    paymentMethods?: string[];

    // Verification & Status
    verificationStatus: 'pending' | 'verified' | 'rejected' | 'suspended';
    verificationDocuments?: {
        businessLicense?: string; // URL to document
        insuranceCertificate?: string; // URL to document
        idVerification?: string; // URL to document
    };
    documents?: {
        [key: string]: string;
    };

    // Additional properties for compatibility
    status?: 'pending' | 'approved' | 'rejected';
    mobileService?: boolean;
    averageRating?: number;
    reviewCount?: number;
    totalReviews?: number;
    responseTime?: number;
    createdAt?: Date;
    updatedAt?: Date;
    availability?: {
        [key: string]: any;
    };
    verificationNotes?: string;

    // Performance Metrics
    rating?: number; // average rating
    completedJobs?: number;

    // Platform Settings
    isActive?: boolean;
    isAcceptingBookings?: boolean;
    autoAcceptBookings?: boolean;

    // Timestamps
    verifiedAt?: Date;
    lastActiveAt?: Date;
}

export interface ProviderService {
    id: string;
    providerId: string;
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number; // in minutes
    isMobileService: boolean;
    isActive: boolean;
    images?: string[]; // URLs to service images
    requirements?: string[]; // special requirements
    createdAt: Date;
    updatedAt: Date;
}

export interface ProviderAvailability {
    id: string;
    providerId: string;
    date: string; // YYYY-MM-DD
    timeSlots: {
        start: string; // HH:MM
        end: string; // HH:MM
        isAvailable: boolean;
        isBooked: boolean;
        bookingId?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ProviderRegistrationData {
    // Step 1: Basic Information
    businessName: string;
    businessType: 'individual' | 'company';
    contactPerson: string;
    email: string;
    phone: string;
    website?: string;

    // Step 2: Business Details
    businessDescription: string;
    yearsInBusiness: number;
    licenseNumber?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;

    // Step 3: Location
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    serviceRadius: number;
    serviceAreas: string[];

    // Step 4: Services
    serviceCategories: string[];
    specialties: string[];

    // Step 5: Business Hours
    businessHours: ProviderProfile['businessHours'];

    // Step 6: Pricing
    baseCommissionRate: number;
    minimumBookingAmount: number;

    // Step 7: Documents
    verificationDocuments: {
        businessLicense?: File;
        insuranceCertificate?: File;
        idVerification?: File;
    };
}

export interface ProviderDashboardStats {
    totalBookings: number;
    completedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalEarnings: number;
    thisMonthEarnings: number;
    averageRating: number;
    responseTime: number;
    upcomingBookings: number;
}
