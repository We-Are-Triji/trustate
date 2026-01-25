"use client";

import { Check, Lock, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface LifecycleStep {
    id: number;
    label: string;
    description: string;
    status: "locked" | "active" | "completed" | "pending";
}

export const LIFECYCLE_STEPS: LifecycleStep[] = [
    { id: 1, label: "Reservation", description: "Upload proof of payment", status: "active" },
    { id: 2, label: "KYC & Identity", description: "Liveness Check & ID", status: "locked" },
    { id: 3, label: "Document Assembly", description: "Sign RA and BIS", status: "locked" },
    { id: 4, label: "Escrow Funding", description: "Deposit Down Payment", status: "locked" },
    { id: 5, label: "Developer Handoff", description: "Transmit 201 File", status: "locked" },
    { id: 6, label: "Commission Release", description: "Transaction Cleared", status: "locked" },
];

interface TransactionLifecycleProps {
    currentStep: number;
    completedSteps: number[];
    clientStatus?: "none" | "pending" | "approved" | "rejected";
    onStepClick?: (stepId: number) => void;
    readOnly?: boolean;
}

export function TransactionLifecycle({ currentStep, completedSteps, clientStatus = "none", onStepClick, readOnly = false }: TransactionLifecycleProps) {
    const isClientJoined = clientStatus === "approved";

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Deal Lifecycle</h3>
                    <Badge variant="outline" className="bg-white text-xs font-normal">
                        Phase 1: Initiation
                    </Badge>
                </div>

                {/* Client Status Check - Moved from Overview */}
                <div className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${isClientJoined
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-dashed border-gray-300"
                    }`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${isClientJoined ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                        }`}>
                        {isClientJoined ? <Check size={14} strokeWidth={3} /> : <Circle size={14} />}
                    </div>
                    <div>
                        <p className={`text-sm font-medium ${isClientJoined ? "text-gray-900" : "text-gray-500"}`}>
                            {isClientJoined ? "Client Verified" : "Waiting for Client"}
                        </p>
                        <p className="text-[10px] text-gray-400">
                            {isClientJoined ? "Access granted" : "Invite needed to proceed"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gray-100 z-0" />

                    <div className="space-y-8 relative z-10">
                        {LIFECYCLE_STEPS.map((step) => {
                            const isCompleted = completedSteps.includes(step.id);
                            // Only show active if client is verified
                            const isActive = isClientJoined && currentStep === step.id;
                            // Lock if not completed and not active (which covers no client case)
                            const isLocked = !isCompleted && !isActive;
                            const isClickable = !isLocked && !readOnly;

                            return (
                                <div
                                    key={step.id}
                                    className={`flex gap-4 group ${isLocked ? "opacity-60 grayscale" : ""} ${isClickable ? "cursor-pointer hover:bg-gray-50/50 rounded-lg -m-2 p-2 transition-colors" : ""}`}
                                    onClick={() => isClickable && onStepClick?.(step.id)}
                                >
                                    {/* Icon Indicator */}
                                    <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300
                    ${isCompleted
                                            ? "bg-green-500 border-green-500 text-white"
                                            : isActive
                                                ? "bg-white border-[#0247ae] text-[#0247ae] shadow-[0_0_0_4px_rgba(2,71,174,0.1)]"
                                                : "bg-gray-100 border-gray-200 text-gray-400"
                                        }
                  `}>
                                        {isCompleted ? (
                                            <Check size={14} strokeWidth={3} />
                                        ) : isLocked ? (
                                            <Lock size={14} />
                                        ) : (
                                            <Circle size={10} fill="currentColor" />
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="pt-1">
                                        <h4 className={`text-sm font-medium leading-none mb-1.5 transition-colors ${isActive ? "text-[#0247ae] font-bold" : "text-gray-900"
                                            }`}>
                                            {step.label}
                                        </h4>
                                        <p className="text-xs text-gray-500 font-medium leading-tight">
                                            {step.description}
                                        </p>
                                        {isActive && (
                                            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 animate-pulse">
                                                In Progress
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Progress Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Overall Progress</span>
                    <span>{Math.round((completedSteps.length / LIFECYCLE_STEPS.length) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#0247ae] transition-all duration-500 ease-out"
                        style={{ width: `${(completedSteps.length / LIFECYCLE_STEPS.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
