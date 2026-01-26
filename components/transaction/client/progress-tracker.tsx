"use client";

import { CheckCircle2, Circle, Lock } from "lucide-react";

interface ClientProgressTrackerProps {
    currentStep: number;
    steps: {
        id: number;
        name: string;
        status: "completed" | "active" | "pending" | "locked";
    }[];
}

export function ClientProgressTracker({ currentStep, steps }: ClientProgressTrackerProps) {
    return (
        <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${step.status === "completed" ? "bg-green-500 text-white" :
                                    step.status === "active" ? "bg-[#0247ae] text-white ring-4 ring-blue-100" :
                                        step.status === "pending" ? "bg-orange-100 text-orange-600 border-2 border-orange-300" :
                                            "bg-gray-100 text-gray-400"
                                }`}>
                                {step.status === "completed" ? (
                                    <CheckCircle2 size={20} />
                                ) : step.status === "active" ? (
                                    <span className="text-sm font-bold">{step.id}</span>
                                ) : step.status === "pending" ? (
                                    <Circle size={16} className="animate-pulse" />
                                ) : (
                                    <Lock size={14} />
                                )}
                            </div>
                            <span className={`text-xs font-medium mt-2 text-center max-w-[80px] ${step.status === "completed" ? "text-green-700" :
                                    step.status === "active" ? "text-[#0247ae]" :
                                        step.status === "pending" ? "text-orange-600" :
                                            "text-gray-400"
                                }`}>
                                {step.name}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 ${step.status === "completed" ? "bg-green-400" : "bg-gray-200"
                                }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
