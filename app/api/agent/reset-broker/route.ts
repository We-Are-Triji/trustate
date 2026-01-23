import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { agentId } = await req.json();

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID required" },
        { status: 400 }
      );
    }

    // Delete existing pending requests
    const { error } = await supabase
      .from("agent_broker_requests")
      .delete()
      .eq("agent_id", agentId)
      .eq("status", "pending");

    if (error) {
      console.error("Delete error:", error);
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
