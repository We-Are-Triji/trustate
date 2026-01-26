import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// GET: Fetch client signing status
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();

    // Fetch documents that need client signature
    const { data: documents, error } = await supabase
        .from("transaction_documents")
        .select("id, file_name, document_type, status, created_at")
        .eq("transaction_id", transactionId)
        .in("document_type", ["reservation_agreement", "buyers_info_sheet"]);

    if (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get signing records
    const { data: signingRecords } = await supabase
        .from("document_signing")
        .select("*")
        .eq("transaction_id", transactionId);

    // Check step progress
    const { data: progress } = await supabase
        .from("transaction_step_progress")
        .select("documents_signed")
        .eq("transaction_id", transactionId)
        .single();

    // Determine overall status
    const signedCount = signingRecords?.filter(r =>
        r.status === "signed" || r.status === "validated"
    ).length || 0;
    const totalDocs = documents?.length || 0;
    const allSigned = totalDocs > 0 && signedCount >= totalDocs;
    const validated = progress?.documents_signed || false;

    let status: "pending" | "ready" | "signing" | "submitted" | "validated";
    if (validated) {
        status = "validated";
    } else if (allSigned) {
        status = "submitted";
    } else if (signedCount > 0) {
        status = "signing";
    } else if (totalDocs > 0) {
        status = "ready";
    } else {
        status = "pending";
    }

    return NextResponse.json({
        status,
        documents: documents || [],
        signing_records: signingRecords || [],
        signed_count: signedCount,
        total_documents: totalDocs,
        validated
    });
}

// POST: Client signs a document
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const { action, document_id, document_name, signature_data } = body;

    if (action === "sign") {
        // Create or update signing record
        const { data: existing } = await supabase
            .from("document_signing")
            .select("*")
            .eq("transaction_id", transactionId)
            .eq("document_id", document_id)
            .single();

        if (existing) {
            // Update existing record
            const { error } = await supabase
                .from("document_signing")
                .update({
                    status: "signed",
                    signed_at: new Date().toISOString(),
                    signature_fields: [{
                        id: "client-sig",
                        role: "client",
                        label: "Client Signature",
                        signed: true,
                        signedAt: new Date().toISOString(),
                        signature_data
                    }]
                })
                .eq("id", existing.id);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        } else {
            // Create new record
            const { error } = await supabase
                .from("document_signing")
                .insert({
                    transaction_id: transactionId,
                    document_id,
                    document_name,
                    status: "signed",
                    signed_at: new Date().toISOString(),
                    signature_fields: [{
                        id: "client-sig",
                        role: "client",
                        label: "Client Signature",
                        signed: true,
                        signedAt: new Date().toISOString(),
                        signature_data
                    }]
                });

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        }

        // Log activity
        await supabase.from("activity_logs").insert({
            transaction_id: transactionId,
            action_type: "document_signed",
            description: `Client signed: ${document_name}`,
            actor_type: "client",
            actor_id: "client", // placeholder until we have client auth
            metadata: { document_id, document_name }
        });

        return NextResponse.json({ success: true, message: "Document signed" });
    }

    if (action === "submit_all") {
        // Mark all documents as submitted for validation
        const { error } = await supabase
            .from("document_signing")
            .update({ status: "signed" })
            .eq("transaction_id", transactionId)
            .eq("status", "preparing");

        if (error) {
            console.error("Failed to submit documents:", error);
        }

        // Log activity
        await supabase.from("transaction_activity").insert({
            transaction_id: transactionId,
            activity_type: "documents_submitted",
            title: "Documents Submitted for Validation",
            description: "Client submitted all signed documents for agent validation",
            actor_type: "client",
        });

        return NextResponse.json({ success: true, message: "Documents submitted" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
