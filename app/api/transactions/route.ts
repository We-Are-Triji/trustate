import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { nanoid } from "nanoid";

// GET /api/transactions - List transactions for authenticated user
export async function GET(request: NextRequest) {
    try {
        const supabase = getSupabaseAdmin();

        // Get user ID from headers (set by middleware after Cognito auth)
        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch transactions where user is a participant
        const { data: transactions, error } = await supabase
            .from("transactions")
            .select(`
        *,
        transaction_participants!inner(user_id, role)
      `)
            .eq("transaction_participants.user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching transactions:", error);
            return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
        }

        return NextResponse.json({ transactions });
    } catch (error) {
        console.error("Transactions GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
    try {
        const supabase = getSupabaseAdmin();

        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            project_name,
            transaction_type,
            unit_address,
            property_type,
            transaction_value,
            client_name,
            reservation_number,
        } = body;

        // Validate required fields
        if (!project_name || !unit_address || !client_name) {
            return NextResponse.json(
                { error: "Missing required fields: project_name, unit_address, client_name" },
                { status: 400 }
            );
        }

        // Generate access code (6 alphanumeric characters)
        const accessCode = nanoid(6).toUpperCase();
        const accessCodeExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Create transaction
        const { data: transaction, error: createError } = await supabase
            .from("transactions")
            .insert({
                agent_id: userId,
                project_name,
                transaction_type: transaction_type || "preselling",
                unit_address,
                property_address: `${project_name} - ${unit_address}`, // For backward compatibility
                property_type: property_type || "condo",
                transaction_value: transaction_value || null,
                client_name,
                reservation_number: reservation_number || null,
                access_code: accessCode,
                access_code_expires_at: accessCodeExpiresAt.toISOString(),
                lifecycle_step: 1,
                status: "documents_pending",
            })
            .select()
            .single();

        if (createError) {
            console.error("Error creating transaction:", createError);
            return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
        }

        // Add agent as participant
        const { error: participantError } = await supabase
            .from("transaction_participants")
            .insert({
                transaction_id: transaction.id,
                user_id: userId,
                role: "agent",
            });

        if (participantError) {
            console.error("Error adding participant:", participantError);
            // Transaction was created, but participant wasn't added - log but don't fail
        }

        // Log the creation
        await supabase.from("transaction_logs").insert({
            transaction_id: transaction.id,
            actor_id: userId,
            actor_role: "agent",
            action: "transaction_created",
            details: { project_name, client_name },
        });

        return NextResponse.json({ transaction }, { status: 201 });
    } catch (error) {
        console.error("Transactions POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
