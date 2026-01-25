import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/transactions/[id]/steps
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();

        const { data: steps, error } = await supabase
            .from("transaction_steps")
            .select("*")
            .eq("transaction_id", id)
            .order("order_index", { ascending: true });

        if (error) {
            console.error("Error fetching steps:", error);
            return NextResponse.json({ error: "Failed to fetch steps" }, { status: 500 });
        }

        return NextResponse.json({ steps: steps || [] });
    } catch (error) {
        console.error("Steps API Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// POST /api/transactions/[id]/steps - Add a step
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();
        const body = await request.json();

        // Validate
        if (!body.step_name) {
            return NextResponse.json({ error: "Missing step_name" }, { status: 400 });
        }

        // Get max order index
        const { data: existing } = await supabase
            .from("transaction_steps")
            .select("order_index")
            .eq("transaction_id", id)
            .order("order_index", { ascending: false })
            .limit(1);

        const nextIndex = (existing?.[0]?.order_index ?? 0) + 1;

        const { data: newStep, error } = await supabase
            .from("transaction_steps")
            .insert({
                transaction_id: id,
                step_name: body.step_name,
                step_description: body.step_description || "",
                status: "locked",
                order_index: nextIndex,
                requires_validation: body.requires_validation || false
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating step:", error);
            return NextResponse.json({ error: "Failed to create step" }, { status: 500 });
        }

        return NextResponse.json({ step: newStep });
    } catch (error) {
        console.error("Steps API Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// PUT /api/transactions/[id]/steps - Bulk Update or Reorder
// For simplicity, let's allow updating a single step via body ID or bulk if array
// Actually simpler to have a separate route for single updates, but let's do bulk replace for reordering if needed.
// Start with basic update via PATCH on a separate route maybe?
// Let's keep this simple: This file is for collection.
// We'll create `[stepId]/route.ts` for individual updates.
