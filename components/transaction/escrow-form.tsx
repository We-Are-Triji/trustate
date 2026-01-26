"use client";

import { useState, useRef } from "react";
import { Shield, Wallet, Building2, Info, Upload, QrCode, Copy, CheckCircle2, Clock, AlertCircle, Plus, Trash2, Eye, ThumbsUp, ThumbsDown, Loader2, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/use-auth";

// Mock bank details for demo
const BANK_DETAILS = {
    bankName: "BDO Unibank",
    accountName: "Trustate Escrow Inc.",
    accountNumber: "0012-3456-7890",
    branch: "Makati City Branch"
};

// Type definitions
interface PaymentMilestone {
    id: string;
    label: string;
    amount: number;
    expectedFileName: string;
    status: "pending" | "uploaded" | "verified" | "rejected";
    uploadedFile?: string;
    uploadedAt?: string;
}

interface EscrowFormProps {
    transactionId: string;
}

export function EscrowForm({ transactionId }: EscrowFormProps) {
    const { accountType } = useAuth();
    const isAgent = accountType === "agent" || accountType === "broker";
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock milestones - in real app, fetched from API
    const [milestones, setMilestones] = useState<PaymentMilestone[]>([
        { id: "1", label: "Reservation Fee", amount: 50000, expectedFileName: "reservation_fee", status: "pending" },
    ]);

    const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [copied, setCopied] = useState(false);

    // New milestone form
    const [newLabel, setNewLabel] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [newFileName, setNewFileName] = useState("");

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, milestoneId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        // Simulate upload delay
        await new Promise(r => setTimeout(r, 1000));

        const milestone = milestones.find(m => m.id === milestoneId);
        if (!milestone) return;

        // Check if filename matches expected pattern
        const fileNameWithoutExt = file.name.replace(/\.[^.]+$/, "").toLowerCase();
        const expectedPattern = milestone.expectedFileName.toLowerCase();
        const isMatch = fileNameWithoutExt.includes(expectedPattern);

        setMilestones(prev => prev.map(m =>
            m.id === milestoneId
                ? {
                    ...m,
                    status: isMatch ? "uploaded" : "pending",
                    uploadedFile: isMatch ? file.name : undefined,
                    uploadedAt: isMatch ? new Date().toISOString() : undefined
                }
                : m
        ));

        setIsUploading(false);

        if (!isMatch) {
            alert(`File name must contain "${milestone.expectedFileName}" (e.g., ${milestone.expectedFileName}.jpg)`);
        }
    };

    const handleVerify = (milestoneId: string, approved: boolean) => {
        setMilestones(prev => prev.map(m =>
            m.id === milestoneId
                ? { ...m, status: approved ? "verified" : "rejected" }
                : m
        ));
    };

    const addMilestone = () => {
        if (!newLabel || !newAmount || !newFileName) return;

        const newMilestone: PaymentMilestone = {
            id: `${Date.now()}`,
            label: newLabel,
            amount: parseFloat(newAmount),
            expectedFileName: newFileName.toLowerCase().replace(/\s+/g, "_"),
            status: "pending"
        };

        setMilestones(prev => [...prev, newMilestone]);
        setNewLabel("");
        setNewAmount("");
        setNewFileName("");
    };

    const removeMilestone = (id: string) => {
        setMilestones(prev => prev.filter(m => m.id !== id));
    };

    const getStatusBadge = (status: PaymentMilestone["status"]) => {
        switch (status) {
            case "verified":
                return <Badge className="bg-green-100 text-green-700 border-0"><CheckCircle2 size={12} className="mr-1" />Verified</Badge>;
            case "uploaded":
                return <Badge className="bg-blue-100 text-blue-700 border-0"><Clock size={12} className="mr-1" />Awaiting Verification</Badge>;
            case "rejected":
                return <Badge className="bg-red-100 text-red-700 border-0"><AlertCircle size={12} className="mr-1" />Rejected</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-700 border-0"><Clock size={12} className="mr-1" />Pending</Badge>;
        }
    };

    // CLIENT VIEW
    if (!isAgent) {
        return (
            <div className="h-full overflow-y-auto">
                <div className="p-6 space-y-6 max-w-4xl mx-auto">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Escrow & Payments</h2>
                        <p className="text-gray-500 mt-1">Secure payment handling for your transaction</p>
                    </div>

                    {/* How It Works */}
                    <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Shield size={20} className="text-[#0247ae]" />
                                How Trustate Escrow Works
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <Info size={18} className="text-amber-600 shrink-0" />
                                <p className="text-sm text-amber-800">
                                    <strong>Your money is never sent directly to the developer.</strong> Pay to Trustate, and we release funds only when verified.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Details */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-base">Payment Details</CardTitle>
                            <CardDescription>Send your payment to the following account</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* QR Code Placeholder */}
                                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <div className="h-40 w-40 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-4">
                                        <QrCode size={100} className="text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500">Scan QR to pay</p>
                                </div>

                                {/* Bank Details */}
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Bank</span>
                                            <span className="font-medium text-gray-900">{BANK_DETAILS.bankName}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Account Name</span>
                                            <span className="font-medium text-gray-900">{BANK_DETAILS.accountName}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Account Number</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-medium text-gray-900">{BANK_DETAILS.accountNumber}</span>
                                                <button
                                                    onClick={() => copyToClipboard(BANK_DETAILS.accountNumber)}
                                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                >
                                                    {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Branch</span>
                                            <span className="font-medium text-gray-900">{BANK_DETAILS.branch}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Milestones with Upload */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-base">Your Payment Requirements</CardTitle>
                            <CardDescription>Upload proof of payment for each milestone</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {milestones.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Wallet size={32} className="mx-auto mb-2 text-gray-300" />
                                    <p>No payment requirements yet</p>
                                    <p className="text-sm">Your agent will set up payment milestones</p>
                                </div>
                            ) : (
                                milestones.map(milestone => (
                                    <div key={milestone.id} className="p-4 rounded-xl border border-gray-200 bg-white">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{milestone.label}</h4>
                                                <p className="text-xl font-bold text-[#0247ae]">₱{milestone.amount.toLocaleString()}</p>
                                            </div>
                                            {getStatusBadge(milestone.status)}
                                        </div>

                                        {milestone.status === "verified" ? (
                                            <div className="flex items-center gap-2 text-green-600 text-sm">
                                                <CheckCircle2 size={16} />
                                                Payment verified by your agent
                                            </div>
                                        ) : milestone.status === "uploaded" ? (
                                            <div className="flex items-center gap-2 text-blue-600 text-sm">
                                                <ImageIcon size={16} />
                                                Uploaded: {milestone.uploadedFile}
                                            </div>
                                        ) : milestone.status === "rejected" ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                                    <AlertCircle size={16} />
                                                    Your proof was rejected. Please upload again.
                                                </div>
                                                <label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileUpload(e, milestone.id)}
                                                    />
                                                    <Button variant="outline" className="w-full" asChild>
                                                        <span>
                                                            <Upload size={16} className="mr-2" />
                                                            Re-upload Proof ({milestone.expectedFileName}.jpg)
                                                        </span>
                                                    </Button>
                                                </label>
                                            </div>
                                        ) : (
                                            <label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleFileUpload(e, milestone.id)}
                                                    disabled={isUploading}
                                                />
                                                <Button variant="outline" className="w-full border-dashed" asChild disabled={isUploading}>
                                                    <span>
                                                        {isUploading ? (
                                                            <><Loader2 size={16} className="mr-2 animate-spin" />Uploading...</>
                                                        ) : (
                                                            <><Upload size={16} className="mr-2" />Upload Proof ({milestone.expectedFileName}.jpg)</>
                                                        )}
                                                    </span>
                                                </Button>
                                            </label>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Trust Badge */}
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
                    <p className="text-gray-500 mt-1">Configure and verify client payments</p>
                </div>

                {/* Add New Milestone */}
                <Card className="border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-base">Add Payment Milestone</CardTitle>
                        <CardDescription>Define what payments the client needs to make</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Input
                                placeholder="Milestone Name (e.g., Reservation Fee)"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                className="flex-1 min-w-[200px]"
                            />
                            <Input
                                placeholder="Amount"
                                type="number"
                                value={newAmount}
                                onChange={(e) => setNewAmount(e.target.value)}
                                className="w-32"
                            />
                            <Input
                                placeholder="Expected Filename"
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                className="w-48"
                            />
                            <Button onClick={addMilestone} className="bg-[#0247ae] hover:bg-[#023a8a]">
                                <Plus size={16} className="mr-2" />
                                Add
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Expected filename is what the client must include in their upload (e.g., &quot;reservation_fee&quot; for reservation_fee.jpg)
                        </p>
                    </CardContent>
                </Card>

                {/* Milestones List */}
                <Card className="border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-base">Payment Milestones</CardTitle>
                        <CardDescription>Track and verify client payments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {milestones.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Wallet size={32} className="mx-auto mb-2 text-gray-300" />
                                <p>No milestones configured</p>
                                <p className="text-sm">Add payment milestones above</p>
                            </div>
                        ) : (
                            milestones.map(milestone => (
                                <div key={milestone.id} className={`p-4 rounded-xl border ${milestone.status === "uploaded" ? "border-blue-300 bg-blue-50" :
                                        milestone.status === "verified" ? "border-green-300 bg-green-50" :
                                            milestone.status === "rejected" ? "border-red-300 bg-red-50" :
                                                "border-gray-200 bg-white"
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-semibold text-gray-900">{milestone.label}</h4>
                                                {getStatusBadge(milestone.status)}
                                            </div>
                                            <p className="text-lg font-bold text-gray-900 mt-1">₱{milestone.amount.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500 mt-1">Expected file: {milestone.expectedFileName}.*</p>

                                            {milestone.uploadedFile && (
                                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                                    <ImageIcon size={14} />
                                                    <span>Uploaded: {milestone.uploadedFile}</span>
                                                    <span className="text-gray-400">({new Date(milestone.uploadedAt!).toLocaleString()})</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {milestone.status === "uploaded" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 border-green-300 hover:bg-green-100"
                                                        onClick={() => handleVerify(milestone.id, true)}
                                                    >
                                                        <ThumbsUp size={16} className="mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 border-red-300 hover:bg-red-100"
                                                        onClick={() => handleVerify(milestone.id, false)}
                                                    >
                                                        <ThumbsDown size={16} className="mr-1" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            {milestone.status === "pending" && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => removeMilestone(milestone.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="border-gray-200">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-gray-500">Total Required</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ₱{milestones.reduce((sum, m) => sum + m.amount, 0).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-200">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-gray-500">Verified</p>
                            <p className="text-2xl font-bold text-green-600">
                                ₱{milestones.filter(m => m.status === "verified").reduce((sum, m) => sum + m.amount, 0).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-200">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-orange-600">
                                ₱{milestones.filter(m => m.status !== "verified").reduce((sum, m) => sum + m.amount, 0).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
