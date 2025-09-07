import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebaseAdmin";

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        await verifyIdToken(token);

        // TODO: Fetch user bookings from Firestore
        // For now, return empty array
        const bookings: Array<{
            id: string;
            serviceTitle: string;
            name: string;
            email: string;
            phone: string;
            date: string;
            time: string;
            zipCode: string;
            status: string;
            createdAt: string;
        }> = [];

        return NextResponse.json({
            success: true,
            data: { bookings }
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
} 