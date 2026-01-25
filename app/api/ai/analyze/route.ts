import { NextRequest, NextResponse } from "next/server";
import { TextractClient, DetectDocumentTextCommand } from "@aws-sdk/client-textract";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const textractClient = new TextractClient({
    region: process.env.AWS_REGION || "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
    },
});

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
    },
});

const S3_BUCKET = process.env.AWS_S3_DOCUMENTS_BUCKET || "trustate-documents";

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { documentId, s3Key } = body;

        if (!s3Key) {
            return NextResponse.json({ error: "Missing s3Key" }, { status: 400 });
        }

        // 1. Download file content from S3
        // We do this to avoid configuring complex cross-service permission policies for now.
        // Passing bytes directly to Textract is robust for this scale.
        const getObjectCommand = new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: s3Key,
        });

        const s3Response = await s3Client.send(getObjectCommand);

        if (!s3Response.Body) {
            return NextResponse.json({ error: "Failed to retrieve file content" }, { status: 500 });
        }

        // Convert stream to buffer
        const byteArray = await s3Response.Body.transformToByteArray();

        // 2. Call Textract
        const textractCommand = new DetectDocumentTextCommand({
            Document: {
                Bytes: byteArray,
            },
        });

        const textractResponse = await textractClient.send(textractCommand);

        // 3. Process Blocks
        const lines: string[] = [];
        if (textractResponse.Blocks) {
            for (const block of textractResponse.Blocks) {
                if (block.BlockType === "LINE" && block.Text) {
                    lines.push(block.Text);
                }
            }
        }

        const fullText = lines.join("\n");

        return NextResponse.json({
            text: fullText,
            raw: textractResponse.Blocks // Optional: return raw blocks if needed for bounding boxes later
        });

    } catch (error) {
        console.error("Analysis failed:", error);
        return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
    }
}
