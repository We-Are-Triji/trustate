import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

// Mock database for activity logs (since we are using mock data primarily in this demo env)
// In a real app, this would use Supabase client
let mockActivityLogs: any[] = [];

// GET /api/transactions/[id]/activity
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const transactionId = params.id;

        // Filter mock logs for this transaction
        const logs = mockActivityLogs
            .filter(log => log.transaction_id === transactionId)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return NextResponse.json({ logs });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/transactions/[id]/activity
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const transactionId = params.id;
        const body = await request.json();
        const { action_type, description, metadata, actor_id, actor_type } = body;

        const newLog = {
            id: nanoid(),
            transaction_id: transactionId,
            actor_id: actor_id || "unknown",
            actor_type: actor_type || "system",
            action_type,
            description,
            metadata: metadata || {},
            created_at: new Date().toISOString(),
        };

        mockActivityLogs.push(newLog);

        return NextResponse.json({ log: newLog });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
