import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface SignatureField {
    id: string;
    role: "client" | "agent" | "broker";
    label: string;
    signed: boolean;
    signedAt?: string;
}

interface DocumentSigningRecord {
    id: string;
    document_id: string;
    status: "pending" | "preparing" | "sent" | "signed" | "validated";
    signature_fields: SignatureField[];
}

// GET: Fetch signing records for a transaction
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();

    // Fetch signing records
    const { data: records, error } = await supabase
        .from("document_signing")
        .select("*")
        .eq("transaction_id", transactionId);

    if (error) {
        console.error("Error fetching signing records:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ records: records || [] });
}

// POST: Create or update a signing record
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const { document_id, document_name, action, signature_fields } = body;

    if (action === "prepare") {
        // Create signing record
        const { data, error } = await supabase
            .from("document_signing")
            .upsert({
                transaction_id: transactionId,
                document_id,
                document_name,
                status: "preparing",
                signature_fields: signature_fields || [],
            }, { onConflict: "transaction_id,document_id" })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ record: data });
    }

    if (action === "send") {
        // Update status to sent
        const { data, error } = await supabase
            .from("document_signing")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("transaction_id", transactionId)
            .eq("document_id", document_id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Log activity
        await supabase.from("transaction_activity").insert({
            transaction_id: transactionId,
            activity_type: "document_sent",
            title: "Document Sent for Signature",
            description: `${document_name} has been sent for signature`,
            actor_type: "agent",
        });

        return NextResponse.json({ record: data });
    }

    if (action === "sign") {
        // Sign document
        const { data: existing } = await supabase
            .from("document_signing")
            .select("signature_fields")
            .eq("transaction_id", transactionId)
            .eq("document_id", document_id)
            .single();

        const updatedFields = (existing?.signature_fields || []).map((f: SignatureField) => ({
            ...f,
            signed: true,
            signedAt: new Date().toISOString()
        }));

        const { data, error } = await supabase
            .from("document_signing")
            .update({
                status: "signed",
                signed_at: new Date().toISOString(),
                signature_fields: updatedFields
            })
            .eq("transaction_id", transactionId)
            .eq("document_id", document_id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ record: data });
    }

    if (action === "validate") {
        // Validate all documents
        const { error } = await supabase
            .from("document_signing")
            .update({ status: "validated", validated_at: new Date().toISOString() })
            .eq("transaction_id", transactionId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Update progress
        await supabase
            .from("transaction_step_progress")
            .update({ documents_signed: true })
            .eq("transaction_id", transactionId);

        // Log activity
        await supabase.from("transaction_activity").insert({
            transaction_id: transactionId,
            activity_type: "documents_validated",
            title: "Documents Validated",
            description: "All documents have been signed and validated",
            actor_type: "agent",
        });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
