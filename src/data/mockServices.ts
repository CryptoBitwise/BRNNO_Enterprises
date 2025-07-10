export interface MockService {
    id: string;
    title: string;
    address: string;
    rating: number;
    reviewCount: number;
    type: "Mobile Detailing" | "Drop-off Location" | "Self-Service Bay" | "Professional Detailer";
    lat: number;
    lng: number;
    distance?: number;
    description: string;
    services: string[];
    hours: string;
    phone?: string;
    website?: string;
    features: string[];
}

// Mock services with real coordinates (using Utah area as example)
export const mockServices: MockService[] = [
    {
        id: "1",
        title: "Sparkle Mobile Detailing",
        address: "123 Main St, Saratoga Springs, UT 84045",
        rating: 4.8,
        reviewCount: 127,
        type: "Mobile Detailing",
        lat: 40.3469,
        lng: -111.9047,
        description: "Professional mobile detailing service. We come to you!",
        services: ["Exterior Wash", "Interior Detail", "Wax & Polish", "Engine Bay Clean"],
        hours: "Mon-Sat: 8AM-6PM",
        phone: "(801) 555-0123",
        website: "https://sparklemobile.com",
        features: ["Mobile Service", "Eco-Friendly Products", "Same Day Available"]
    },
    {
        id: "2",
        title: "Elite Auto Care Center",
        address: "456 State St, Lehi, UT 84043",
        rating: 4.6,
        reviewCount: 89,
        type: "Drop-off Location",
        lat: 40.3916,
        lng: -111.8508,
        description: "Full-service auto detailing with premium packages",
        services: ["Full Detail", "Paint Correction", "Ceramic Coating", "Interior Restoration"],
        hours: "Mon-Fri: 7AM-7PM, Sat: 8AM-5PM",
        phone: "(801) 555-0456",
        website: "https://eliteautocare.com",
        features: ["Paint Correction", "Ceramic Coating", "Interior Restoration"]
    },
    {
        id: "3",
        title: "Quick Clean Self-Service",
        address: "789 Center St, American Fork, UT 84003",
        rating: 4.2,
        reviewCount: 234,
        type: "Self-Service Bay",
        lat: 40.3778,
        lng: -111.7958,
        description: "Self-service car wash with detailing supplies available",
        services: ["Self-Service Wash", "Vacuum", "Detailing Supplies", "Touchless Wash"],
        hours: "Daily: 6AM-10PM",
        phone: "(801) 555-0789",
        features: ["24/7 Access", "Self-Service", "Touchless Wash"]
    },
    {
        id: "4",
        title: "Pro Detail Express",
        address: "321 Oak Ave, Pleasant Grove, UT 84062",
        rating: 4.9,
        reviewCount: 156,
        type: "Professional Detailer",
        lat: 40.3644,
        lng: -111.7385,
        description: "Express detailing services with quick turnaround",
        services: ["Express Detail", "Quick Wash", "Interior Refresh", "Tire Shine"],
        hours: "Mon-Sat: 8AM-8PM",
        phone: "(801) 555-0321",
        website: "https://prodetailing.com",
        features: ["Express Service", "Quick Turnaround", "Mobile Available"]
    },
    {
        id: "5",
        title: "Mountain View Mobile Detailing",
        address: "654 Pine Rd, Highland, UT 84003",
        rating: 4.7,
        reviewCount: 98,
        type: "Mobile Detailing",
        lat: 40.4300,
        lng: -111.8000,
        description: "Premium mobile detailing service for all vehicle types",
        services: ["Premium Detail", "RV Detailing", "Boat Detailing", "Fleet Service"],
        hours: "Mon-Sun: 7AM-7PM",
        phone: "(801) 555-0654",
        website: "https://mountainviewdetailing.com",
        features: ["RV Service", "Boat Service", "Fleet Discounts"]
    },
    {
        id: "6",
        title: "Clean & Shine Auto Spa",
        address: "987 Maple Dr, Orem, UT 84057",
        rating: 4.5,
        reviewCount: 203,
        type: "Drop-off Location",
        lat: 40.2969,
        lng: -111.6946,
        description: "Luxury auto spa with premium detailing packages",
        services: ["Luxury Detail", "Paint Protection", "Interior Deep Clean", "Odor Removal"],
        hours: "Mon-Sat: 8AM-6PM",
        phone: "(801) 555-0987",
        website: "https://cleanandshine.com",
        features: ["Luxury Service", "Paint Protection", "Odor Removal"]
    },
    {
        id: "7",
        title: "Express Wash & Detail",
        address: "147 Cedar Ln, Provo, UT 84604",
        rating: 4.3,
        reviewCount: 167,
        type: "Self-Service Bay",
        lat: 40.2338,
        lng: -111.6585,
        description: "Quick wash and detail services with modern equipment",
        services: ["Express Wash", "Interior Detail", "Wax Service", "Tire Dressing"],
        hours: "Daily: 7AM-9PM",
        phone: "(801) 555-0147",
        features: ["Express Service", "Modern Equipment", "Convenient Hours"]
    },
    {
        id: "8",
        title: "Valley Mobile Detailing",
        address: "258 Elm St, Spanish Fork, UT 84660",
        rating: 4.8,
        reviewCount: 112,
        type: "Mobile Detailing",
        lat: 40.1150,
        lng: -111.6549,
        description: "Professional mobile detailing serving Utah Valley",
        services: ["Complete Detail", "Paint Correction", "Ceramic Coating", "Interior Protection"],
        hours: "Mon-Sat: 8AM-6PM",
        phone: "(801) 555-0258",
        website: "https://valleymobile.com",
        features: ["Paint Correction", "Ceramic Coating", "Interior Protection"]
    }
];

// Mock zip code to coordinates mapping
export const zipToCoordinates: Record<string, { lat: number; lng: number; city: string; state: string }> = {
    "84005": { lat: 40.3469, lng: -111.9047, city: "Saratoga Springs", state: "UT" },
    "84043": { lat: 40.3916, lng: -111.8508, city: "Lehi", state: "UT" },
    "84003": { lat: 40.3778, lng: -111.7958, city: "American Fork", state: "UT" },
    "84062": { lat: 40.3644, lng: -111.7385, city: "Pleasant Grove", state: "UT" },
    "84057": { lat: 40.2969, lng: -111.6946, city: "Orem", state: "UT" },
    "84604": { lat: 40.2338, lng: -111.6585, city: "Provo", state: "UT" },
    "84660": { lat: 40.1150, lng: -111.6549, city: "Spanish Fork", state: "UT" },
    "84045": { lat: 40.3469, lng: -111.9047, city: "Saratoga Springs", state: "UT" }
};

// Haversine formula to calculate distance between two points
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Find nearby services based on user location and radius
export function findNearbyServices(userLat: number, userLng: number, radiusMiles: number): MockService[] {
    return mockServices
        .map(service => ({
            ...service,
            distance: calculateDistance(userLat, userLng, service.lat, service.lng)
        }))
        .filter(service => service.distance! <= radiusMiles)
        .sort((a, b) => a.distance! - b.distance!);
} 