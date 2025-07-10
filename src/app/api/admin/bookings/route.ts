import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebaseAdmin";

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No authorization token provided" },
                { status: 401 }
            );
        }

        const token = authHeader.split("Bearer ")[1];
        console.log("Token received:", token ? "Token exists" : "No token");

        const decoded = await verifyIdToken(token);
        console.log("Decoded token:", decoded);

        if (!decoded.admin) {
            return NextResponse.json(
                { error: "Admin privileges required" },
                { status: 403 }
            );
        }

        // Mock bookings data for now
        const bookings = [
            {
                id: "1",
                serviceTitle: "Premium Detail",
                name: "John Doe",
                email: "john@example.com",
                phone: "123-456-7890",
                date: "2025-01-15",
                time: "10:00",
                zipCode: "12345",
                status: "confirmed",
                createdAt: new Date().toISOString(),
                userId: "user1",
            },
            {
                id: "2",
                serviceTitle: "Basic Wash",
                name: "Jane Smith",
                email: "jane@example.com",
                phone: "098-765-4321",
                date: "2025-01-16",
                time: "14:00",
                zipCode: "54321",
                status: "pending",
                createdAt: new Date().toISOString(),
                userId: "user2",
            },
        ];

        return NextResponse.json({ bookings });
    } catch (err) {
        console.error("Error fetching bookings:", err);
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No authorization token provided" },
                { status: 401 }
            );
        }

        const token = authHeader.split("Bearer ")[1];
        console.log("Token received for DELETE:", token ? "Token exists" : "No token");

        const decoded = await verifyIdToken(token);
        console.log("Decoded token for DELETE:", decoded);

        if (!decoded.admin) {
            return NextResponse.json(
                { error: "Admin privileges required" },
                { status: 403 }
            );
        }

        const url = new URL(request.url);
        const bookingId = url.pathname.split("/").pop();

        if (!bookingId) {
            return NextResponse.json(
                { error: "Booking ID required" },
                { status: 400 }
            );
        }

        // Mock booking cancellation
        console.log(`Cancelling booking: ${bookingId}`);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error cancelling booking:", err);
        return NextResponse.json(
            { error: "Failed to cancel booking" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    // handle creating a booking
}

export async function PUT(request: NextRequest) {
    // handle updating a booking
} 