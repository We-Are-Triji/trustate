"use client";

import { MapPin, DollarSign, Calendar, Users, Home, Briefcase, Building2, Hash } from "lucide-react";
import type { Transaction } from "@/lib/types/transaction";
import { ClientInviteSection } from "./client-invite-section";

// Use Omit to avoid conflicts if we are redefining types for this specific view (or mock extensions)
interface ExtendedTransaction extends Omit<Transaction, "property_type" | "transaction_type"> {
  client_status?: "none" | "pending" | "approved" | "rejected";
  client_invite_code?: string;
  client_invite_expires_at?: string;
  client_name?: string;
  // Redefine as string (or optional string) for UI purposes if the base type is stricter
  transaction_type?: string;
  property_type?: string;
  developer_name?: string;
  reservation_number?: string;
}

interface OverviewTabProps {
  transaction: ExtendedTransaction | null;
  onTransactionUpdate?: () => void;
}

export function OverviewTab({ transaction, onTransactionUpdate }: OverviewTabProps) {
  if (!transaction) {
    return (
      <div className="h-full bg-white p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-100 rounded w-1/3"></div>
          <div className="h-4 bg-gray-100 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-100 rounded"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    initiated: "bg-blue-100 text-blue-700",
    client_joined: "bg-green-100 text-green-700",
    documents_pending: "bg-yellow-100 text-yellow-700",
    documents_review: "bg-orange-100 text-orange-700",
    payment_pending: "bg-purple-100 text-purple-700",
    payment_held: "bg-indigo-100 text-indigo-700",
    developer_handoff: "bg-cyan-100 text-cyan-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Client Invite Section */}
        {transaction.client_status !== "approved" && (
          <ClientInviteSection
            transactionId={transaction.id}
            accessCode={transaction.client_invite_code || transaction.access_code || "N/A"}
            expiresAt={transaction.client_invite_expires_at || transaction.access_code_expires_at || new Date().toISOString()}
            clientStatus={transaction.client_status || "none"}
            pendingClientName={transaction.client_name}
            onApprove={onTransactionUpdate}
            onReject={onTransactionUpdate}
          />
        )}

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[transaction.status] || "bg-gray-100 text-gray-700"
              }`}
          >
            {transaction.status.replace(/_/g, " ").toUpperCase()}
          </span>

          {transaction.client_status === "none" && (
            <span className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              <Users size={14} />
              Waiting for Client to Join
            </span>
          )}
        </div>

        {/* Property Details */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Property Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">{transaction.property_address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Transaction Value</p>
                <p className="font-medium text-gray-900">
                  {transaction.transaction_value
                    ? `₱${transaction.transaction_value.toLocaleString()}`
                    : "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Transaction Type</p>
                <p className="font-medium text-gray-900 capitalize">
                  {transaction.transaction_type?.replace("_", " ") || "Sale"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Home className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="font-medium text-gray-900 capitalize">
                  {transaction.property_type?.replace("_", " ") || "Condominium"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Developer</p>
                <p className="font-medium text-gray-900">
                  {transaction.developer_name || transaction.developer_id || "Not linked"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Reservation No.</p>
                <p className="font-medium text-gray-900">
                  {transaction.reservation_number || "PENDING-001"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
