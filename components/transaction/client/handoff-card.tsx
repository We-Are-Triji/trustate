"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Building2, CheckCircle2, Download, Loader2, PartyPopper, FileText, Calendar, Home } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HandoffStatus {
    status: "pending" | "transmitting" | "completed";
    transaction: {
        id: string;
        property_address: string;
        project_name?: string;
        developer_name?: string;
        transaction_value?: number;
        transmitted_at?: string;
    };
    transmittal?: {
        id: string;
        transmitted_at: string;
        developer_name: string;
        receipt_number?: string;
    };
    is_complete: boolean;
}

interface HandoffCardProps {
    transactionId: string;
    developerName?: string;
    onComplete?: () => void;
}

export function HandoffCard({ transactionId, developerName, onComplete }: HandoffCardProps) {
    const [handoffStatus, setHandoffStatus] = useState<HandoffStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const completedRef = useRef(false);

    // Fetch handoff status
    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch(`/api/transactions/${transactionId}/handoff-status`);
            if (res.ok) {
                const data = await res.json();
                setHandoffStatus(data);

                // Trigger completion effects once
                if (data.is_complete && !completedRef.current) {
                    completedRef.current = true;
                    setShowConfetti(true);
                    onComplete?.();
                    // Hide confetti after 5 seconds
                    setTimeout(() => setShowConfetti(false), 5000);
                }
            }
        } catch (error) {
            console.error("Failed to fetch handoff status:", error);
        } finally {
            setIsLoading(false);
        }
    }, [transactionId, onComplete]);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    // Simulate completion after 3s when transmitting
    useEffect(() => {
        if (handoffStatus?.status === "transmitting" && !completedRef.current) {
            const timer = setTimeout(async () => {
                // Complete the handoff via API
                await fetch(`/api/transactions/${transactionId}/handoff-status`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "complete_handoff" }),
                });
                fetchStatus();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [handoffStatus?.status, transactionId, fetchStatus]);

    if (isLoading) {
        return (
            <Card className="border-gray-200 shadow-lg animate-pulse">
                <CardContent className="py-12 text-center">
                    <Loader2 size={32} className="mx-auto text-gray-400 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    // STATE: Completed - Transaction Receipt
    if (handoffStatus?.is_complete) {
        return (
            <>
                {/* Confetti Animation */}
                {showConfetti && (
                    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute animate-confetti"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${2 + Math.random() * 2}s`,
                                }}
                            >
                                <div
                                    className="w-3 h-3 rounded-sm"
                                    style={{
                                        backgroundColor: ["#0247ae", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][Math.floor(Math.random() * 5)],
                                        transform: `rotate(${Math.random() * 360}deg)`,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <Card className="border-green-300 bg-gradient-to-br from-green-50 via-white to-blue-50 shadow-xl overflow-hidden">
                    {/* Success Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white text-center">
                        <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PartyPopper size={32} />
                        </div>
                        <h2 className="text-2xl font-bold">Congratulations!</h2>
                        <p className="text-green-100 mt-1">Your reservation is complete</p>
                    </div>

                    <CardContent className="p-6 space-y-6">
                        {/* Official Receipt Card */}
                        <div className="bg-white rounded-2xl border-2 border-green-200 p-6 relative overflow-hidden">
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full" />
                            <div className="absolute top-2 right-2">
                                <CheckCircle2 size={24} className="text-green-500" />
                            </div>

                            <div className="flex items-center gap-2 text-green-700 font-bold text-sm uppercase tracking-wider mb-4">
                                <FileText size={16} />
                                Official Transaction Receipt
                            </div>

                            <div className="space-y-4">
                                {/* Property */}
                                <div className="flex items-start gap-3">
                                    <Home size={20} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Property</p>
                                        <p className="font-semibold text-gray-900">
                                            {handoffStatus.transaction.property_address}
                                        </p>
                                        {handoffStatus.transaction.project_name && (
                                            <p className="text-sm text-gray-500">{handoffStatus.transaction.project_name}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Developer */}
                                <div className="flex items-start gap-3">
                                    <Building2 size={20} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Developer</p>
                                        <p className="font-semibold text-gray-900">
                                            {handoffStatus.transaction.developer_name || developerName || "Developer"}
                                        </p>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="flex items-start gap-3">
                                    <Calendar size={20} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Completion Date</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(handoffStatus.transaction.transmitted_at || Date.now()).toLocaleDateString("en-PH", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Receipt Number */}
                                {handoffStatus.transmittal?.receipt_number && (
                                    <div className="pt-4 border-t border-gray-100 text-center">
                                        <p className="text-xs text-gray-500">Receipt No.</p>
                                        <p className="font-mono font-bold text-lg text-gray-900">
                                            {handoffStatus.transmittal.receipt_number}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className="text-center p-4 bg-green-50 rounded-xl">
                            <p className="text-green-800 font-medium">
                                Unit Secured with {handoffStatus.transaction.developer_name || developerName || "Developer"}
                            </p>
                            <p className="text-sm text-green-600 mt-1">
                                Your reservation has been successfully transmitted
                            </p>
                        </div>

                        {/* Download Button */}
                        <Button
                            className="w-full bg-[#0247ae] hover:bg-[#023a8a] text-white py-6 text-lg"
                            onClick={() => {
                                // Mock download - in real app, generate PDF
                                alert("Receipt download will be implemented");
                            }}
                        >
                            <Download size={20} className="mr-2" />
                            Download Receipt
                        </Button>
                    </CardContent>
                </Card>
            </>
        );
    }

    // STATE: Transmitting
    if (handoffStatus?.status === "transmitting") {
        return (
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-lg">
                <CardContent className="py-12 text-center">
                    <div className="relative inline-block mb-6">
                        <div className="h-24 w-24 rounded-full border-4 border-purple-100 border-t-purple-500 animate-spin" />
                        <Building2 size={40} className="absolute inset-0 m-auto text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Transmitting to Developer...</h3>
                    <p className="text-gray-500">
                        Your reservation package is being sent to {developerName || "the developer"}
                    </p>
                    <div className="mt-6 flex justify-center gap-1">
                        {[0, 1, 2].map(i => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // STATE: Pending - Waiting for agent to transmit
    return (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <Building2 size={28} className="text-[#0247ae]" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Developer Handoff</CardTitle>
                        <CardDescription>Final step in your reservation</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
                    <Loader2 size={32} className="mx-auto text-[#0247ae] animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Waiting for Agent</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Your agent will transmit your package to {developerName || "the developer"}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
