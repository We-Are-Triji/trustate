import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { S3Client, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface RouteParams {
    params: Promise<{ id: string; docId: string }>;
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
    },
});

const S3_BUCKET = process.env.AWS_S3_DOCUMENTS_BUCKET || "trustate-documents";

// GET /api/transactions/[id]/documents/[docId] - Get document details and download URL
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id, docId } = await params;
        const supabase = getSupabaseAdmin();

        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

        // Fetch document
        const { data: document, error } = await supabase
            .from("transaction_documents")
            .select("*")
            .eq("id", docId)
            .eq("transaction_id", id)
            .single();

        if (error || !document) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        // Extract S3 key from file_url
        const urlParts = document.file_url.split(".amazonaws.com/");
        const s3Key = urlParts[1] || "";

        // Generate presigned download URL (valid for 1 hour)
        let downloadUrl = document.file_url;
        if (s3Key) {
            const command = new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: s3Key,
            });
            downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        }

        return NextResponse.json({
            document: {
                ...document,
                download_url: downloadUrl,
            },
        });
    } catch (error) {
        console.error("Document GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH /api/transactions/[id]/documents/[docId] - Update document status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id, docId } = await params;
        const supabase = getSupabaseAdmin();

        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { status, ai_analysis } = body;

        const allowedStatuses = ["pending", "reviewed", "flagged", "acknowledged"];
        if (status && !allowedStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
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

        // Build update object
        const updates: Record<string, unknown> = {};
        if (status) updates.status = status;
        if (ai_analysis) updates.ai_analysis = ai_analysis;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        // Update document
        const { data: document, error } = await supabase
            .from("transaction_documents")
            .update(updates)
            .eq("id", docId)
            .eq("transaction_id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating document:", error);
            return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
        }

        // Log the update
        await supabase.from("transaction_logs").insert({
            transaction_id: id,
            actor_id: userId,
            actor_role: participant.role,
            action: "document_updated",
            details: { document_id: docId, updates },
        });

        return NextResponse.json({ document });
    } catch (error) {
        console.error("Document PATCH error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/transactions/[id]/documents/[docId] - Delete document
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id, docId } = await params;
        const supabase = getSupabaseAdmin();

        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify user is agent or the uploader
        const { data: document } = await supabase
            .from("transaction_documents")
            .select("uploaded_by, file_url")
            .eq("id", docId)
            .eq("transaction_id", id)
            .single();

        if (!document) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        // Check if user is agent or uploader
        const { data: transaction } = await supabase
            .from("transactions")
            .select("agent_id")
            .eq("id", id)
            .single();

        if (document.uploaded_by !== userId && transaction?.agent_id !== userId) {
            return NextResponse.json({ error: "Only the uploader or agent can delete this document" }, { status: 403 });
        }

        // Delete from S3
        const urlParts = document.file_url.split(".amazonaws.com/");
        const s3Key = urlParts[1];
        if (s3Key) {
            try {
                await s3Client.send(new DeleteObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: s3Key,
                }));
            } catch (s3Error) {
                console.error("S3 delete error:", s3Error);
                // Continue with database deletion even if S3 fails
            }
        }

        // Delete from database
        const { error } = await supabase
            .from("transaction_documents")
            .delete()
            .eq("id", docId);

        if (error) {
            console.error("Error deleting document:", error);
            return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
        }

        // Log the deletion
        await supabase.from("transaction_logs").insert({
            transaction_id: id,
            actor_id: userId,
            actor_role: "agent", // Simplified, could determine actual role
            action: "document_deleted",
            details: { document_id: docId },
        });

        return NextResponse.json({ message: "Document deleted" });
    } catch (error) {
        console.error("Document DELETE error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
