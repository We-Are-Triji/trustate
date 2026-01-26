"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Camera, CreditCard, CheckCircle2, Clock, Loader2, Scan, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface KYCStatus {
    status: "pending" | "id_uploaded" | "selfie_uploaded" | "analyzing" | "passed" | "approved" | "failed";
    id_uploaded: boolean;
    selfie_uploaded: boolean;
    analysis_complete: boolean;
    analysis_score: number | null;
    agent_approved: boolean;
}

interface KYCCardProps {
    transactionId: string;
    onComplete?: () => void;
}

export function KYCCard({ transactionId, onComplete }: KYCCardProps) {
    const [kycStatus, setKycStatus] = useState<KYCStatus>({
        status: "pending",
        id_uploaded: false,
        selfie_uploaded: false,
        analysis_complete: false,
        analysis_score: null,
        agent_approved: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStep, setUploadStep] = useState<"id" | "selfie" | null>(null);

    // Fetch KYC status
    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch(`/api/transactions/${transactionId}/kyc`);
            if (res.ok) {
                const data = await res.json();
                setKycStatus(data);
                if (data.agent_approved) {
                    onComplete?.();
                }
            }
        } catch (error) {
            console.error("Failed to fetch KYC status:", error);
        } finally {
            setIsLoading(false);
        }
    }, [transactionId, onComplete]);

    useEffect(() => {
        fetchStatus();
        // Poll every 3 seconds
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    // Handle file selection for ID
    const handleIDUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        setIsUploading(true);
        setUploadStep("id");

        try {
            // Mock upload - in real app, upload to S3 first
            await new Promise(r => setTimeout(r, 1500));

            await fetch(`/api/transactions/${transactionId}/kyc`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "upload_id",
                    id_document_url: "mocked_id_url",
                }),
            });

            fetchStatus();
        } catch (error) {
            console.error("Failed to upload ID:", error);
        } finally {
            setIsUploading(false);
            setUploadStep(null);
        }
    };

    // Handle selfie capture
    const handleSelfieCapture = async () => {
        setIsUploading(true);
        setUploadStep("selfie");

        try {
            // Mock liveness check - in real app, use camera API
            await new Promise(r => setTimeout(r, 2000));

            await fetch(`/api/transactions/${transactionId}/kyc`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "upload_selfie",
                    selfie_url: "mocked_selfie_url",
                }),
            });

            // Start analysis
            await fetch(`/api/transactions/${transactionId}/kyc`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "start_analysis" }),
            });

            fetchStatus();
        } catch (error) {
            console.error("Failed to capture selfie:", error);
        } finally {
            setIsUploading(false);
            setUploadStep(null);
        }
    };

    if (isLoading) {
        return (
            <Card className="border-gray-200 shadow-lg animate-pulse">
                <CardContent className="py-12 text-center">
                    <Loader2 size={32} className="mx-auto text-gray-400 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    // STATE: Approved
    if (kycStatus.agent_approved) {
        return (
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 bg-green-100 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 size={28} className="text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-green-800">Identity Verified</CardTitle>
                                <CardDescription className="text-green-600">Your identity has been confirmed</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0">Complete</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-6 bg-white rounded-2xl border border-green-200">
                        <CheckCircle2 size={48} className="mx-auto text-green-500 mb-3" />
                        <p className="text-green-800 font-medium">
                            Verification score: {kycStatus.analysis_score}%
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // STATE: Passed - Waiting for Agent Approval
    if (kycStatus.status === "passed") {
        return (
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items.center gap-3">
                            <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 size={28} className="text-[#0247ae]" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Verification Successful</CardTitle>
                                <CardDescription>Waiting for Final Approval</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-0 animate-pulse">Pending</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                        <CheckCircle2 size={20} className="text-green-600" />
                        <div>
                            <p className="font-medium text-green-800">Biometric Analysis Passed</p>
                            <p className="text-sm text-green-600">Score: {kycStatus.analysis_score}%</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <Clock size={20} className="text-[#0247ae]" />
                        <p className="text-sm text-gray-700">
                            Your agent is reviewing your verification. You&apos;ll be notified once approved.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // STATE: Analyzing
    if (kycStatus.status === "analyzing") {
        return (
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                            <Scan size={28} className="text-purple-600 animate-pulse" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Identity Analysis in Progress</CardTitle>
                            <CardDescription>Verifying Biometrics...</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-8 bg-white rounded-2xl border border-purple-200">
                        <div className="relative inline-block">
                            <div className="h-20 w-20 rounded-full border-4 border-purple-100 border-t-purple-500 animate-spin" />
                            <Scan size={32} className="absolute inset-0 m-auto text-purple-600" />
                        </div>
                        <p className="mt-4 font-medium text-gray-900">Analyzing your documents...</p>
                        <p className="text-sm text-gray-500 mt-1">This usually takes a few seconds</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // STATE: Pending - Start Verification
    return (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <Shield size={28} className="text-[#0247ae]" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Verify Your Identity</CardTitle>
                        <CardDescription>Complete KYC to proceed</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Step 1: Upload ID */}
                <div className={`p-4 rounded-xl border-2 transition-all ${kycStatus.id_uploaded
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${kycStatus.id_uploaded ? "bg-green-100" : "bg-gray-100"
                                }`}>
                                {kycStatus.id_uploaded ? (
                                    <CheckCircle2 size={20} className="text-green-600" />
                                ) : (
                                    <CreditCard size={20} className="text-gray-400" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Upload ID Document</p>
                                <p className="text-sm text-gray-500">Passport, Driver&apos;s License, or National ID</p>
                            </div>
                        </div>
                        {!kycStatus.id_uploaded && (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleIDUpload}
                                    className="hidden"
                                    id="id-upload"
                                    disabled={isUploading}
                                />
                                <label
                                    htmlFor="id-upload"
                                    className={`px-4 py-2 rounded-lg font-medium text-sm cursor-pointer transition-all ${isUploading && uploadStep === "id"
                                            ? "bg-gray-100 text-gray-400"
                                            : "bg-[#0247ae] text-white hover:bg-[#023a8a]"
                                        }`}
                                >
                                    {isUploading && uploadStep === "id" ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 size={14} className="animate-spin" />
                                            Uploading...
                                        </span>
                                    ) : (
                                        "Upload"
                                    )}
                                </label>
                            </>
                        )}
                    </div>
                </div>

                {/* Step 2: Liveness Check */}
                <div className={`p-4 rounded-xl border-2 transition-all ${kycStatus.selfie_uploaded
                        ? "border-green-200 bg-green-50"
                        : kycStatus.id_uploaded
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 bg-gray-50 opacity-60"
                    }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${kycStatus.selfie_uploaded
                                    ? "bg-green-100"
                                    : kycStatus.id_uploaded
                                        ? "bg-blue-100"
                                        : "bg-gray-100"
                                }`}>
                                {kycStatus.selfie_uploaded ? (
                                    <CheckCircle2 size={20} className="text-green-600" />
                                ) : (
                                    <Camera size={20} className={kycStatus.id_uploaded ? "text-[#0247ae]" : "text-gray-400"} />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Liveness Check</p>
                                <p className="text-sm text-gray-500">Take a selfie for face verification</p>
                            </div>
                        </div>
                        {kycStatus.id_uploaded && !kycStatus.selfie_uploaded && (
                            <Button
                                onClick={handleSelfieCapture}
                                disabled={isUploading}
                                className="bg-[#0247ae] hover:bg-[#023a8a]"
                            >
                                {isUploading && uploadStep === "selfie" ? (
                                    <><Loader2 size={14} className="mr-2 animate-spin" />Scanning...</>
                                ) : (
                                    <><Camera size={14} className="mr-2" />Start Scan</>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <AlertCircle size={16} className="text-gray-400 mt-0.5" />
                    <p className="text-xs text-gray-500">
                        Your information is encrypted and securely processed. We use advanced biometric verification to protect your identity.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
