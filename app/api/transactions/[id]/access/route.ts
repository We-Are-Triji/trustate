import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

// GET - Check if user has access
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: transactionId } = await params;
    const userId = request.headers.get("x-user-id");

    // Check if user is a participant
    if (userId) {
      const { data: participant } = await supabase
        .from("transaction_participants")
        .select("*")
        .eq("transaction_id", transactionId)
        .eq("user_id", userId)
        .single();

      if (participant) {
        return NextResponse.json({ access: true });
      }
    }

    // Check if access code was verified (stored in cookie)
    const cookieStore = await cookies();
    const accessCookie = cookieStore.get(`transaction_access_${transactionId}`);
    
    if (accessCookie?.value === "granted") {
      return NextResponse.json({ access: true });
    }

    return NextResponse.json({ access: false }, { status: 403 });
  } catch (error) {
    console.error("Access check error:", error);
    return NextResponse.json({ error: "Failed to check access" }, { status: 500 });
  }
}

// POST - Verify access code and grant access
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: transactionId } = await params;
    const body = await request.json();
    const { access_code } = body;

    if (!access_code) {
      return NextResponse.json({ error: "Access code required" }, { status: 400 });
    }

    // Get transaction and verify code
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .single();

    if (txError || !transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Check if code matches and hasn't expired
    if (transaction.access_code !== access_code.toUpperCase()) {
      return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
    }

    const expiresAt = new Date(transaction.access_code_expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: "Access code expired" }, { status: 401 });
    }

    // Get user ID if authenticated
    const userId = request.headers.get("x-user-id");

    // If user is authenticated and is the client, add them as participant
    if (userId && !transaction.client_id) {
      await supabase
        .from("transactions")
        .update({ 
          client_id: userId,
          status: "client_joined"
        })
        .eq("id", transactionId);

      await supabase
        .from("transaction_participants")
        .insert({
          transaction_id: transactionId,
          user_id: userId,
          role: "client",
        });

      // Log client joining
      await supabase.from("transaction_logs").insert({
        transaction_id: transactionId,
        actor_id: userId,
        actor_role: "client",
        action: "joined_transaction",
      });
    }

    // Set access cookie (valid for 30 days)
    const response = NextResponse.json({ access: true });
    response.cookies.set(`transaction_access_${transactionId}`, "granted", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Access verification error:", error);
    return NextResponse.json({ error: "Failed to verify access" }, { status: 500 });
  }
}
