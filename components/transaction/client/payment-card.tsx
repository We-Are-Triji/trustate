"use client";

import { useState, useCallback } from "react";
import { Upload, CreditCard, Clock, CheckCircle2, Loader2, Building2, Smartphone, AlertCircle, Camera } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PaymentInfo {
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    gcash_number?: string;
    amount: number;
    reference?: string;
}

interface PaymentCardProps {
    transactionId: string;
    paymentInfo: PaymentInfo;
    paymentStatus: "pending" | "uploaded" | "reviewing" | "confirmed";
    onUpload?: () => void;
}

export function PaymentCard({
    transactionId,
    paymentInfo,
    paymentStatus,
    onUpload
}: PaymentCardProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);

        try {
            // Upload proof of payment
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("document_type", "payment_proof");
            formData.append("file_name", `reservation_payment_${Date.now()}.${selectedFile.name.split(".").pop()}`);

            const response = await fetch(`/api/transactions/${transactionId}/documents`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_name: `reservation_payment_${Date.now()}.${selectedFile.name.split(".").pop()}`,
                    file_type: selectedFile.type,
                    file_size: selectedFile.size,
                    document_type: "payment_proof",
                }),
            });

            if (response.ok) {
                onUpload?.();
            }
        } catch (error) {
            console.error("Failed to upload:", error);
        } finally {
            setIsUploading(false);
        }
    };

    // Payment Required State
    if (paymentStatus === "pending") {
        return (
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <CreditCard size={28} className="text-[#0247ae]" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Payment Required</CardTitle>
                            <CardDescription>Complete your reservation payment</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Amount */}
                    <div className="text-center p-6 bg-white rounded-2xl border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Amount Due</p>
                        <p className="text-4xl font-bold text-gray-900">
                            ₱{paymentInfo.amount.toLocaleString()}
                        </p>
                        {paymentInfo.reference && (
                            <p className="text-sm text-gray-500 mt-2">
                                Reference: <span className="font-mono font-medium">{paymentInfo.reference}</span>
                            </p>
                        )}
                    </div>

                    {/* Payment Options */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Payment Options:</p>

                        {paymentInfo.bank_name && (
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <Building2 size={20} className="text-gray-600" />
                                    <span className="font-medium text-gray-900">Bank Transfer</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-gray-500">Bank:</span> {paymentInfo.bank_name}</p>
                                    <p><span className="text-gray-500">Account Name:</span> {paymentInfo.account_name}</p>
                                    <p><span className="text-gray-500">Account No:</span> <span className="font-mono">{paymentInfo.account_number}</span></p>
                                </div>
                            </div>
                        )}

                        {paymentInfo.gcash_number && (
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <Smartphone size={20} className="text-blue-600" />
                                    <span className="font-medium text-gray-900">GCash</span>
                                </div>
                                <p className="text-sm">
                                    <span className="text-gray-500">Number:</span>{" "}
                                    <span className="font-mono font-medium">{paymentInfo.gcash_number}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Upload Section */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">After payment, upload your receipt:</p>

                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="payment-proof"
                            />
                            <label
                                htmlFor="payment-proof"
                                className={`flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${selectedFile
                                    ? "border-green-300 bg-green-50"
                                    : "border-gray-300 hover:border-[#0247ae] hover:bg-blue-50"
                                    }`}
                            >
                                {selectedFile ? (
                                    <>
                                        <CheckCircle2 size={24} className="text-green-600" />
                                        <span className="font-medium text-green-700">{selectedFile.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <Camera size={24} className="text-gray-400" />
                                        <span className="text-gray-600">Tap to select receipt image</span>
                                    </>
                                )}
                            </label>
                        </div>

                        {selectedFile && (
                            <Button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="w-full bg-[#0247ae] hover:bg-[#023a8a] text-white py-6 text-lg"
                            >
                                {isUploading ? (
                                    <><Loader2 size={20} className="mr-2 animate-spin" />Uploading...</>
                                ) : (
                                    <><Upload size={20} className="mr-2" />Submit Payment Proof</>
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Payment Under Review State
    if (paymentStatus === "uploaded" || paymentStatus === "reviewing") {
        return (
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                                <Clock size={28} className="text-orange-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Payment Under Review</CardTitle>
                                <CardDescription>Waiting for agent confirmation</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700 border-0 animate-pulse">
                            Pending
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <AlertCircle size={20} className="text-orange-600" />
                        <p className="text-sm text-orange-800">
                            Your agent is reviewing your payment. You&apos;ll be notified once confirmed.
                        </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-2xl border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Amount Submitted</p>
                        <p className="text-3xl font-bold text-gray-900">
                            ₱{paymentInfo.amount.toLocaleString()}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Payment Confirmed State
    return (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 bg-green-100 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 size={28} className="text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-green-800">Payment Confirmed</CardTitle>
                            <CardDescription className="text-green-600">Your reservation is secured</CardDescription>
                        </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-0">
                        Complete
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-center p-6 bg-white rounded-2xl border border-green-200">
                    <CheckCircle2 size={48} className="mx-auto text-green-500 mb-3" />
                    <p className="text-green-800 font-medium">
                        Reservation payment of ₱{paymentInfo.amount.toLocaleString()} confirmed
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
