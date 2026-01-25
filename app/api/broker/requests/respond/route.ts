import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
    try {
        const { requestId, action, brokerId } = await req.json();

        if (!requestId || !action || !brokerId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (action !== "accept" && action !== "reject") {
            return NextResponse.json(
                { error: "Invalid action" },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        // Verify the request belongs to this broker first (security check)
        // Although the update clause with eq('broker_id', brokerId) implicitly does this,
        // explicitly checking is good practice or just relying on the update count.

        const status = action === "accept" ? "accepted" : "rejected";

        const { data, error } = await supabase
            .from("agent_broker_requests")
            .update({
                status: status,
                responded_at: new Date().toISOString()
            })
            .eq("id", requestId)
            .eq("broker_id", brokerId)
            .select();

        if (error) {
            console.error("Error updating request:", error);
            return NextResponse.json(
                { error: "Failed to update request" },
                { status: 500 }
            );
        }

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: "Request not found or not authorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, request: data[0] });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
