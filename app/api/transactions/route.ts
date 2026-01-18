import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fetchUserAttributes } from "aws-amplify/auth";
import type { CreateTransactionInput } from "@/lib/types/transaction";

function generateAccessCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from Cognito
    const attributes = await fetchUserAttributes();
    const agentId = attributes.sub;
    const accountType = attributes["custom:account_type"];

    if (accountType !== "agent") {
      return NextResponse.json(
        { error: "Only agents can create transactions" },
        { status: 403 }
      );
    }

    const body: CreateTransactionInput = await request.json();
    const { property_address, property_type, transaction_value, broker_id } = body;

    if (!property_address || !property_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate access code (valid for 7 days)
    const accessCode = generateAccessCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        agent_id: agentId,
        broker_id,
        property_address,
        property_type,
        transaction_value,
        access_code: accessCode,
        access_code_expires_at: expiresAt.toISOString(),
        status: "initiated",
      })
      .select()
      .single();

    if (transactionError) {
      console.error("Transaction creation error:", transactionError);
      return NextResponse.json(
        { error: "Failed to create transaction" },
        { status: 500 }
      );
    }

    // Add agent as participant
    const { error: participantError } = await supabase
      .from("transaction_participants")
      .insert({
        transaction_id: transaction.id,
        user_id: agentId,
        role: "agent",
      });

    if (participantError) {
      console.error("Participant creation error:", participantError);
    }

    // Add broker as participant if provided
    if (broker_id) {
      await supabase.from("transaction_participants").insert({
        transaction_id: transaction.id,
        user_id: broker_id,
        role: "broker",
      });
    }

    // Log transaction creation
    await supabase.from("transaction_logs").insert({
      transaction_id: transaction.id,
      actor_id: agentId,
      actor_role: "agent",
      action: "created_transaction",
      details: { property_address, property_type },
    });

    // Generate shareable link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const shareableLink = `${baseUrl}/transaction/${transaction.id}`;

    return NextResponse.json({
      transaction,
      access_code: accessCode,
      shareable_link: shareableLink,
      expires_at: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
