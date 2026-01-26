import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();

        const body = await request.json();
        const { developer_name, package_items } = body;

        // Update progress to mark developer_accepted
        const { error } = await supabase
            .from("transaction_step_progress")
            .update({ developer_accepted: true })
            .eq("transaction_id", id);

        if (error) {
            console.error("Error updating progress:", error);
            return NextResponse.json({ error: "Failed to transmit" }, { status: 500 });
        }

        // Log activity
        await supabase.from("activity_logs").insert({
            transaction_id: id,
            action_type: "transmit",
            description: `Package transmitted to ${developer_name}`,
            actor_type: "agent",
            actor_id: "agent",
            metadata: { package_items }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Transmit error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
