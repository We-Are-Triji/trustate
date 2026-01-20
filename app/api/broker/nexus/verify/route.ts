import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyTOTPCode } from "@/lib/totp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { nexusCode, totpCode, agentId } = await req.json();

    if (!nexusCode || !totpCode || !agentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find broker by nexus code
    const { data: nexus, error: nexusError } = await supabase
      .from("broker_nexus")
      .select("broker_id, totp_secret")
      .eq("nexus_code", nexusCode)
      .single();

    if (nexusError || !nexus) {
      return NextResponse.json({ error: "Invalid nexus code" }, { status: 404 });
    }

    // Verify TOTP code
    const isValid = verifyTOTPCode(nexus.totp_secret, totpCode);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 401 });
    }

    // Create agent-broker request
    const { data, error } = await supabase
      .from("agent_broker_requests")
      .insert({
        agent_id: agentId,
        broker_id: nexus.broker_id,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Request already exists" }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, brokerId: nexus.broker_id });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
