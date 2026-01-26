"use client";

import { useEffect, useState, useCallback } from "react";
import { Lock, CheckCircle2, Circle } from "lucide-react";

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

interface TransactionLifecycleProps {
    transactionId: string;
    clientStatus?: "none" | "pending" | "approved" | "rejected";
    onStepClick?: (step: number) => void;
}

// Phase 1 sub-steps for Step 1
const STEP_1_SUBSTEPS = [
    { key: "documents", label: "Document Setup", check: (p: StepProgress) => p.ra_uploaded && p.bis_uploaded },
    { key: "client", label: "Client Onboarding", check: (p: StepProgress) => p.client_joined },
    { key: "payment", label: "Payment Verification", check: (p: StepProgress) => p.payment_confirmed },
];

// Main lifecycle steps
const LIFECYCLE_STEPS = [
    {
        id: 1,
        name: "Reservation & Escrow",
        lockedSubtext: "",
        check: (p: StepProgress) => p.payment_confirmed,
    },
    {
        id: 2,
        name: "KYC & Identity",
        lockedSubtext: "Requires Reservation Payment",
        check: (p: StepProgress) => p.kyc_completed,
    },
    {
        id: 3,
        name: "Document Assembly",
        lockedSubtext: "Requires Verified Identity",
        check: (p: StepProgress) => p.documents_signed,
    },
    {
        id: 4,
        name: "Developer Handoff",
        lockedSubtext: "Requires Signed Documents",
        check: (p: StepProgress) => p.developer_accepted,
    },
    {
        id: 5,
        name: "Commission Release",
        lockedSubtext: "Requires Developer Acceptance",
        check: (p: StepProgress) => p.commission_released,
    },
];

export function TransactionLifecycle({
    transactionId,
    clientStatus,
    onStepClick
}: TransactionLifecycleProps) {
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

    const fetchProgress = useCallback(async () => {
        try {
            const res = await fetch(`/api/transactions/${transactionId}/progress`);
            if (res.ok) {
                const data = await res.json();
                setProgress(data.progress);
            }
        } catch (error) {
            console.error("Failed to fetch progress:", error);
        }
    }, [transactionId]);

    useEffect(() => {
        fetchProgress();
        // Poll for updates every 5 seconds
        const interval = setInterval(fetchProgress, 5000);
        return () => clearInterval(interval);
    }, [fetchProgress]);

    // Update client_joined based on clientStatus
    useEffect(() => {
        if (clientStatus === "approved" && !progress.client_joined) {
            setProgress(prev => ({ ...prev, client_joined: true }));
        }
    }, [clientStatus, progress.client_joined]);

    // Calculate current step based on progress
    const getCurrentStep = () => {
        for (let i = LIFECYCLE_STEPS.length - 1; i >= 0; i--) {
            if (LIFECYCLE_STEPS[i].check(progress)) {
                return Math.min(i + 2, 5); // Return next step
            }
        }
        return 1;
    };

    const currentStep = getCurrentStep();

    const isStepCompleted = (stepId: number) => {
        const step = LIFECYCLE_STEPS.find(s => s.id === stepId);
        return step?.check(progress) || false;
    };

    const isStepLocked = (stepId: number) => {
        if (stepId === 1) return false;
        const prevStep = LIFECYCLE_STEPS.find(s => s.id === stepId - 1);
        return prevStep && !prevStep.check(progress);
    };

    const isStepActive = (stepId: number) => stepId === currentStep && !isStepLocked(stepId);

    const getStepStatus = (stepId: number): "locked" | "active" | "completed" => {
        if (isStepCompleted(stepId)) return "completed";
        if (isStepLocked(stepId)) return "locked";
        if (isStepActive(stepId)) return "active";
        return "locked";
    };

    // Get sub-step completion count for step 1
    const step1CompletedCount = STEP_1_SUBSTEPS.filter(s => s.check(progress)).length;

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="px-4 pt-4 pb-2">
                <p className="text-xs font-semibold text-[#0247ae] uppercase tracking-wider">Phase 1: Initiation</p>
                <h3 className="text-lg font-bold text-gray-900 mt-1">Deal Lifecycle</h3>
            </div>

            {/* Steps */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
                <div className="relative">
                    {LIFECYCLE_STEPS.map((step, index) => {
                        const status = getStepStatus(step.id);
                        const isLast = index === LIFECYCLE_STEPS.length - 1;
                        const showSubsteps = step.id === 1 && status !== "completed";

                        return (
                            <div key={step.id} className="relative">
                                {/* Connector Line */}
                                {!isLast && (
                                    <div
                                        className={`absolute left-5 top-12 w-0.5 ${showSubsteps ? "h-[calc(100%-48px)]" : "h-[calc(100%-24px)]"
                                            } ${status === "completed" ? "bg-green-400" : "bg-gray-200"
                                            }`}
                                        style={{ transform: "translateX(-50%)" }}
                                    />
                                )}

                                {/* Step Item */}
                                <button
                                    onClick={() => status !== "locked" && onStepClick?.(step.id)}
                                    disabled={status === "locked"}
                                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${status === "locked"
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-50 cursor-pointer"
                                        } ${status === "active" ? "bg-blue-50 border border-blue-200" : ""}`}
                                    title={status === "locked" ? step.lockedSubtext : undefined}
                                >
                                    {/* Icon */}
                                    <div className={`relative shrink-0 h-10 w-10 rounded-full flex items-center justify-center z-10 ${status === "completed" ? "bg-green-500" :
                                            status === "active" ? "bg-white border-2 border-[#0247ae] shadow-sm" :
                                                "bg-gray-100"
                                        }`}>
                                        {status === "completed" && (
                                            <CheckCircle2 size={20} className="text-white" />
                                        )}
                                        {status === "active" && (
                                            <>
                                                <Circle size={10} className="text-[#0247ae] fill-[#0247ae]" />
                                                <div className="absolute inset-0 rounded-full border-2 border-[#0247ae] animate-ping opacity-20" />
                                            </>
                                        )}
                                        {status === "locked" && (
                                            <Lock size={16} className="text-gray-400" />
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0 pt-1.5">
                                        <h4 className={`font-semibold text-sm ${status === "completed" ? "text-green-700" :
                                                status === "active" ? "text-[#0247ae]" :
                                                    "text-gray-400"
                                            }`}>
                                            {step.name}
                                        </h4>
                                        {status === "active" && step.id === 1 && (
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {step1CompletedCount}/3 tasks completed
                                            </p>
                                        )}
                                        {status === "locked" && (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {step.lockedSubtext}
                                            </p>
                                        )}
                                    </div>
                                </button>

                                {/* Sub-steps for Step 1 */}
                                {showSubsteps && (
                                    <div className="ml-8 pl-4 border-l-2 border-gray-100 space-y-2 py-2 mb-2">
                                        {STEP_1_SUBSTEPS.map((substep, subIndex) => {
                                            const isSubCompleted = substep.check(progress);
                                            return (
                                                <div
                                                    key={substep.key}
                                                    className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm ${isSubCompleted ? "text-green-700 bg-green-50" : "text-gray-500"
                                                        }`}
                                                >
                                                    {isSubCompleted ? (
                                                        <CheckCircle2 size={14} className="text-green-500" />
                                                    ) : (
                                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                                                    )}
                                                    <span className={isSubCompleted ? "line-through" : ""}>
                                                        {substep.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Step {currentStep} of 5</span>
                    <span>{LIFECYCLE_STEPS.filter(s => s.check(progress)).length} Completed</span>
                </div>
            </div>
        </div>
    );
}
