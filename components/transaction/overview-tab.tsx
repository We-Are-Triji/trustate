"use client";

import { MapPin, DollarSign, Calendar, Users } from "lucide-react";
import type { Transaction } from "@/lib/types/transaction";

interface OverviewTabProps {
  transaction: Transaction | null;
}

export function OverviewTab({ transaction }: OverviewTabProps) {
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
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Transaction Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Track your transaction progress</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Badge */}
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[transaction.status] || "bg-gray-100 text-gray-700"
              }`}
          >
            {transaction.status.replace(/_/g, " ").toUpperCase()}
          </span>
        </div>

        {/* Property Details */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Property Details</h3>

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
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium text-gray-900">
                {new Date(transaction.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Progress</h3>
          <div className="space-y-3">
            {[
              { label: "Transaction Initiated", completed: true },
              { label: "Client Joined", completed: transaction.status !== "initiated" },
              { label: "Documents Submitted", completed: ["documents_review", "payment_pending", "payment_held", "developer_handoff", "completed"].includes(transaction.status) },
              { label: "Payment Processed", completed: ["payment_held", "developer_handoff", "completed"].includes(transaction.status) },
              { label: "Completed", completed: transaction.status === "completed" },
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${step.completed ? "bg-[#0247ae] text-white" : "bg-gray-200 text-gray-400"
                    }`}
                >
                  {step.completed ? "✓" : index + 1}
                </div>
                <span className={step.completed ? "text-gray-900 font-medium" : "text-gray-500"}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
