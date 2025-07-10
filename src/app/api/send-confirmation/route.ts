import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No authorization token provided" },
                { status: 401 }
            );
        }

        const token = authHeader.split("Bearer ")[1];
        await admin.auth().verifyIdToken(token);

        const { bookingId, customerEmail, serviceTitle, date, time } = await request.json();

        if (!bookingId || !customerEmail || !serviceTitle || !date || !time) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const msg = {
            to: customerEmail,
            from: process.env.SENDGRID_FROM_EMAIL!,
            subject: "Booking Confirmation - Reviva",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Booking Confirmation</h2>
          <p>Thank you for booking with Reviva!</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Booking Details:</h3>
            <p><strong>Service:</strong> ${serviceTitle}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
          </div>
          <p>We'll contact you soon to confirm your appointment.</p>
          <p>Best regards,<br>The Reviva Team</p>
        </div>
      `,
        };

        await sgMail.send(msg);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        return NextResponse.json(
            { error: "Failed to send confirmation email" },
            { status: 500 }
        );
    }
} 