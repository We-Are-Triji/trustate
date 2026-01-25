import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const agentId = searchParams.get("agentId");

        if (!agentId) {
            return NextResponse.json({ error: "Agent ID required" }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Check if there is any accepted request for this agent
        const { data, error } = await supabase
            .from("agent_broker_requests")
            .select("status")
            .eq("agent_id", agentId)
            .eq("status", "accepted")
            .limit(1);

        if (error) {
            console.error("Error fetching status:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        if (data && data.length > 0) {
            return NextResponse.json({ status: "verified" });
        }

        return NextResponse.json({ status: "pending_approval" });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
