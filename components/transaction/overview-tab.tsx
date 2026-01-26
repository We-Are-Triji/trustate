"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, DollarSign, Users, Home, Building2, ArrowRight, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@/lib/types/transaction";
import { ClientInviteSection } from "./client-invite-section";
import { TransmittalCard } from "./transmittal-card";

interface ExtendedTransaction extends Omit<Transaction, "property_type" | "transaction_type"> {
  client_status?: "none" | "pending" | "approved" | "rejected";
  client_invite_code?: string;
  client_invite_expires_at?: string;
  client_name?: string;
  transaction_type?: string;
  property_type?: string;
  developer_name?: string;
  reservation_number?: string;
}

interface StepProgress {
  ra_uploaded: boolean;
  bis_uploaded: boolean;
  client_joined: boolean;
  payment_confirmed: boolean;
  kyc_completed: boolean;
  documents_signed: boolean;
  developer_accepted: boolean;
  commission_released: boolean;
}

interface OverviewTabProps {
  transaction: ExtendedTransaction | null;
  onTransactionUpdate?: () => void;
  isAgent?: boolean;
  currentStep?: number;
  onNavigate?: (tab: string) => void;
}

// Step actions with progress keys
const STEP_ACTIONS = [
  {
    step: 1,
    title: "Reservation & Escrow",
    tasks: [
      { label: "Upload Reservation Agreement (RA)", tab: "documents", progressKey: "ra_uploaded" },
      { label: "Upload Buyer's Info Sheet (BIS)", tab: "documents", progressKey: "bis_uploaded" },
      { label: "Invite Client to Transaction", tab: "overview", progressKey: "client_joined" },
      { label: "Confirm Reservation Payment", tab: "escrow", progressKey: "payment_confirmed" },
    ]
  },
  {
    step: 2,
    title: "KYC & Identity",
    tasks: [
      { label: "Await Client Identity Scan", tab: "kyc", progressKey: null },
      { label: "Approve Identity Verification", tab: "kyc", progressKey: "kyc_completed" },
    ]
  },
  {
    step: 3,
    title: "Document Assembly",
    tasks: [
      { label: "Prepare Contract Documents", tab: "documents", progressKey: null },
      { label: "Obtain Client Signatures", tab: "documents", progressKey: "documents_signed" },
    ]
  },
  {
    step: 4,
    title: "Developer Handoff",
    tasks: [
      { label: "Submit to Developer", tab: "overview", progressKey: null },
      { label: "Await Developer Confirmation", tab: "overview", progressKey: "developer_accepted" },
    ]
  },
  {
    step: 5,
    title: "Commission Release",
    tasks: [
      { label: "Verify Commission Amount", tab: "overview", progressKey: null },
      { label: "Confirm Commission Received", tab: "overview", progressKey: "commission_released" },
    ]
  },
];

