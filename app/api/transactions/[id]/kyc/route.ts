import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface KYCRecord {
    id: string;
    transaction_id: string;
    status: "pending" | "id_uploaded" | "selfie_uploaded" | "analyzing" | "passed" | "approved" | "failed";
    id_document_url?: string;
    selfie_url?: string;
    analysis_score?: number;
    analysis_complete: boolean;
    agent_approved: boolean;
    created_at: string;
    updated_at: string;
}

// GET: Fetch KYC status
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();

    // Fetch KYC record
    const { data: kyc, error } = await supabase
        .from("kyc_records")
        .select("*")
        .eq("transaction_id", transactionId)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Error fetching KYC:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return default if no record exists
    if (!kyc) {
        return NextResponse.json({
            status: "pending",
            id_uploaded: false,
            selfie_uploaded: false,
            analysis_complete: false,
            analysis_score: null,
            agent_approved: false
        });
    }

    return NextResponse.json({
        status: kyc.status,
        id_uploaded: !!kyc.id_document_url,
        selfie_uploaded: !!kyc.selfie_url,
        analysis_complete: kyc.analysis_complete,
        analysis_score: kyc.analysis_score,
        agent_approved: kyc.agent_approved
    });
}

// POST: Update KYC status
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: transactionId } = await params;
    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const { action, id_document_url, selfie_url } = body;

    // Get or create KYC record
    let { data: existing } = await supabase
        .from("kyc_records")
        .select("*")
        .eq("transaction_id", transactionId)
        .single();

    if (!existing) {
        // Create new record
        const { data: newRecord, error } = await supabase
            .from("kyc_records")
            .insert({
                transaction_id: transactionId,
                status: "pending",
                analysis_complete: false,
                agent_approved: false
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        existing = newRecord;
    }

    // Handle actions
    if (action === "upload_id") {
        const { error } = await supabase
            .from("kyc_records")
            .update({
                id_document_url,
                status: "id_uploaded",
                updated_at: new Date().toISOString()
            })
            .eq("transaction_id", transactionId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, status: "id_uploaded" });
    }

    if (action === "upload_selfie") {
        const { error } = await supabase
            .from("kyc_records")
            .update({
                selfie_url,
                status: "selfie_uploaded",
                updated_at: new Date().toISOString()
            })
            .eq("transaction_id", transactionId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, status: "selfie_uploaded" });
    }

    if (action === "start_analysis") {
        // Begin mocked analysis
        const { error } = await supabase
            .from("kyc_records")
            .update({
                status: "analyzing",
                updated_at: new Date().toISOString()
            })
            .eq("transaction_id", transactionId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Simulate async analysis (would be done by background job in production)
        // For now, we'll complete it in the same request after a short delay conceptually
        // In real implementation, this would be a separate worker
        setTimeout(async () => {
            await supabase
                .from("kyc_records")
                .update({
                    status: "passed",
                    analysis_complete: true,
                    analysis_score: 98, // Mocked score
                    updated_at: new Date().toISOString()
                })
                .eq("transaction_id", transactionId);
        }, 3000); // 3 second mock delay

        return NextResponse.json({ success: true, status: "analyzing" });
    }

    if (action === "complete_analysis") {
        // Called by system/worker when analysis is done
        const { error } = await supabase
            .from("kyc_records")
            .update({
                status: "passed",
                analysis_complete: true,
                analysis_score: body.score || 98,
                updated_at: new Date().toISOString()
            })
            .eq("transaction_id", transactionId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Log activity
        await supabase.from("transaction_activity").insert({
            transaction_id: transactionId,
            activity_type: "kyc_analysis_complete",
            title: "Identity Analysis Complete",
            description: `Biometric analysis passed with score: ${body.score || 98}%`,
            actor_type: "system",
        });

        return NextResponse.json({ success: true, status: "passed" });
    }

    if (action === "agent_approve") {
        // Agent final approval
        const { error } = await supabase
            .from("kyc_records")
            .update({
                status: "approved",
                agent_approved: true,
                updated_at: new Date().toISOString()
            })
            .eq("transaction_id", transactionId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Update step progress
        await supabase
            .from("transaction_step_progress")
            .update({ kyc_completed: true })
            .eq("transaction_id", transactionId);

        // Log activity
        await supabase.from("transaction_activity").insert({
            transaction_id: transactionId,
            activity_type: "kyc_approved",
            title: "Identity Verified & Approved",
            description: "Agent approved client identity verification",
            actor_type: "agent",
        });

        return NextResponse.json({ success: true, status: "approved" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
