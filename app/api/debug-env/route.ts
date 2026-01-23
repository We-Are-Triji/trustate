import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const envKeys = Object.keys(process.env).sort();
    const supabaseStart = process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 10) + "..." : "MISSING";
    const keyPresent = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    return NextResponse.json({
        keys: envKeys,
        diagnostics: {
            NEXT_PUBLIC_SUPABASE_URL_PREFIX: supabaseStart,
            SUPABASE_SERVICE_ROLE_KEY_PRESENT: keyPresent,
            NODE_ENV: process.env.NODE_ENV,
        }
    });
}
