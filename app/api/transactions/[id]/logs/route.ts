import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/transactions/[id]/logs - Get activity logs for transaction
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();

        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify user is a participant
        const { data: participant } = await supabase
            .from("transaction_participants")
            .select("role")
            .eq("transaction_id", id)
            .eq("user_id", userId)
            .single();

        if (!participant) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Fetch all logs except messages (for audit trail)
        const { data: logs, error } = await supabase
            .from("transaction_logs")
            .select("id, actor_id, actor_role, action, details, created_at")
            .eq("transaction_id", id)
            .neq("action", "message") // Exclude chat messages from audit log
            .order("created_at", { ascending: false })
            .limit(50);

        if (error) {
            console.error("Error fetching logs:", error);
            return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
        }

        return NextResponse.json({ logs: logs || [] });
    } catch (error) {
        console.error("Logs GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
