import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const brokerId = req.nextUrl.searchParams.get("brokerId");

    if (!brokerId) {
      return NextResponse.json({ error: "Broker ID required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("broker_nexus")
      .select("nexus_code, totp_secret")
      .eq("broker_id", brokerId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Nexus not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch nexus" }, { status: 500 });
  }
}
