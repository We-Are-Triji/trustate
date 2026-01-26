import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// GET: Fetch handoff status for client
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();

    // Fetch transaction
    const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .select("id, property_address, project_name, developer_name, transmitted_at, is_locked, status, transaction_value")
        .eq("id", transactionId)
        .single();

    if (txError) {
        console.error("Error fetching transaction:", txError);
        return NextResponse.json({ error: txError.message }, { status: 500 });
    }

    // Fetch step progress
    const { data: progress } = await supabase
        .from("transaction_step_progress")
        .select("developer_accepted")
        .eq("transaction_id", transactionId)
        .single();

    // Fetch transmittal record
    const { data: transmittal } = await supabase
        .from("transmittals")
        .select("id, transmitted_at, developer_name, receipt_number")
        .eq("transaction_id", transactionId)
        .single();

    // Determine status
    let status: "pending" | "transmitting" | "completed";
    if (progress?.developer_accepted || transaction?.transmitted_at) {
        status = "completed";
    } else if (transaction?.status === "transmitted") {
        status = "transmitting";
    } else {
        status = "pending";
    }

    return NextResponse.json({
        status,
        transaction: {
            id: transaction.id,
            property_address: transaction.property_address,
            project_name: transaction.project_name,
            developer_name: transaction.developer_name,
            transaction_value: transaction.transaction_value,
            transmitted_at: transaction.transmitted_at,
        },
        transmittal: transmittal || null,
        is_complete: status === "completed",
    });
}

// POST: Simulate handoff completion (for demo/client polling)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const { action } = body;

    if (action === "complete_handoff") {
        // Mark as developer accepted
        const { error } = await supabase
            .from("transaction_step_progress")
            .update({ developer_accepted: true })
            .eq("transaction_id", transactionId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Update transaction status
        await supabase
            .from("transactions")
            .update({
                status: "completed",
                transmitted_at: new Date().toISOString()
            })
            .eq("id", transactionId);

        // Log activity
        await supabase.from("transaction_activity").insert({
            transaction_id: transactionId,
            activity_type: "handoff_complete",
            title: "Developer Handoff Complete",
            description: "Transaction successfully handed off to developer",
            actor_type: "system",
        });

        return NextResponse.json({ success: true, status: "completed" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
