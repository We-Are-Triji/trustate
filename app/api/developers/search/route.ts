import { NextRequest, NextResponse } from "next/server";
import { developersData } from "@/lib/mock/developers-data";

// GET /api/developers/search?q=query
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q")?.toLowerCase();

        if (!query) {
            return NextResponse.json({ developers: [] });
        }

        const filtered = developersData
            .filter((dev) => dev.name.toLowerCase().includes(query))
            .map((dev) => ({
                id: dev.id,
                name: dev.name,
                logo: dev.logo,
            }))
            .slice(0, 5); // Limit to 5 results

        return NextResponse.json({ developers: filtered });
    } catch (error) {
        console.error("Developer search error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
