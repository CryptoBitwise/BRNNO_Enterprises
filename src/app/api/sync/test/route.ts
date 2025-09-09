import { NextRequest, NextResponse } from "next/server";
import { SyncService } from "@/lib/syncService";

export async function GET(request: NextRequest) {
    try {
        console.log('Testing Supabase sync connection...');

        const syncResult = await SyncService.testConnection();

        if (syncResult.success) {
            return NextResponse.json({
                success: true,
                message: 'Supabase connection successful',
                syncedAt: syncResult.syncedAt
            });
        } else {
            return NextResponse.json({
                success: false,
                error: syncResult.error,
                syncedAt: syncResult.syncedAt
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Error testing sync connection:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to test sync connection',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
