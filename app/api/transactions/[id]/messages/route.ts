import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/transactions/[id]/messages - Get messages for transaction
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();

        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify user is a participant
        const { data: participant } = await supabase
            .from("transaction_participants")
            .select("role")
            .eq("transaction_id", id)
            .eq("user_id", userId)
            .single();

        if (!participant) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Fetch messages (logs with action = 'message')
        const { data: messages, error } = await supabase
            .from("transaction_logs")
            .select(`
                id, 
                actor_id, 
                actor_role, 
                details, 
                created_at,
                agents!transaction_logs_actor_id_fkey(name)
            `)
            .eq("transaction_id", id)
            .eq("action", "message")
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error);
            return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
        }

        // Transform to message format
        const formattedMessages = messages?.map((msg: any) => ({
            id: msg.id,
            sender_id: msg.actor_id,
            sender_name: msg.agents?.name || "Unknown",
            sender_role: msg.actor_role,
            content: (msg.details as { content?: string })?.content || "",
            timestamp: msg.created_at,
        })) || [];

        return NextResponse.json({ messages: formattedMessages });
    } catch (error) {
        console.error("Messages GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/transactions/[id]/messages - Send a message
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();

        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { content } = body;

        if (!content || typeof content !== "string" || content.trim().length === 0) {
            return NextResponse.json({ error: "Message content is required" }, { status: 400 });
        }

        // Verify user is a participant and get their role
        const { data: participant } = await supabase
            .from("transaction_participants")
            .select("role")
            .eq("transaction_id", id)
            .eq("user_id", userId)
            .single();

        if (!participant) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Insert message as a log entry
        const { data: message, error } = await supabase
            .from("transaction_logs")
            .insert({
                transaction_id: id,
                actor_id: userId,
                actor_role: participant.role,
                action: "message",
                details: { content: content.trim() },
            })
            .select()
            .single();

        if (error) {
            console.error("Error sending message:", error);
            return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
        }

        // Update participant's last_seen_at
        await supabase
            .from("transaction_participants")
            .update({ last_seen_at: new Date().toISOString() })
            .eq("transaction_id", id)
            .eq("user_id", userId);

        // Fetch sender name from agents table
        const { data: agentData } = await supabase
            .from("agents")
            .select("name")
            .eq("id", userId)
            .single();

        return NextResponse.json({
            message: {
                id: message.id,
                sender_id: message.actor_id,
                sender_name: agentData?.name || "Unknown",
                sender_role: message.actor_role,
                content: content.trim(),
                timestamp: message.created_at,
            },
        }, { status: 201 });
    } catch (error) {
        console.error("Messages POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
