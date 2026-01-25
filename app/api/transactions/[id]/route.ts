import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/transactions/[id] - Get single transaction
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();

        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch transaction with participants
        const { data: transaction, error } = await supabase
            .from("transactions")
            .select(`
        *,
        transaction_participants(user_id, role, joined_at),
        transaction_documents(id, document_type, file_name, status, created_at)
      `)
            .eq("id", id)
            .single();

        if (error || !transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        // Check if user is a participant
        const isParticipant = transaction.transaction_participants?.some(
            (p: { user_id: string }) => p.user_id === userId
        );

        if (!isParticipant) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        return NextResponse.json({ transaction });
    } catch (error) {
        console.error("Transaction GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH /api/transactions/[id] - Update transaction
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();

        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const allowedFields = [
            "status",
            "lifecycle_step",
            "project_name",
            "unit_address",
            "transaction_value",
            "client_name",
            "reservation_number",
        ];

        // Filter to only allowed fields
        const updates: Record<string, unknown> = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates[field] = body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
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

        // Update transaction
        const { data: transaction, error } = await supabase
            .from("transactions")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating transaction:", error);
            return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
        }

        // Log the update
        await supabase.from("transaction_logs").insert({
            transaction_id: id,
            actor_id: userId,
            actor_role: participant.role,
            action: "transaction_updated",
            details: updates,
        });

        return NextResponse.json({ transaction });
    } catch (error) {
        console.error("Transaction PATCH error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/transactions/[id] - Cancel transaction
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();

        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify user is the agent (only agents can cancel)
        const { data: transaction } = await supabase
            .from("transactions")
            .select("agent_id, status")
            .eq("id", id)
            .single();

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        if (transaction.agent_id !== userId) {
            console.warn(`Delete blocked: agent_id=${transaction.agent_id} vs request_user=${userId}`);
            // Allow demo-user to delete for testing if agent_id is null or different?
            // For now, stricter check but detailed log.
            return NextResponse.json({ error: "Only the agent can cancel this transaction" }, { status: 403 });
        }

        if (transaction.status === "completed" || transaction.status === "cancelled") {
            return NextResponse.json({ error: "Cannot cancel a completed or already cancelled transaction" }, { status: 400 });
        }

        // Update status to cancelled
        const { error } = await supabase
            .from("transactions")
            .update({ status: "cancelled" })
            .eq("id", id);

        if (error) {
            console.error("Error cancelling transaction:", error);
            return NextResponse.json({ error: "Failed to cancel transaction" }, { status: 500 });
        }

        // Log the cancellation
        await supabase.from("transaction_logs").insert({
            transaction_id: id,
            actor_id: userId,
            actor_role: "agent",
            action: "transaction_cancelled",
        });

        return NextResponse.json({ message: "Transaction cancelled" });
    } catch (error) {
        console.error("Transaction DELETE error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
