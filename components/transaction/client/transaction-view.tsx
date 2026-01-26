"use client";

import { useState, useEffect, useCallback } from "react";
import { Home, Shield, Loader2, FileText, Building2 } from "lucide-react";
import { ClientProgressTracker } from "./progress-tracker";
import { PaymentCard } from "./payment-card";
import { AgentWidget } from "./agent-widget";
import { KYCCard } from "./kyc-card";
import { DocumentSigningCard } from "./document-signing-card";
import { HandoffCard } from "./handoff-card";
import { DocumentReviewCard } from "./document-review-card";

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

interface TransactionData {
    id: string;
    property_address: string;
    project_name?: string;
    transaction_value?: number;
    developer_name?: string;
    agent_name?: string;
    agent_phone?: string;
    agent_email?: string;
    brokerage_name?: string;
    payment_bank_name?: string;
    payment_account_name?: string;
    payment_account_number?: string;
    payment_gcash?: string;
    reservation_amount?: number;
}

interface ClientTransactionViewProps {
    transactionId: string;
    transaction: TransactionData | null;
    onRefresh?: () => void;
}

const STEPS = [
    { id: 1, name: "Reservation" },
    { id: 2, name: "Documents" },
    { id: 3, name: "Signatures" },
    { id: 4, name: "Handoff" },
];

export function ClientTransactionView({
    transactionId,
    transaction,
    onRefresh
}: ClientTransactionViewProps) {
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
    const [paymentStatus, setPaymentStatus] = useState<"pending" | "uploaded" | "reviewing" | "confirmed">("pending");
    const [isLoading, setIsLoading] = useState(true);

    // Fetch progress from API
    const fetchProgress = useCallback(async () => {
        try {
            const res = await fetch(`/api/transactions/${transactionId}/progress`);
            if (res.ok) {
                const data = await res.json();
                const newProgress = data.progress;
                setProgress(newProgress);

                // Derive payment status from progress
                if (newProgress.payment_confirmed) {
                    setPaymentStatus("confirmed");
                } else {
                    // Check if payment proof was uploaded
                    const docsRes = await fetch(`/api/transactions/${transactionId}/documents`);
                    if (docsRes.ok) {
                        const docsData = await docsRes.json();
                        const hasPaymentProof = docsData.documents?.some(
                            (d: { document_type: string }) => d.document_type === "payment_proof"
                        );
                        if (hasPaymentProof) {
                            setPaymentStatus("reviewing");
                        } else {
                            setPaymentStatus("pending");
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch progress:", error);
        } finally {
            setIsLoading(false);
        }
    }, [transactionId]);

    // Initial fetch and polling
    useEffect(() => {
        fetchProgress();
        // Poll every 3 seconds for real-time updates
        const interval = setInterval(fetchProgress, 3000);
        return () => clearInterval(interval);
    }, [fetchProgress]);

    // Calculate current step from progress
    const getCurrentStep = () => {
        if (progress.developer_accepted) return 4;
        if (progress.documents_signed) return 3;
        if (progress.payment_confirmed) return 2;
        return 1;
    };

    const currentStep = getCurrentStep();

    // Build steps with status
    const stepsWithStatus = STEPS.map(step => {
        let status: "completed" | "active" | "pending" | "locked";

        if (step.id < currentStep) {
            status = "completed";
        } else if (step.id === currentStep) {
            // Check for pending states
            if (step.id === 1 && paymentStatus === "reviewing") {
                status = "pending";
            } else {
                status = "active";
            }
        } else {
            status = "locked";
        }

        return { ...step, status };
    });

    const handlePaymentUpload = () => {
        setPaymentStatus("reviewing");
        fetchProgress();
    };

    if (isLoading || !transaction) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 size={40} className="mx-auto text-[#0247ae] animate-spin mb-4" />
                    <p className="text-gray-500">Loading your transaction...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-lg mx-auto p-4 space-y-6 pb-24">
                {/* Property Header */}
                <div className="text-center pt-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#0247ae] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                        <Shield size={12} />
                        Protected Transaction
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">{transaction.property_address}</h1>
                    {transaction.project_name && (
                        <p className="text-sm text-gray-500 mt-1">{transaction.project_name}</p>
                    )}
                </div>

                {/* Progress Tracker */}
                <ClientProgressTracker
                    currentStep={currentStep}
                    steps={stepsWithStatus}
                />

                {/* Main Action Card - Phase-based */}
                {currentStep === 1 && (
                    <PaymentCard
                        transactionId={transactionId}
                        paymentInfo={{
                            bank_name: transaction.payment_bank_name || "BDO",
                            account_name: transaction.payment_account_name || "Trustate Escrow Inc.",
                            account_number: transaction.payment_account_number || "0012-3456-7890",
                            gcash_number: transaction.payment_gcash || "0917-123-4567",
                            amount: transaction.reservation_amount || 25000,
                            reference: transactionId.slice(0, 8).toUpperCase(),
                        }}
                        paymentStatus={paymentStatus}
                        onUpload={handlePaymentUpload}
                    />
                )}

                {currentStep === 2 && (
                    <DocumentReviewCard
                        transactionId={transactionId}
                        onComplete={fetchProgress}
                    />
                )}

                {currentStep === 3 && (
                    <DocumentSigningCard
                        transactionId={transactionId}
                        onComplete={fetchProgress}
                    />
                )}

                {currentStep === 4 && (
                    <HandoffCard
                        transactionId={transactionId}
                        developerName={transaction.developer_name}
                        onComplete={fetchProgress}
                    />
                )}

                {/* Agent Widget - Fixed at Bottom */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
                    <div className="max-w-lg mx-auto">
                        <AgentWidget
                            agentName={transaction.agent_name || "Your Agent"}
                            agentPhone={transaction.agent_phone}
                            agentEmail={transaction.agent_email}
                            brokerageName={transaction.brokerage_name}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
