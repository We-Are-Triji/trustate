import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// GET: Fetch step progress for a transaction
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();

    // Fetch progress
    const { data: progress, error } = await supabase
        .from("transaction_step_progress")
        .select("*")
        .eq("transaction_id", transactionId)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Error fetching step progress:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no progress record exists, create one
    if (!progress) {
        const { data: newProgress, error: createError } = await supabase
            .from("transaction_step_progress")
            .insert({ transaction_id: transactionId })
            .select()
            .single();

        if (createError) {
            console.error("Error creating step progress:", createError);
            return NextResponse.json({ error: createError.message }, { status: 500 });
        }

        return NextResponse.json({ progress: newProgress });
    }

    return NextResponse.json({ progress });
}

// PATCH: Update step progress
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();
    const body = await request.json();

    // Allowed fields to update
    const allowedFields = [
        "documents_uploaded",
        "ra_uploaded",
        "bis_uploaded",
        "client_joined",
        "payment_confirmed",
        "kyc_completed",
        "documents_signed",
        "developer_accepted",
        "commission_released"
    ];

    // Filter to only allowed fields
    const updates: Record<string, boolean> = {};
    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updates[field] = body[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // Update progress
    const { data: progress, error } = await supabase
        .from("transaction_step_progress")
        .update(updates)
        .eq("transaction_id", transactionId)
        .select()
        .single();

    if (error) {
        console.error("Error updating step progress:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    try {
        await supabase.from("transaction_activity").insert({
            transaction_id: transactionId,
            activity_type: "step_progress",
            title: "Step Progress Updated",
            description: `Updated: ${Object.keys(updates).join(", ")}`,
            actor_type: "agent",
        });
    } catch (logError) {
        console.error("Failed to log activity:", logError);
    }

    return NextResponse.json({ progress });
}