export function OverviewTab({
  transaction,
  onTransactionUpdate,
  isAgent = false,
  currentStep = 1,
  onNavigate
}: OverviewTabProps) {
  const [progress, setProgress] = useState<StepProgress>({
    ra_uploaded: false,
    bis_uploaded: false,
    client_joined: false,
    payment_confirmed: false,
    kyc_completed: false,
    documents_signed: false,
    developer_accepted: false,
    commission_released: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!transaction?.id) return;
    try {
      const res = await fetch(`/api/transactions/${transaction.id}/progress`);
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, [transaction?.id]);

  useEffect(() => {
    fetchProgress();
    // Poll for updates
    const interval = setInterval(fetchProgress, 5000);
    return () => clearInterval(interval);
  }, [fetchProgress]);

  // Also update if client status changes
  useEffect(() => {
    if (transaction?.client_status === "approved") {
      setProgress(prev => ({ ...prev, client_joined: true }));
    }
  }, [transaction?.client_status]);

  const isTaskDone = (progressKey: string | null): boolean => {
    if (!progressKey) return false;
    return progress[progressKey as keyof StepProgress] || false;
  };

  // Calculate effective current step based on progress
  const getEffectiveStep = () => {
    if (progress.commission_released) return 5;
    if (progress.developer_accepted) return 5;
    if (progress.documents_signed) return 4;
    if (progress.kyc_completed) return 3;
    if (progress.payment_confirmed) return 2;
    return 1;
  };

  const effectiveStep = getEffectiveStep();

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

  // Agent View
  if (isAgent) {
    const currentPhaseConfig = STEP_ACTIONS.find(s => s.step === effectiveStep) || STEP_ACTIONS[0];
    const completedTasks = currentPhaseConfig.tasks.filter(t => isTaskDone(t.progressKey)).length;

    return (
      <div className="h-full overflow-y-auto bg-gray-50/30">
        <div className="p-6 max-w-5xl mx-auto space-y-6">
          {/* Current Phase Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step {effectiveStep}: {currentPhaseConfig.title}</h1>
              <p className="text-gray-500 mt-1">Complete the tasks below to proceed</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchProgress} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <RefreshCw size={16} />
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#0247ae] rounded-full text-sm font-medium">
                <Clock size={14} />
                {completedTasks}/{currentPhaseConfig.tasks.length} Complete
              </div>
            </div>
          </div>

          {/* Client Invitation Section (Step 1 only, if client not joined) */}
          {effectiveStep === 1 && !progress.client_joined && transaction.client_status !== "approved" && (
            <ClientInviteSection
              transactionId={transaction.id}
              accessCode={transaction.client_invite_code || transaction.access_code || "N/A"}
              expiresAt={transaction.client_invite_expires_at || transaction.access_code_expires_at || new Date().toISOString()}
              clientStatus={transaction.client_status || "none"}
              pendingClientName={transaction.client_name}
              onApprove={() => {
                fetchProgress();
                onTransactionUpdate?.();
              }}
              onReject={onTransactionUpdate}
              isAgent={true}
            />
          )}

          {/* Transmittal Card (Phase 4 - Developer Handoff) */}
          {effectiveStep === 4 && !progress.developer_accepted && (
            <TransmittalCard
              transactionId={transaction.id}
              developerName={transaction.developer_name || "Developer"}
              packageItems={[
                { name: "Reservation Agreement", type: "document", icon: "document" },
                { name: "Buyer's Info Sheet", type: "document", icon: "document" },
                { name: "Verified ID", type: "id", icon: "id" },
                { name: "Proof of Payment", type: "payment", icon: "payment" },
              ]}
              onTransmit={() => {
                fetchProgress();
                onTransactionUpdate?.();
              }}
              isTransmitted={progress.developer_accepted}
            />
          )}

          {/* Transmitted State */}
          {progress.developer_accepted && effectiveStep >= 4 && (
            <TransmittalCard
              transactionId={transaction.id}
              developerName={transaction.developer_name || "Developer"}
              packageItems={[]}
              isTransmitted={true}
              transmittedAt={new Date().toISOString()}
            />
          )}

          {/* Task Checklist */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-base">Tasks for This Step</CardTitle>
              <CardDescription>Complete all tasks to unlock the next step</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentPhaseConfig.tasks.map((task, index) => {
                const isDone = isTaskDone(task.progressKey);
                return (
                  <button
                    key={index}
                    onClick={() => onNavigate?.(task.tab)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all group text-left ${isDone
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-white hover:border-[#0247ae] hover:bg-blue-50/30"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isDone ? "bg-green-100" : "bg-gray-100 group-hover:bg-blue-100"
                        }`}>
                        {isDone ? (
                          <CheckCircle2 size={16} className="text-green-600" />
                        ) : (
                          <span className="text-sm font-medium text-gray-500 group-hover:text-[#0247ae]">{index + 1}</span>
                        )}
                      </div>
                      <span className={`font-medium ${isDone ? "text-green-700 line-through" : "text-gray-900"}`}>
                        {task.label}
                      </span>
                    </div>
                    {!isDone && (
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-[#0247ae] transition-colors" />
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Property Summary */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-base">Transaction Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Home size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Property</p>
                    <p className="font-medium text-gray-900">{transaction.property_address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <DollarSign size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Value</p>
                    <p className="font-medium text-gray-900">
                      {transaction.transaction_value ? `₱${transaction.transaction_value.toLocaleString()}` : "TBD"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Building2 size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Developer</p>
                    <p className="font-medium text-gray-900">{transaction.developer_name || "Not Set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Users size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Client</p>
                    <p className="font-medium text-gray-900">
                      {progress.client_joined ? transaction.client_name || "Linked" : "Not Joined"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Client View
  return (
    <div className="h-full overflow-y-auto bg-gray-50/30">
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">
            Your transaction for <span className="font-medium text-gray-900">{transaction.property_address}</span>
          </p>
        </div>

        {transaction.client_status === "pending" && (
          <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              Pending Approval
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Waiting for Agent Approval</h2>
            <p className="text-gray-600">
              You have requested to join this transaction. Your agent will review and approve your access shortly.
            </p>
          </div>
        )}

        {transaction.client_status === "approved" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#0247ae] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-[#0247ae]"></span>
              Your Next Action
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Follow Your Agent&apos;s Instructions</h2>
            <p className="text-gray-600 mb-8 max-w-lg">
              Your agent is managing this transaction. Check the Escrow and Documents tabs for any required actions.
            </p>
            <Button
              onClick={() => onNavigate?.("escrow")}
              className="px-8 py-4 bg-[#0247ae] text-white font-bold rounded-xl hover:bg-[#023a8a]"
            >
              Go to Escrow
            </Button>
          </div>
        )}

        {/* Property Info */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
