import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// POST: Transmit package to developer
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const { developer_name, package_items } = body;

    // 1. Update transaction status
    const { error: txError } = await supabase
        .from("transactions")
        .update({
            status: "transmitted",
            transmitted_at: new Date().toISOString(),
            developer_name,
            is_locked: true
        })
        .eq("id", transactionId);

    if (txError) {
        console.error("Failed to update transaction:", txError);
        return NextResponse.json({ error: txError.message }, { status: 500 });
    }

    // 2. Create transmittal record
    const transmittalId = `TXM-${Date.now()}`;
    const { data: transmittal, error: transmitError } = await supabase
        .from("transmittals")
        .insert({
            id: transmittalId,
            transaction_id: transactionId,
            developer_name,
            package_items,
            transmitted_at: new Date().toISOString(),
            status: "sent"
        })
        .select()
        .single();

    if (transmitError && transmitError.code !== "42P01") {
        // Table might not exist yet, continue anyway
        console.error("Failed to create transmittal:", transmitError);
    }

    // 3. Update step progress
    const { error: progressError } = await supabase
        .from("transaction_step_progress")
        .update({ developer_accepted: true })
        .eq("transaction_id", transactionId);

    if (progressError) {
        console.error("Failed to update progress:", progressError);
    }

    // 4. Create transmittal receipt document entry
    const { error: docError } = await supabase
        .from("transaction_documents")
        .insert({
            transaction_id: transactionId,
            file_name: `Transmittal_Receipt_${transmittalId}.pdf`,
            file_url: `/api/transactions/${transactionId}/transmittal/receipt`,
            document_type: "transmittal_receipt",
            status: "signed",
            uploaded_by: "system"
        });

    if (docError && docError.code !== "23505") {
        console.error("Failed to create receipt document:", docError);
    }

    // 5. Log activity
    await supabase.from("transaction_activity").insert({
        transaction_id: transactionId,
        activity_type: "developer_handoff",
        title: "Package Transmitted to Developer",
        description: `Package transmitted to ${developer_name}. Transaction is now locked.`,
        actor_type: "agent",
    });

    return NextResponse.json({
        success: true,
        transmittal_id: transmittalId,
        message: "Package transmitted successfully. Transaction is now in read-only mode."
    });
}

// GET: Get transmittal status
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();

    const { data: transaction } = await supabase
        .from("transactions")
        .select("status, transmitted_at, developer_name, is_locked")
        .eq("id", transactionId)
        .single();

    if (!transaction) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Get package items (documents)
    const { data: documents } = await supabase
        .from("transaction_documents")
        .select("file_name, document_type, status")
        .eq("transaction_id", transactionId)
        .in("document_type", ["reservation_agreement", "buyers_info_sheet", "payment_proof", "id_document"]);

    return NextResponse.json({
        transmitted: transaction.status === "transmitted",
        transmitted_at: transaction.transmitted_at,
        developer_name: transaction.developer_name,
        is_locked: transaction.is_locked,
        package_items: documents || []
    });
}
