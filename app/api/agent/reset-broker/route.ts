import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";


export async function POST(req: NextRequest) {
  try {
    const { agentId } = await req.json();

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Check if user has already used their pardon (has a cancelled request)
    const { count, error: countError } = await supabase
      .from("agent_broker_requests")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", agentId)
      .eq("status", "cancelled");

    if (countError) {
      console.error("Count error:", countError);
      return NextResponse.json(
        { error: "Failed to check pardon status" },
        { status: 500 }
      );
    }

    if (count && count >= 1) {
      return NextResponse.json(
        { error: "You have already changed your broker once. Pardon limit reached." },
        { status: 403 }
      );
    }

    // Soft delete: Update existing pending request to 'cancelled'
    const { error } = await supabase
      .from("agent_broker_requests")
      .update({ status: "cancelled" })
      .eq("agent_id", agentId)
      .eq("status", "pending");

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: "Failed to reset broker request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
