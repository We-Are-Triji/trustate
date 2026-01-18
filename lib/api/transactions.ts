import type { CreateTransactionInput, Transaction } from "@/lib/types/transaction";
import { fetchUserAttributes } from "aws-amplify/auth";

interface CreateTransactionResponse {
  transaction: Transaction;
  access_code: string;
  shareable_link: string;
  expires_at: string;
}

export async function createTransaction(
  input: CreateTransactionInput
): Promise<CreateTransactionResponse> {
  // Get user attributes for auth headers
  const attributes = await fetchUserAttributes();
  const userId = attributes.sub;
  const accountType = attributes["custom:account_type"];

  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId || "",
      "x-account-type": accountType || "",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create transaction");
  }

  return response.json();
}
