import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role for backend
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/transactions/[id]/activity
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const transactionId = params.id;
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = (page - 1) * limit;

        const { data: logs, error, count } = await supabase
            .from("activity_logs")
            .select("id, actor_id, actor_type, action_type, description, created_at, metadata", { count: "exact" })
            .eq("transaction_id", transactionId)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return NextResponse.json({
            logs,
            pagination: {
                page,
                limit,
                total: count,
                hasMore: (count || 0) > (offset + limit)
            }
        });
    } catch (error) {
        console.error("Activity API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/transactions/[id]/activity
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const transactionId = params.id;
        const body = await request.json();
        const { action_type, description, metadata, actor_id, actor_type } = body;

        const { data: newLog, error } = await supabase
            .from("activity_logs")
            .insert({
                transaction_id: transactionId,
                actor_id: actor_id || "unknown",
                actor_type: actor_type || "system",
                action_type,
                description,
                metadata: metadata || {}
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ log: newLog });
    } catch (error) {
        console.error("Activity API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
