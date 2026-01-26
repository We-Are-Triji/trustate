"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, CheckCircle2, Clock, Upload, Eye, ThumbsUp, AlertCircle, History, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";

interface PaymentProof {
    id: string;
    file_name: string;
    file_url: string;
    created_at: string;
    status: "pending" | "reviewed" | "flagged" | "acknowledged" | "signed" | "rejected";
    document_type: string;
}

interface EscrowFormProps {
    transactionId: string;
    onPaymentConfirmed?: () => void;
}

export function EscrowForm({ transactionId, onPaymentConfirmed }: EscrowFormProps) {
    const { accountType } = useAuth();
    const isAgent = accountType === "agent" || accountType === "broker";

    const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState<string | null>(null);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);

    // Fetch payment documents
    const fetchPayments = useCallback(async () => {
        try {
            // Fetch documents
            const docsRes = await fetch(`/api/transactions/${transactionId}/documents`);
            if (docsRes.ok) {
                const docsData = await docsRes.json();
                const proofs = docsData.documents?.filter(
                    (d: PaymentProof) => d.document_type === "payment_proof"
                ) || [];
                setPaymentProofs(proofs);
            }

            // Fetch payment status
            const statusRes = await fetch(`/api/transactions/${transactionId}/payment`);
            if (statusRes.ok) {
                const statusData = await statusRes.json();
                setPaymentConfirmed(statusData.payment_confirmed);
            }
        } catch (error) {
            console.error("Failed to fetch payments:", error);
        } finally {
            setIsLoading(false);
        }
    }, [transactionId]);

    useEffect(() => {
        fetchPayments();
        // Poll every 5 seconds
        const interval = setInterval(fetchPayments, 5000);
        return () => clearInterval(interval);
    }, [fetchPayments]);

    const handleConfirmPayment = async (proofId: string) => {
        setIsConfirming(proofId);
        try {
            const response = await fetch(`/api/transactions/${transactionId}/payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "confirm" }),
            });

            if (response.ok) {
                setPaymentConfirmed(true);
                onPaymentConfirmed?.();
                fetchPayments();
            }
        } catch (error) {
            console.error("Failed to confirm payment:", error);
        } finally {
            setIsConfirming(null);
        }
    };

    const pendingProofs = paymentProofs.filter(p => p.status === "pending");

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#0247ae]" />
            </div>
        );
    }

    // AGENT VIEW
    if (isAgent) {
        return (
            <div className="h-full overflow-y-auto">
                <div className="p-6 space-y-6 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Payment Verification</h2>
                            <p className="text-gray-500 mt-1">Review and confirm client payment submissions</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={fetchPayments} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <RefreshCw size={16} />
                            </button>
                            {paymentConfirmed && (
                                <Badge className="bg-green-100 text-green-700 border-0">
                                    <CheckCircle2 size={14} className="mr-1" />
                                    Payment Confirmed
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* No Payments Yet */}
                    {paymentProofs.length === 0 && (
                        <Card className="border-gray-200">
                            <CardContent className="py-12 text-center">
                                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock size={32} className="text-gray-400" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Waiting for Client Payment</h4>
                                <p className="text-sm text-gray-500 max-w-md mx-auto">
                                    The client has not yet uploaded proof of payment. They will see bank/GCash details on their dashboard.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pending Payments */}
                    {pendingProofs.length > 0 && !paymentConfirmed && (
                        <Card className="border-orange-200 bg-orange-50">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2 text-orange-800">
                                    <Clock size={18} />
                                    Pending Confirmation ({pendingProofs.length})
                                </CardTitle>
                                <CardDescription className="text-orange-700">
                                    Review the payment proofs below
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pendingProofs.map((proof) => (
                                    <div key={proof.id} className="bg-white p-4 rounded-xl border border-orange-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Upload size={20} className="text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{proof.file_name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Uploaded {new Date(proof.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye size={14} className="mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleConfirmPayment(proof.id)}
                                                    disabled={isConfirming === proof.id}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {isConfirming === proof.id ? (
                                                        <Loader2 size={14} className="mr-1 animate-spin" />
                                                    ) : (
                                                        <ThumbsUp size={14} className="mr-1" />
                                                    )}
                                                    Confirm
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Payment Confirmed */}
                    {paymentConfirmed && (
                        <Card className="border-green-200 bg-green-50">
                            <CardContent className="py-8 text-center">
                                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={32} className="text-green-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Payment Confirmed</h4>
                                <p className="text-sm text-gray-600 max-w-md mx-auto">
                                    The reservation payment has been verified. KYC & Identity step is now unlocked.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Escrow Info */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Shield size={18} className="text-[#0247ae]" />
                                Escrow Protection
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                                <AlertCircle size={20} className="text-[#0247ae] mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">Secure Transaction</p>
                                    <p className="text-gray-600">
                                        All payments are held in escrow until transaction milestones are met.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // CLIENT VIEW
    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-6 max-w-lg mx-auto">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Reservation Payment</h2>
                    <p className="text-gray-500 mt-1">Secure your property reservation</p>
                </div>

                <Card className="border-gray-200">
                    <CardContent className="py-8 text-center">
                        <Shield size={48} className="mx-auto text-[#0247ae] mb-4" />
                        <p className="text-gray-600">
                            Payment information is displayed on your mobile dashboard.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
