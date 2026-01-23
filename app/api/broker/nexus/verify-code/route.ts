import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TOTP } from "otplib";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { nexusCode, totpCode, agentId } = await req.json();

    if (!nexusCode || !totpCode || !agentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch TOTP secret
    const { data: nexusData, error: nexusError } = await supabase
      .from("broker_nexus")
      .select("broker_id, totp_secret")
      .eq("nexus_code", nexusCode.toUpperCase())
      .single();

    if (nexusError || !nexusData) {
      return NextResponse.json(
        { error: "Invalid nexus code" },
        { status: 404 }
      );
    }

    // Verify TOTP
    const totp = new TOTP({ secret: nexusData.totp_secret });
    const isValid = totp.verify(totpCode);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 401 }
      );
    }

    // Create agent-broker request
    const { error: requestError } = await supabase
      .from("agent_broker_requests")
      .insert({
        agent_id: agentId,
        broker_id: nexusData.broker_id,
        status: "pending",
      });

    if (requestError) {
      console.error("Request creation error:", requestError);
      return NextResponse.json(
        { error: "Failed to create broker request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
