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

        // Fetch documents (allow access for demo/client view)
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
                "uploaded-by": "client",
                "original-name": file_name,
            },
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        // Create document record in database
        const { data: document, error } = await supabase
            .from("transaction_documents")
            .insert({
                transaction_id: id,
                uploaded_by: "client",
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

        // Auto-accept payment proof for clients (mock purposes)
        if (document_type === "payment_proof") {
            await supabase
                .from("transaction_step_progress")
                .update({ payment_confirmed: true })
                .eq("transaction_id", id);
        }

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
