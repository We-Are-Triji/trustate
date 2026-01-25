import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface RouteParams {
    params: Promise<{ id: string; stepId: string }>;
}

// PATCH /api/transactions/[id]/steps/[stepId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id, stepId } = await params;
        const supabase = getSupabaseAdmin();
        const body = await request.json();

        const { data: step, error } = await supabase
            .from("transaction_steps")
            .update(body)
            .eq("id", stepId)
            .eq("transaction_id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating step:", error);
            return NextResponse.json({ error: "Failed to update step" }, { status: 500 });
        }

        return NextResponse.json({ step });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// DELETE /api/transactions/[id]/steps/[stepId]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id, stepId } = await params;
        const supabase = getSupabaseAdmin();

        const { error } = await supabase
            .from("transaction_steps")
            .delete()
            .eq("id", stepId)
            .eq("transaction_id", id);

        if (error) {
            return NextResponse.json({ error: "Failed to delete step" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
