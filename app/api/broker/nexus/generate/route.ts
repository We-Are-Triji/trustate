import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { customAlphabet } from "nanoid";
import { generateTOTPSecret } from "@/lib/totp";

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

export async function POST(req: NextRequest) {
    try {
        const { brokerId } = await req.json();

        if (!brokerId) {
            return NextResponse.json(
                { error: "Broker ID is required" },
                { status: 400 }
            );
        }

        const nexusCode = nanoid();
        const totpSecret = generateTOTPSecret();
        const supabase = getSupabaseAdmin();

        const { error } = await supabase
            .from("broker_nexus")
            .upsert(
                {
                    broker_id: brokerId,
                    nexus_code: nexusCode,
                    totp_secret: totpSecret,
                },
                { onConflict: "broker_id" }
            );

        if (error) {
            console.error("Generate nexus error:", error);
            return NextResponse.json(
                { error: "Failed to generate nexus link" },
                { status: 500 }
            );
        }

        return NextResponse.json({ nexus_code: nexusCode, totp_secret: totpSecret });
    } catch (error) {
        console.error("Generate nexus error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
