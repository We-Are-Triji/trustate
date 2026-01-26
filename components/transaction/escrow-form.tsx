"use client";

import { useState } from "react";
import { Shield, Wallet, Info, Upload, QrCode, Copy, CheckCircle2, Clock, AlertCircle, Plus, Trash2, ThumbsUp, Loader2, Image as ImageIcon, History, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/hooks/use-auth";

// Mock bank details for demo
const BANK_DETAILS = {
    bankName: "BDO Unibank",
    accountName: "Trustate Escrow Inc.",
    accountNumber: "0012-3456-7890",
    branch: "Makati City Branch"
};

// Payment step statuses
type PaymentStatus = "pending" | "submitted" | "trustate_verified" | "completed";

interface PaymentStep {
    id: string;
    name: string;
    amount: number;
    description: string;
    status: PaymentStatus;
    uploadedFile?: string;
    submittedAt?: string;
    trustateVerifiedAt?: string;
    completedAt?: string;
}

interface EscrowFormProps {
    transactionId: string;
}

export function EscrowForm({ transactionId }: EscrowFormProps) {
    const { accountType } = useAuth();
    const isAgent = accountType === "agent" || accountType === "broker";

    // Payment steps state
    const [paymentSteps, setPaymentSteps] = useState<PaymentStep[]>([]);

    // Form state for new step
    const [newName, setNewName] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [newDescription, setNewDescription] = useState("");

    // UI state
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Agent: Add new payment step
    const addPaymentStep = () => {
        if (!newName || !newAmount) return;

        const newStep: PaymentStep = {
            id: `step-${Date.now()}`,
            name: newName,
            amount: parseFloat(newAmount),
            description: newDescription || "Payment required",
            status: "pending"
        };

        setPaymentSteps(prev => [...prev, newStep]);
        setNewName("");
        setNewAmount("");
        setNewDescription("");
    };

    // Agent: Remove pending step
    const removePaymentStep = (id: string) => {
        setPaymentSteps(prev => prev.filter(s => s.id !== id));
    };

    // Client: Submit payment proof
    const handleSubmitPayment = async (stepId: string, file: File) => {
        setIsSubmitting(stepId);

        // Update to submitted status
        setPaymentSteps(prev => prev.map(s =>
            s.id === stepId
                ? { ...s, status: "submitted", uploadedFile: file.name, submittedAt: new Date().toISOString() }
                : s
        ));

        // Simulate Trustate verification after 3 seconds
        setTimeout(() => {
            setPaymentSteps(prev => prev.map(s =>
                s.id === stepId
                    ? { ...s, status: "trustate_verified", trustateVerifiedAt: new Date().toISOString() }
                    : s
            ));
            setIsSubmitting(null);
        }, 3000);
    };

    // Agent: Final confirmation
    const handleAgentConfirm = (stepId: string) => {
        setPaymentSteps(prev => prev.map(s =>
            s.id === stepId
                ? { ...s, status: "completed", completedAt: new Date().toISOString() }
                : s
        ));
    };

    const getStatusBadge = (status: PaymentStatus) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-green-100 text-green-700 border-0"><CheckCircle2 size={12} className="mr-1" />Completed</Badge>;
            case "trustate_verified":
                return <Badge className="bg-blue-100 text-blue-700 border-0"><CheckCircle2 size={12} className="mr-1" />Awaiting Agent Confirmation</Badge>;
            case "submitted":
                return <Badge className="bg-yellow-100 text-yellow-700 border-0"><Loader2 size={12} className="mr-1 animate-spin" />Verifying Payment...</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-700 border-0"><Clock size={12} className="mr-1" />Awaiting Payment</Badge>;
        }
    };

    // Separate pending and completed
    const pendingSteps = paymentSteps.filter(s => s.status !== "completed");
    const completedSteps = paymentSteps.filter(s => s.status === "completed");

    // CLIENT VIEW
    if (!isAgent) {
        return (
            <div className="h-full overflow-y-auto">
                <div className="p-6 space-y-6 max-w-4xl mx-auto">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Escrow & Payments</h2>
                        <p className="text-gray-500 mt-1">Complete your payment requirements</p>
                    </div>

                    {/* How It Works */}
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <Shield size={20} className="text-[#0247ae] shrink-0" />
                        <p className="text-sm text-blue-800">
                            <strong>Secure Escrow:</strong> Pay to Trustate&apos;s account. We verify receipt and hold funds until your agent confirms completion.
                        </p>
                    </div>

                    {/* Pending Payments */}
                    {pendingSteps.length > 0 && (
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-base">Pending Payments</CardTitle>
                                <CardDescription>Complete these payments to proceed</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pendingSteps.map(step => (
                                    <div key={step.id} className="p-5 rounded-xl border border-gray-200 bg-white space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{step.name}</h4>
                                                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                                                <p className="text-2xl font-bold text-[#0247ae] mt-2">₱{step.amount.toLocaleString()}</p>
                                            </div>
                                            {getStatusBadge(step.status)}
                                        </div>

                                        {step.status === "pending" && (
                                            <>
                                                {/* Bank Details */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                                    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl">
                                                        <div className="h-24 w-24 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-2">
                                                            <QrCode size={60} className="text-gray-400" />
                                                        </div>
                                                        <p className="text-xs text-gray-500">Scan to pay</p>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                                            <span className="text-gray-500">Bank</span>
                                                            <span className="font-medium">{BANK_DETAILS.bankName}</span>
                                                        </div>
                                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                                            <span className="text-gray-500">Account Name</span>
                                                            <span className="font-medium">{BANK_DETAILS.accountName}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                            <span className="text-gray-500">Account No.</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono font-medium">{BANK_DETAILS.accountNumber}</span>
                                                                <button
                                                                    onClick={() => copyToClipboard(BANK_DETAILS.accountNumber)}
                                                                    className="p-1 hover:bg-gray-200 rounded"
                                                                >
                                                                    {copied ? <CheckCircle2 size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Upload */}
                                                <label className="block">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleSubmitPayment(step.id, file);
                                                        }}
                                                    />
                                                    <Button variant="default" className="w-full bg-[#0247ae] hover:bg-[#023a8a]" asChild>
                                                        <span>
                                                            <Upload size={16} className="mr-2" />
                                                            Upload Payment Slip & Submit
                                                        </span>
                                                    </Button>
                                                </label>
                                            </>
                                        )}

                                        {step.status === "submitted" && (
                                            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl">
                                                <Loader2 size={20} className="text-yellow-600 animate-spin" />
                                                <div>
                                                    <p className="font-medium text-yellow-800">Verifying your payment...</p>
                                                    <p className="text-sm text-yellow-600">Trustate is checking if funds have been received</p>
                                                </div>
                                            </div>
                                        )}

                                        {step.status === "trustate_verified" && (
                                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                                                <CheckCircle2 size={20} className="text-blue-600" />
                                                <div>
                                                    <p className="font-medium text-blue-800">Payment Received by Trustate</p>
                                                    <p className="text-sm text-blue-600">Waiting for your agent to confirm and complete this step</p>
                                                </div>
                                            </div>
                                        )}

                                        {step.uploadedFile && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <ImageIcon size={14} />
                                                <span>Uploaded: {step.uploadedFile}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Empty State */}
                    {pendingSteps.length === 0 && completedSteps.length === 0 && (
                        <Card className="border-gray-200">
                            <CardContent className="py-12 text-center">
                                <Wallet size={40} className="mx-auto mb-3 text-gray-300" />
                                <h4 className="font-semibold text-gray-900">No Payment Requirements</h4>
                                <p className="text-sm text-gray-500 mt-1">Your agent will set up payment steps when needed</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Completed Payments */}
                    {completedSteps.length > 0 && (
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <History size={18} />
                                    Payment History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {completedSteps.map(step => (
                                    <div key={step.id} className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{step.name}</h4>
                                            <p className="text-xs text-gray-500">Completed {new Date(step.completedAt!).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-700">₱{step.amount.toLocaleString()}</p>
                                            <CheckCircle2 size={14} className="inline text-green-500" />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Shield size={16} className="text-green-500" />
                        <span>Protected by Trustate Escrow</span>
                    </div>
                </div>
            </div>
        );
    }

    // AGENT VIEW
    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-6 max-w-5xl mx-auto">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
                    <p className="text-gray-500 mt-1">Create and manage client payment steps</p>
                </div>

                {/* Create Payment Step */}
                <Card className="border-gray-200 border-dashed">
                    <CardHeader>
                        <CardTitle className="text-base">Create Payment Step</CardTitle>
                        <CardDescription>Define a new payment requirement for the client</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                placeholder="Payment Name (e.g., Reservation Fee)"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <Input
                                placeholder="Amount (₱)"
                                type="number"
                                value={newAmount}
                                onChange={(e) => setNewAmount(e.target.value)}
                            />
                        </div>
                        <Textarea
                            placeholder="Description / Instructions for the client"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            rows={2}
                        />
                        <Button onClick={addPaymentStep} className="bg-[#0247ae] hover:bg-[#023a8a]" disabled={!newName || !newAmount}>
                            <Plus size={16} className="mr-2" />
                            Add Payment Step
                        </Button>
                    </CardContent>
                </Card>

                {/* Active Steps */}
                {pendingSteps.length > 0 && (
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-base">Active Payment Steps</CardTitle>
                            <CardDescription>Monitor and confirm client payments</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {pendingSteps.map(step => (
                                <div key={step.id} className={`p-4 rounded-xl border ${step.status === "trustate_verified" ? "border-blue-300 bg-blue-50" :
                                        step.status === "submitted" ? "border-yellow-300 bg-yellow-50" :
                                            "border-gray-200 bg-white"
                                    }`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-semibold text-gray-900">{step.name}</h4>
                                                {getStatusBadge(step.status)}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                                            <p className="text-lg font-bold text-gray-900 mt-2">₱{step.amount.toLocaleString()}</p>

                                            {step.uploadedFile && (
                                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                                    <ImageIcon size={14} />
                                                    <span>{step.uploadedFile}</span>
                                                    <span className="text-gray-400">({new Date(step.submittedAt!).toLocaleString()})</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {step.status === "trustate_verified" && (
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => handleAgentConfirm(step.id)}
                                                >
                                                    <ThumbsUp size={14} className="mr-1" />
                                                    Confirm & Complete
                                                </Button>
                                            )}
                                            {step.status === "pending" && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => removePaymentStep(step.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {paymentSteps.length === 0 && (
                    <Card className="border-gray-200">
                        <CardContent className="py-12 text-center">
                            <Wallet size={40} className="mx-auto mb-3 text-gray-300" />
                            <h4 className="font-semibold text-gray-900">No Payment Steps Yet</h4>
                            <p className="text-sm text-gray-500 mt-1">Create payment steps above to collect payments from your client</p>
                        </CardContent>
                    </Card>
                )}

                {/* Completed Payments */}
                {completedSteps.length > 0 && (
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <History size={18} />
                                Completed Payments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {completedSteps.map(step => (
                                <div key={step.id} className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{step.name}</h4>
                                        <p className="text-xs text-gray-500">Confirmed {new Date(step.completedAt!).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-700">₱{step.amount.toLocaleString()}</p>
                                        <CheckCircle2 size={14} className="inline text-green-500" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="border-gray-200">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-gray-500">Total Steps</p>
                            <p className="text-2xl font-bold text-gray-900">{paymentSteps.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-200">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-gray-500">Collected</p>
                            <p className="text-2xl font-bold text-green-600">
                                ₱{completedSteps.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-200">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-orange-600">
                                ₱{pendingSteps.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
