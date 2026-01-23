import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const brokerId = searchParams.get("brokerId");

        if (!brokerId) {
            return NextResponse.json(
                { error: "Broker ID is required" },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from("broker_nexus")
            .select("nexus_code, totp_secret")
            .eq("broker_id", brokerId)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: "Nexus link not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Fetch nexus error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
