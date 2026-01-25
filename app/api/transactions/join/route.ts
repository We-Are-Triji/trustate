import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// POST /api/transactions/join - Join transaction via access code
export async function POST(request: NextRequest) {
    try {
        const supabase = getSupabaseAdmin();

        const body = await request.json();
        const { access_code, client_email, client_name } = body;

        // Validate input
        if (!access_code || !client_email || !client_name) {
            return NextResponse.json(
                { error: "Missing required fields: access_code, client_email, client_name" },
                { status: 400 }
            );
        }

        // Find transaction by access code
        const { data: transaction, error: findError } = await supabase
            .from("transactions")
            .select("id, status, access_code_expires_at, client_id")
            .eq("access_code", access_code.toUpperCase())
            .single();

        if (findError || !transaction) {
            return NextResponse.json(
                { error: "Invalid access code. Please check and try again." },
                { status: 404 }
            );
        }

        // Check if access code is expired
        const expiresAt = new Date(transaction.access_code_expires_at);
        if (expiresAt < new Date()) {
            return NextResponse.json(
                { error: "This access code has expired. Please contact your agent for a new one." },
                { status: 410 }
            );
        }

        // Check if client already joined
        if (transaction.client_id) {
            return NextResponse.json(
                { error: "A client has already joined this transaction." },
                { status: 409 }
            );
        }

        // Generate a client ID (in production, this would be from Cognito)
        const clientId = `client-${Date.now()}`;

        // Update transaction with client info
        const { error: updateError } = await supabase
            .from("transactions")
            .update({
                client_id: clientId,
                client_name: client_name,
                status: "client_joined",
            })
            .eq("id", transaction.id);

        if (updateError) {
            console.error("Error updating transaction:", updateError);
            return NextResponse.json({ error: "Failed to join transaction" }, { status: 500 });
        }

        // Add client as participant
        await supabase.from("transaction_participants").insert({
            transaction_id: transaction.id,
            user_id: clientId,
            role: "client",
        });

        // Log the join action
        await supabase.from("transaction_logs").insert({
            transaction_id: transaction.id,
            actor_id: clientId,
            actor_role: "client",
            action: "client_joined",
            details: { client_name, client_email },
        });

        return NextResponse.json({
            success: true,
            transaction_id: transaction.id,
            message: "Successfully joined the transaction!",
        });
    } catch (error) {
        console.error("Join transaction error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
