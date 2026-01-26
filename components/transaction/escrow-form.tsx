"use client";

import { useState } from "react";
import { Shield, CheckCircle2, Clock, Upload, Eye, ThumbsUp, Image as ImageIcon, AlertCircle, History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";

interface PaymentProof {
    id: string;
    fileName: string;
    uploadedAt: string;
    status: "pending" | "confirmed";
    amount?: number;
    description?: string;
}

interface EscrowFormProps {
    transactionId: string;
    onPaymentConfirmed?: () => void;
}

export function EscrowForm({ transactionId, onPaymentConfirmed }: EscrowFormProps) {
    const { accountType } = useAuth();
    const isAgent = accountType === "agent" || accountType === "broker";

    // Mock state - in real app, fetched from API
    const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirmPayment = (proofId: string) => {
        setPaymentProofs(prev => prev.map(p =>
            p.id === proofId ? { ...p, status: "confirmed" } : p
        ));
        onPaymentConfirmed?.();
    };

    const pendingProofs = paymentProofs.filter(p => p.status === "pending");
    const confirmedProofs = paymentProofs.filter(p => p.status === "confirmed");

    // AGENT VIEW
    if (isAgent) {
        return (
            <div className="h-full overflow-y-auto">
                <div className="p-6 space-y-6 max-w-4xl mx-auto">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Payment Verification</h2>
                        <p className="text-gray-500 mt-1">Review and confirm client payment submissions</p>
                    </div>

                    {/* Pending Payments */}
                    {pendingProofs.length > 0 && (
                        <Card className="border-orange-200 bg-orange-50">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2 text-orange-800">
                                    <Clock size={18} />
                                    Pending Confirmation ({pendingProofs.length})
                                </CardTitle>
                                <CardDescription className="text-orange-700">
                                    Review the payment proof and confirm receipt
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pendingProofs.map(proof => (
                                    <div key={proof.id} className="p-4 rounded-xl bg-white border border-orange-200">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <ImageIcon size={24} className="text-gray-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{proof.fileName}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        Uploaded {new Date(proof.uploadedAt).toLocaleString()}
                                                    </p>
                                                    {proof.description && (
                                                        <p className="text-sm text-gray-600 mt-1">{proof.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye size={14} className="mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleConfirmPayment(proof.id)}
                                                >
                                                    <ThumbsUp size={14} className="mr-1" />
                                                    Confirm Payment
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Empty State */}
                    {pendingProofs.length === 0 && confirmedProofs.length === 0 && (
                        <Card className="border-gray-200">
                            <CardContent className="py-16 text-center">
                                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload size={32} className="text-gray-400" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">No Payment Submissions Yet</h4>
                                <p className="text-sm text-gray-500 max-w-md mx-auto">
                                    When your client uploads proof of payment, it will appear here for your review.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Confirmed Payments */}
                    {confirmedProofs.length > 0 && (
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <History size={18} />
                                    Confirmed Payments ({confirmedProofs.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {confirmedProofs.map(proof => (
                                    <div key={proof.id} className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 size={20} className="text-green-600" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">{proof.fileName}</h4>
                                                <p className="text-xs text-gray-500">
                                                    Confirmed {new Date(proof.uploadedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-100 text-green-700 border-0">Confirmed</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Escrow Info */}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Shield size={16} className="text-green-500" />
                        <span>All payments are protected by Trustate Escrow</span>
                    </div>
                </div>
            </div>
        );
    }

    // CLIENT VIEW (To be implemented in Phase 2)
    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Escrow & Payments</h2>
                    <p className="text-gray-500 mt-1">Your secure payment portal</p>
                </div>

                <Card className="border-gray-200">
                    <CardContent className="py-16 text-center">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} className="text-[#0247ae]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Payment Portal Coming Soon</h4>
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            Your agent will provide payment instructions. Once you make a payment, upload your proof here.
                        </p>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield size={16} className="text-green-500" />
                    <span>Protected by Trustate Escrow</span>
                </div>
            </div>
        </div>
    );
}
