"use client";

import { useState, useEffect, useCallback } from "react";
import { Camera, Shield, CheckCircle2, Clock, UserCheck, CreditCard, Loader2, ThumbsUp, RefreshCw, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";

interface KYCTabProps {
    transactionId: string;
    onKYCComplete?: () => void;
}

interface KYCStatus {
    status: string;
    id_uploaded: boolean;
    selfie_uploaded: boolean;
    analysis_complete: boolean;
    analysis_score: number | null;
    agent_approved: boolean;
}

export function KYCTab({ transactionId, onKYCComplete }: KYCTabProps) {
    const { accountType } = useAuth();
    const isAgent = accountType === "agent" || accountType === "broker";

    const [kycStatus, setKycStatus] = useState<KYCStatus>({
        status: "pending",
        id_uploaded: false,
        selfie_uploaded: false,
        analysis_complete: false,
        analysis_score: null,
        agent_approved: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isApproving, setIsApproving] = useState(false);

    // Fetch KYC status from backend
    const fetchKYCStatus = useCallback(async () => {
        try {
            const res = await fetch(`/api/transactions/${transactionId}/kyc`);
            if (res.ok) {
                const data = await res.json();
                setKycStatus(data);
                if (data.agent_approved) {
                    onKYCComplete?.();
                }
            }
        } catch (error) {
            console.error("Failed to fetch KYC status:", error);
        } finally {
            setIsLoading(false);
        }
    }, [transactionId, onKYCComplete]);

    // Initial fetch and polling
    useEffect(() => {
        fetchKYCStatus();
        // Poll every 5 seconds
        const interval = setInterval(fetchKYCStatus, 5000);
        return () => clearInterval(interval);
    }, [fetchKYCStatus]);

    // Agent approves KYC
    const handleApproveKYC = async () => {
        setIsApproving(true);

        try {
            const response = await fetch(`/api/transactions/${transactionId}/kyc`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "agent_approve" }),
            });

            if (response.ok) {
                fetchKYCStatus();
            }
        } catch (error) {
            console.error("Failed to approve KYC:", error);
        } finally {
            setIsApproving(false);
        }
    };

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
                <div className="p-6 space-y-6 max-w-5xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">KYC & Identity Verification</h2>
                            <p className="text-gray-500 mt-1">Review and approve client identity</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={fetchKYCStatus} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <RefreshCw size={16} />
                            </button>
                            {kycStatus.agent_approved && (
                                <Badge className="bg-green-100 text-green-700 border-0 text-sm px-4 py-2">
                                    <CheckCircle2 size={16} className="mr-2" />
                                    Identity Verified
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Status Overview */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className={`border-2 ${kycStatus.id_uploaded ? "border-green-200 bg-green-50" : "border-gray-200"}`}>
                            <CardContent className="pt-6 text-center">
                                <CreditCard size={32} className={`mx-auto mb-2 ${kycStatus.id_uploaded ? "text-green-600" : "text-gray-300"}`} />
                                <p className="font-medium text-gray-900">ID Document</p>
                                <p className="text-sm text-gray-500">
                                    {kycStatus.id_uploaded ? "Uploaded" : "Waiting..."}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className={`border-2 ${kycStatus.selfie_uploaded ? "border-green-200 bg-green-50" : "border-gray-200"}`}>
                            <CardContent className="pt-6 text-center">
                                <Camera size={32} className={`mx-auto mb-2 ${kycStatus.selfie_uploaded ? "text-green-600" : "text-gray-300"}`} />
                                <p className="font-medium text-gray-900">Live Selfie</p>
                                <p className="text-sm text-gray-500">
                                    {kycStatus.selfie_uploaded ? "Captured" : "Waiting..."}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className={`border-2 ${kycStatus.analysis_complete ? "border-green-200 bg-green-50" : "border-gray-200"}`}>
                            <CardContent className="pt-6 text-center">
                                <Shield size={32} className={`mx-auto mb-2 ${kycStatus.analysis_complete ? "text-green-600" : "text-gray-300"}`} />
                                <p className="font-medium text-gray-900">AI Analysis</p>
                                <p className="text-sm text-gray-500">
                                    {kycStatus.analysis_complete ? `Score: ${kycStatus.analysis_score}%` : "Pending..."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Waiting for Client */}
                    {!kycStatus.analysis_complete && kycStatus.status !== "analyzing" && (
                        <Card className="border-gray-200">
                            <CardContent className="py-12 text-center">
                                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock size={32} className="text-[#0247ae]" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Waiting for Client</h4>
                                <p className="text-sm text-gray-500 max-w-md mx-auto">
                                    The client needs to complete their identity verification scan. You will be notified when it&apos;s ready for review.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Analysis in Progress */}
                    {kycStatus.status === "analyzing" && (
                        <Card className="border-purple-200 bg-purple-50">
                            <CardContent className="py-8 text-center">
                                <Loader2 size={40} className="mx-auto mb-4 text-purple-600 animate-spin" />
                                <h4 className="font-semibold text-gray-900 mb-2">Analyzing Biometrics...</h4>
                                <p className="text-sm text-gray-600">
                                    AI is verifying the client&apos;s identity documents
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Identity Review Card */}
                    {kycStatus.analysis_complete && !kycStatus.agent_approved && (
                        <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-white">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <UserCheck size={20} className="text-[#0247ae]" />
                                            Identity Review Required
                                        </CardTitle>
                                        <CardDescription>Compare ID photo with live selfie</CardDescription>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 border-0">
                                        Match Score: {kycStatus.analysis_score}%
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Side-by-side Comparison */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-gray-700">ID Card Photo</p>
                                        <div className="aspect-[4/3] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                                            <div className="text-center">
                                                <CreditCard size={48} className="mx-auto text-gray-400 mb-2" />
                                                <p className="text-xs text-gray-500">Extracted by AI</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                            <p><strong>Name:</strong> Juan Dela Cruz</p>
                                            <p><strong>ID Type:</strong> Philippine Passport</p>
                                            <p><strong>Expiry:</strong> Dec 2028</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-gray-700">Live Selfie</p>
                                        <div className="aspect-[4/3] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                                            <div className="text-center">
                                                <User size={48} className="mx-auto text-gray-400 mb-2" />
                                                <p className="text-xs text-gray-500">Liveness Verified</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700">
                                            <p className="flex items-center gap-2">
                                                <CheckCircle2 size={14} />
                                                Liveness check passed
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <CheckCircle2 size={14} />
                                                Face match verified
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Approval Button */}
                                <Button
                                    onClick={handleApproveKYC}
                                    disabled={isApproving}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                                >
                                    {isApproving ? (
                                        <><Loader2 size={20} className="mr-2 animate-spin" />Processing...</>
                                    ) : (
                                        <><ThumbsUp size={20} className="mr-2" />Approve & Lock Identity</>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Approved State */}
                    {kycStatus.agent_approved && (
                        <Card className="border-green-300 bg-green-50">
                            <CardContent className="py-8 text-center">
                                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={32} className="text-green-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Identity Verified & Locked</h4>
                                <p className="text-sm text-gray-600 max-w-md mx-auto">
                                    The client&apos;s identity has been verified. Document Assembly is now unlocked.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        );
    }

    // CLIENT VIEW - Redirect to main client view
    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Identity Verification</h2>
                    <p className="text-gray-500 mt-1">Complete your KYC to proceed</p>
                </div>

                <Card className="border-gray-200">
                    <CardContent className="py-12 text-center">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} className="text-[#0247ae]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Complete KYC on Mobile</h4>
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            Please use your mobile device to complete identity verification.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
