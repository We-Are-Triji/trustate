import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// POST /api/transactions/preview - Lookup transaction details by ID
export async function POST(request: NextRequest) {
    try {
        const supabase = getSupabaseAdmin();
        const body = await request.json();
        const { transactionId } = body;

        if (!transactionId) {
            return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
        }

        // Fetch transaction basic public info
        // Only return non-sensitive fields needed for confirmation
        const { data: transaction, error } = await supabase
            .from("transactions")
            .select(`
                id,
                project_name,
                property_address,
                transaction_value,
                property_type,
                transaction_type,
                agent_id
            `)
            .eq("id", transactionId)
            .single();

        if (error || !transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        return NextResponse.json({
            transaction: {
                id: transaction.id,
                project_name: transaction.project_name,
                property_address: transaction.property_address,
                transaction_value: transaction.transaction_value,
                property_type: transaction.property_type,
                transaction_type: transaction.transaction_type
            }
        });

    } catch (error) {
        console.error("Preview transaction error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
