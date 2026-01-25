"use client";

import { useState, useEffect } from "react";
import { Check, Lock, Circle, Plus, Trash2, Edit2, Save, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface LifecycleStep {
    id: number | string; // Allow string/uuid for dynamic
    label: string;
    description: string;
    status: "locked" | "active" | "completed" | "pending";
    order_index?: number;
}

export const DEFAULT_STEPS: LifecycleStep[] = [
    { id: 1, label: "Reservation", description: "Upload proof of payment", status: "active" },
    { id: 2, label: "KYC & Identity", description: "Liveness Check & ID", status: "locked" },
    { id: 3, label: "Document Assembly", description: "Sign RA and BIS", status: "locked" },
    { id: 4, label: "Escrow Funding", description: "Deposit Down Payment", status: "locked" },
    { id: 5, label: "Developer Handoff", description: "Transmit 201 File", status: "locked" },
    { id: 6, label: "Commission Release", description: "Transaction Cleared", status: "locked" },
];

interface TransactionLifecycleProps {
    transactionId: string;
    currentStep: number;
    completedSteps: number[];
    clientStatus?: "none" | "pending" | "approved" | "rejected";
    onStepClick?: (stepId: number) => void;
    readOnly?: boolean;
}

export function TransactionLifecycle({ transactionId, currentStep, completedSteps, clientStatus = "none", onStepClick, readOnly = false }: TransactionLifecycleProps) {
    const isClientJoined = clientStatus === "approved";
    const [steps, setSteps] = useState<LifecycleStep[]>(DEFAULT_STEPS);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUsingDefaults, setIsUsingDefaults] = useState(true);

    useEffect(() => {
        if (transactionId) {
            fetchSteps();
        }
    }, [transactionId]);

    const fetchSteps = async () => {
        try {
            const res = await fetch(`/api/transactions/${transactionId}/steps`);
            if (res.ok) {
                const data = await res.json();
                if (data.steps && data.steps.length > 0) {
                    // Map DB steps to UI format
                    const mapped = data.steps.map((s: any) => ({
                        id: s.id, // UUID
                        label: s.step_name,
                        description: s.step_description,
                        status: s.status,
                        order_index: s.order_index
                    }));
                    setSteps(mapped);
                    setIsUsingDefaults(false);
                } else {
                    setSteps(DEFAULT_STEPS);
                    setIsUsingDefaults(true);
                }
            }
        } catch (e) {
            console.error("Failed to load steps", e);
        }
    };

    const initializeCustomSteps = async () => {
        setIsLoading(true);
        // Bulk create default steps in DB
        // For simplicity, doing one by one or we should have a bulk endpoint.
        // I'll just map and promise.all
        try {
            const promises = DEFAULT_STEPS.map((step, idx) =>
                fetch(`/api/transactions/${transactionId}/steps`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        step_name: step.label,
                        step_description: step.description,
                        order_index: idx + 1,
                        status: step.status
                    })
                })
            );
            await Promise.all(promises);
            await fetchSteps(); // Refresh to get UUIDs
        } catch (e) {
            console.error("Init failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleEditMode = async () => {
        if (!isEditing && isUsingDefaults) {
            // First time editing? Initialize DB
            await initializeCustomSteps();
        }
        setIsEditing(!isEditing);
    };

    const handleAddStep = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/transactions/${transactionId}/steps`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    step_name: "New Step",
                    step_description: "Description here",
                })
            });
            if (res.ok) {
                fetchSteps();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteStep = async (stepId: string | number) => {
        if (isLoading) return;
        if (typeof stepId === 'number') return; // Cannot delete default without init (but init happened)

        setIsLoading(true);
        try {
            await fetch(`/api/transactions/${transactionId}/steps/${stepId}`, {
                method: "DELETE"
            });
            fetchSteps();
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateLocal = (index: number, field: keyof LifecycleStep, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setSteps(newSteps);
    };

    const handleSaveChanges = async () => {
        setIsLoading(true);
        try {
            const promises = steps.map(step => {
                if (typeof step.id === 'string') {
                    return fetch(`/api/transactions/${transactionId}/steps/${step.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            step_name: step.label,
                            step_description: step.description
                        })
                    });
                }
                return Promise.resolve();
            });
            await Promise.all(promises);
            setIsEditing(false);
            fetchSteps();
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Deal Lifecycle</h3>
                    {!readOnly && (
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={isLoading} className="h-7 w-7 p-0">
                                        <X size={14} />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleSaveChanges} disabled={isLoading} className="h-7 text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                                        {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} className="mr-1" />}
                                        Save
                                    </Button>
                                </>
                            ) : (
                                <Button size="sm" variant="ghost" onClick={toggleEditMode} className="h-7 text-xs text-gray-500 hover:text-blue-600">
                                    <Edit2 size={12} className="mr-1" />
                                    Edit
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Client Status Check */}
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
                        {steps.map((step, index) => {
                            // Logic: If using defaults, use index mapping. If dynamic, rely on order?
                            // For simplicity, we assume order matches array index.
                            const stepIdVal = typeof step.id === 'number' ? step.id : (index + 1);

                            const isCompleted = completedSteps.includes(stepIdVal);
                            const isActive = isClientJoined && currentStep === stepIdVal;
                            const isLocked = !isCompleted && !isActive;
                            const isClickable = !isLocked && !readOnly && !isEditing;

                            return (
                                <div
                                    key={step.id}
                                    className={`flex gap-4 group ${isLocked && !isEditing ? "opacity-60 grayscale" : ""} ${isClickable ? "cursor-pointer hover:bg-gray-50/50 rounded-lg -m-2 p-2 transition-colors" : ""}`}
                                    onClick={() => isClickable && onStepClick?.(stepIdVal)}
                                >
                                    {/* Icon Indicator */}
                                    <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 bg-white
                    ${isCompleted
                                            ? "bg-green-500 border-green-500 text-white"
                                            : isActive
                                                ? "border-[#0247ae] text-[#0247ae] shadow-[0_0_0_4px_rgba(2,71,174,0.1)]"
                                                : "border-gray-200 text-gray-400"
                                        }
                  `}>
                                        {isEditing ? (
                                            <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                                        ) : isCompleted ? (
                                            <Check size={14} strokeWidth={3} />
                                        ) : isLocked ? (
                                            <Lock size={14} />
                                        ) : (
                                            <Circle size={10} fill="currentColor" />
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="pt-1 flex-1 min-w-0">
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <Input
                                                    value={step.label}
                                                    onChange={(e) => handleUpdateLocal(index, 'label', e.target.value)}
                                                    className="h-8 text-sm font-bold"
                                                />
                                                <Input
                                                    value={step.description}
                                                    onChange={(e) => handleUpdateLocal(index, 'description', e.target.value)}
                                                    className="h-7 text-xs text-gray-500"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <h4 className={`text-sm font-medium leading-none mb-1.5 transition-colors ${isActive ? "text-[#0247ae] font-bold" : "text-gray-900"
                                                    }`}>
                                                    {step.label}
                                                </h4>
                                                <p className="text-xs text-gray-500 font-medium leading-tight">
                                                    {step.description}
                                                </p>
                                            </>
                                        )}
                                        {isActive && !isEditing && (
                                            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 animate-pulse">
                                                In Progress
                                            </div>
                                        )}
                                    </div>

                                    {/* Delete Button */}
                                    {isEditing && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteStep(step.id);
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="p-4 border-t border-gray-100 bg-white">
                    <Button variant="outline" className="w-full border-dashed text-gray-500 hover:text-[#0247ae] hover:border-[#0247ae]" onClick={handleAddStep} disabled={isLoading}>
                        <Plus size={16} className="mr-2" />
                        Add Step
                    </Button>
                </div>
            )}

            {/* Progress Footer */}
            {!isEditing && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Overall Progress</span>
                        <span>{Math.round((completedSteps.length / steps.length) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#0247ae] transition-all duration-500 ease-out"
                            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
