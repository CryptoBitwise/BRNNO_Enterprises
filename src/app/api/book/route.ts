import { NextRequest, NextResponse } from "next/server";
import { admin, dbAdmin } from "@/lib/firebaseAdmin";

export async function POST(request: NextRequest) {
    console.log("Booking API called");
    console.log("dbAdmin available:", !!dbAdmin);

    if (!dbAdmin) {
        console.error("Database not available - Firebase Admin not initialized");
        return NextResponse.json(
            { error: "Database not available" },
            { status: 500 }
        );
    }

    try {
        // 1) Extract & verify ID token
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }
        const token = authHeader.substring(7);
        const decodedToken = await admin.auth().verifyIdToken(token);

        // 2) Extract booking data
        const { serviceId, name, email, zip, date, time } = await request.json();

        // 3) Validate required fields and types
        if (!serviceId || typeof serviceId !== "string") {
            return NextResponse.json({ error: "Invalid or missing serviceId" }, { status: 400 });
        }
        if (!name || typeof name !== "string") {
            return NextResponse.json({ error: "Invalid or missing name" }, { status: 400 });
        }
        if (!email || typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            return NextResponse.json({ error: "Invalid or missing email" }, { status: 400 });
        }
        if (!zip || typeof zip !== "string" || !/^\d{5}(?:-\d{4})?$/.test(zip)) {
            return NextResponse.json({ error: "Invalid or missing zip code" }, { status: 400 });
        }
        if (!date || typeof date !== "string") {
            return NextResponse.json({ error: "Invalid or missing date" }, { status: 400 });
        }
        if (!time || typeof time !== "string") {
            return NextResponse.json({ error: "Invalid or missing time" }, { status: 400 });
        }
        // Validate date format
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        // 4) Log decoded token and booking payload
        console.log("Decoded token:", decodedToken);
        console.log("Booking payload:", {
            serviceId, name, email, zip, date, time, userId: decodedToken.uid
        });

        // 5) Save booking to Firestore
        const docRef = await dbAdmin.collection("bookings").add({
            serviceId,
            name,
            email,
            zip,
            date,
            time,
            userId: decodedToken.uid, // Tie booking to authenticated user
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return NextResponse.json({
            success: true,
            id: docRef.id,
        });

    } catch (error) {
        console.error("Booking API error:", error instanceof Error ? error.message : error);
        return NextResponse.json(
            { error: "Failed to create booking" },
            { status: 500 }
        );
    }
} 