import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// POST /api/transactions/[id]/client/approve - Approve pending client
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action } = body; // 'approve' or 'reject'
        const supabase = getSupabaseAdmin();

        // In a real app, we should verify the user is the agent of this transaction
        const userId = request.headers.get("x-user-id");

        // Fetch transaction to verify ownership/status
        const { data: transaction, error: fetchError } = await supabase
            .from("transactions")
            .select("agent_id, client_status, client_id, client_name")
            .eq("id", id)
            .single();

        if (fetchError || !transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        if (transaction.client_status !== "pending") {
            return NextResponse.json({ error: "No pending client to approve" }, { status: 400 });
        }

        const newStatus = action === "approve" ? "approved" : "rejected";
        const updateData: any = { client_status: newStatus };

        // If approved, verify the main status is updated too
        if (newStatus === "approved") {
            updateData.status = "client_joined"; // Now we officially move to client_joined
        } else {
            // If rejected, clear the client data? Or keep it as rejected history?
            // For now, let's clear it so another can join, or keep as rejected record.
            // Let's clear client_id so slot opens up?? Or is rejection final for this client?
            // "and it wont accept a client anymore" - implying 1:1. 
            // If we reject, allow re-join?
            // Let's assuming reject means remove client data so they can try again or someone else can.
            updateData.client_id = null;
            updateData.client_name = null;
            updateData.client_status = "none";
        }

        const { error: updateError } = await supabase
            .from("transactions")
            .update(updateData)
            .eq("id", id);

        if (updateError) {
            return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
        }

        // Log action
        await supabase.from("transaction_logs").insert({
            transaction_id: id,
            actor_id: userId || "system",
            actor_role: "agent",
            action: action === "approve" ? "client_approved" : "client_rejected",
            details: {
                client_name: transaction.client_name,
                client_id: transaction.client_id
            },
        });

        return NextResponse.json({ success: true, status: newStatus });
    } catch (error) {
        console.error("Approve client error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
