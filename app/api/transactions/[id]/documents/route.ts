import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

interface RouteParams {
    params: Promise<{ id: string }>;
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
    },
});

const S3_BUCKET = process.env.APP_AWS_S3_DOCUMENTS_BUCKET || "trustate-documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// GET /api/transactions/[id]/documents - List documents
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();

        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            // For client view without login (magic link logic), check if transaction allows public access or token
            // For now, we'll assume logged in participants or loosen check for demo
            // But to fix 401 immediately for logged in users:
            if (!user) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        const userId = user?.id; // Use authenticated user ID

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

        // Fetch documents
        const { data: documents, error } = await supabase
            .from("transaction_documents")
            .select("*")
            .eq("transaction_id", id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching documents:", error);
            return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
        }

        return NextResponse.json({ documents: documents || [] });
    } catch (error) {
        console.error("Documents GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/transactions/[id]/documents - Request presigned upload URL
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();

        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = user.id;

        const body = await request.json();
        const { file_name, file_type, file_size, document_type = "other" } = body;

        // Validate input
        if (!file_name || !file_type || !file_size) {
            return NextResponse.json(
                { error: "Missing required fields: file_name, file_type, file_size" },
                { status: 400 }
            );
        }

        if (file_size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES.includes(file_type)) {
            return NextResponse.json(
                { error: "File type not allowed. Supported: PDF, JPG, PNG, WEBP, DOC, DOCX" },
                { status: 400 }
            );
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

        // Generate unique S3 key
        const fileExtension = file_name.split(".").pop() || "bin";
        const s3Key = `transactions/${id}/${nanoid(12)}.${fileExtension}`;

        // Generate presigned URL (valid for 5 minutes)
        const command = new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: s3Key,
            ContentType: file_type,
            ContentLength: file_size,
            Metadata: {
                "transaction-id": id,
                "uploaded-by": userId,
                "original-name": file_name,
            },
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        // Create document record in database (pending status until upload confirmed)
        const { data: document, error } = await supabase
            .from("transaction_documents")
            .insert({
                transaction_id: id,
                uploaded_by: userId,
                document_type,
                file_name,
                file_url: `https://${S3_BUCKET}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com/${s3Key}`,
                status: "pending",
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating document record:", error);
            return NextResponse.json({ error: "Failed to create document record" }, { status: 500 });
        }

        // Log the upload initiation
        await supabase.from("transaction_logs").insert({
            transaction_id: id,
            actor_id: userId,
            actor_role: participant.role,
            action: "document_upload_initiated",
            details: { document_id: document.id, file_name, document_type },
        });

        return NextResponse.json({
            document,
            upload_url: uploadUrl,
            s3_key: s3Key,
        }, { status: 201 });
    } catch (error) {
        console.error("Documents POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
