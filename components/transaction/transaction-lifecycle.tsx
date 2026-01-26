"use client";

import { Lock, CheckCircle2, Circle } from "lucide-react";

// Fixed 5-step lifecycle
const LIFECYCLE_STEPS = [
    {
        id: 1,
        name: "Reservation & Escrow",
        lockedSubtext: "",
        activeSubtext: "Waiting for Client to Join",
        completedSubtext: "Reservation Confirmed",
        unlocksStep: null, // Always unlocked initially
    },
    {
        id: 2,
        name: "KYC & Identity",
        lockedSubtext: "Requires Reservation Payment",
        activeSubtext: "Verify Client Identity",
        completedSubtext: "Identity Verified",
        unlocksStep: 1, // Unlocked when step 1 is completed
    },
    {
        id: 3,
        name: "Document Assembly",
        lockedSubtext: "Requires Verified Identity",
        activeSubtext: "Prepare & Sign Documents",
        completedSubtext: "Documents Signed",
        unlocksStep: 2,
    },
    {
        id: 4,
        name: "Developer Handoff",
        lockedSubtext: "Requires Signed Documents",
        activeSubtext: "Coordinate with Developer",
        completedSubtext: "Handoff Complete",
        unlocksStep: 3,
    },
    {
        id: 5,
        name: "Commission Release",
        lockedSubtext: "Requires Developer Acceptance",
        activeSubtext: "Await Commission",
        completedSubtext: "Commission Released",
        unlocksStep: 4,
    },
];

interface TransactionLifecycleProps {
    currentStep: number; // 1-5, the active step
    completedSteps: number[]; // Array of completed step IDs
    onStepClick?: (step: number) => void;
}

export function TransactionLifecycle({
    currentStep,
    completedSteps,
    onStepClick
}: TransactionLifecycleProps) {

    const isStepLocked = (stepId: number) => {
        const step = LIFECYCLE_STEPS.find(s => s.id === stepId);
        if (!step || step.unlocksStep === null) return false;
        return !completedSteps.includes(step.unlocksStep);
    };

    const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);
    const isStepActive = (stepId: number) => stepId === currentStep && !isStepLocked(stepId);

    const getStepStatus = (stepId: number): "locked" | "active" | "completed" | "pending" => {
        if (isStepCompleted(stepId)) return "completed";
        if (isStepLocked(stepId)) return "locked";
        if (isStepActive(stepId)) return "active";
        return "pending";
    };

    const getSubtext = (step: typeof LIFECYCLE_STEPS[0], status: string) => {
        switch (status) {
            case "locked": return step.lockedSubtext;
            case "active": return step.activeSubtext;
            case "completed": return step.completedSubtext;
            default: return step.activeSubtext;
        }
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Phase 1: Initiation
                </h3>
            </div>

            {/* Steps */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                    {LIFECYCLE_STEPS.map((step, index) => {
                        const status = getStepStatus(step.id);
                        const subtext = getSubtext(step, status);
                        const isLast = index === LIFECYCLE_STEPS.length - 1;

                        return (
                            <div key={step.id} className="relative">
                                {/* Connector Line */}
                                {!isLast && (
                                    <div
                                        className={`absolute left-[19px] top-[40px] w-0.5 h-[calc(100%-8px)] ${status === "completed" ? "bg-green-400" : "bg-gray-200"
                                            }`}
                                    />
                                )}

                                {/* Step Item */}
                                <button
                                    onClick={() => status !== "locked" && onStepClick?.(step.id)}
                                    disabled={status === "locked"}
                                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${status === "locked"
                                            ? "opacity-60 cursor-not-allowed"
                                            : "hover:bg-gray-50 cursor-pointer"
                                        } ${status === "active" ? "bg-blue-50" : ""}`}
                                    title={status === "locked" ? subtext : undefined}
                                >
                                    {/* Icon */}
                                    <div className={`relative shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${status === "completed" ? "bg-green-500" :
                                            status === "active" ? "bg-white border-2 border-[#0247ae]" :
                                                status === "locked" ? "bg-gray-100" :
                                                    "bg-gray-100"
                                        }`}>
                                        {status === "completed" && (
                                            <CheckCircle2 size={20} className="text-white" />
                                        )}
                                        {status === "active" && (
                                            <>
                                                <Circle size={12} className="text-[#0247ae] fill-[#0247ae]" />
                                                <div className="absolute inset-0 rounded-full border-2 border-[#0247ae] animate-ping opacity-25" />
                                            </>
                                        )}
                                        {status === "locked" && (
                                            <Lock size={16} className="text-gray-400" />
                                        )}
                                        {status === "pending" && (
                                            <span className="text-sm font-semibold text-gray-400">{step.id}</span>
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0 pt-1">
                                        <h4 className={`font-semibold text-sm ${status === "completed" ? "text-green-700" :
                                                status === "active" ? "text-[#0247ae]" :
                                                    status === "locked" ? "text-gray-400" :
                                                        "text-gray-700"
                                            }`}>
                                            {step.name}
                                        </h4>
                                        <p className={`text-xs mt-0.5 ${status === "locked" ? "text-gray-400" : "text-gray-500"
                                            }`}>
                                            {subtext}
                                        </p>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Step {currentStep} of 5</span>
                    <span>{completedSteps.length} Completed</span>
                </div>
            </div>
        </div>
    );
}
