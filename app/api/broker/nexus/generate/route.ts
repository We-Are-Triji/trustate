import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { generateTOTPSecret } from "@/lib/totp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { brokerId } = await req.json();

    if (!brokerId) {
      return NextResponse.json({ error: "Broker ID required" }, { status: 400 });
    }

    // Check if nexus already exists
    const { data: existing } = await supabase
      .from("broker_nexus")
      .select("nexus_code")
      .eq("broker_id", brokerId)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Nexus already exists" }, { status: 400 });
    }

    // Generate unique nexus code and TOTP secret
    const nexusCode = nanoid(12);
    const totpSecret = generateTOTPSecret();

    const { data, error } = await supabase
      .from("broker_nexus")
      .insert({
        broker_id: brokerId,
        nexus_code: nexusCode,
        totp_secret: totpSecret,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ nexusCode });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate nexus" }, { status: 500 });
  }
}
