import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// POST: Confirm payment (agent action)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const { action } = body;

    if (action === "confirm") {
        // Update step progress
        const { error: progressError } = await supabase
            .from("transaction_step_progress")
            .update({ payment_confirmed: true })
            .eq("transaction_id", transactionId);

        if (progressError) {
            console.error("Failed to update progress:", progressError);
            return NextResponse.json({ error: progressError.message }, { status: 500 });
        }

        // Log activity
        await supabase.from("transaction_activity").insert({
            transaction_id: transactionId,
            activity_type: "payment_confirmed",
            title: "Reservation Payment Confirmed",
            description: "Agent confirmed the reservation payment",
            actor_type: "agent",
        });

        return NextResponse.json({ success: true, message: "Payment confirmed" });
    }

    if (action === "reject") {
        // Log rejection
        await supabase.from("transaction_activity").insert({
            transaction_id: transactionId,
            activity_type: "payment_rejected",
            title: "Payment Rejected",
            description: "Agent rejected the payment proof. Client needs to re-upload.",
            actor_type: "agent",
        });

        return NextResponse.json({ success: true, message: "Payment rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// GET: Get payment status
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();

    // Get progress
    const { data: progress } = await supabase
        .from("transaction_step_progress")
        .select("payment_confirmed")
        .eq("transaction_id", transactionId)
        .single();

    // Check for payment proof document
    const { data: docs } = await supabase
        .from("transaction_documents")
        .select("id, status")
        .eq("transaction_id", transactionId)
        .eq("document_type", "payment_proof")
        .order("created_at", { ascending: false })
        .limit(1);

    const hasPaymentProof = docs && docs.length > 0;
    const paymentConfirmed = progress?.payment_confirmed || false;

    let status: "pending" | "uploaded" | "reviewing" | "confirmed";
    if (paymentConfirmed) {
        status = "confirmed";
    } else if (hasPaymentProof) {
        status = "reviewing";
    } else {
        status = "pending";
    }

    return NextResponse.json({
        payment_confirmed: paymentConfirmed,
        has_proof: hasPaymentProof,
        status
    });
}
