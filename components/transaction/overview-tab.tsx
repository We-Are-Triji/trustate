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
  isAgent?: boolean;
}

export function OverviewTab({ transaction, onTransactionUpdate, isAgent = false }: OverviewTabProps) {
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

  if (!isAgent) {
    // Client View: Simplified Experience
    return (
      <div className="h-full overflow-y-auto bg-gray-50/30">
        <div className="p-6 max-w-5xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-1">Here is your transaction status for <span className="font-medium text-gray-900">{transaction.property_address}</span></p>
          </div>

          {!isAgent && transaction.client_status === "pending" ? (
            // Pending Approval Banner (Replaces Action Center)
            <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                  Pending Approval
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Waiting for Agent Approval</h2>
                <p className="text-gray-600 max-w-lg">
                  You have requested to join this transaction. While you wait, you can inspect the property details below.
                </p>
              </div>
            </div>
          ) : (
            // ACTION CENTER - Prominent Card (Visible when approved)
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#0247ae] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#0247ae] animate-pulse"></span>
                  Current Task
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Upload Proof of Payment</h2>
                <p className="text-gray-600 mb-8 max-w-lg leading-relaxed">
                  To secure your reservation for <strong>{transaction.property_address}</strong>, please upload your reservation fee receipt to the Document Vault.
                </p>
                <button className="px-8 py-4 bg-[#0247ae] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#023a8a] hover:shadow-xl hover:-translate-y-1 transition-all">
                  Go to Action
                </button>
              </div>
            </div>
          )}

          {/* Simple Property Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Property Summary</h3>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                <Home size={28} />
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900">{transaction.property_address}</p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm text-gray-500">
                    {transaction.transaction_value ? `₱${transaction.transaction_value.toLocaleString()}` : "Price TBD"}
                  </p>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <p className="text-sm text-gray-500 capitalize">{transaction.property_type?.replace("_", " ") || "Property"}</p>
                </div>
              </div>
            </div>
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
            isAgent={isAgent}
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
