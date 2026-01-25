"use client";

import { useState, useEffect } from "react";
import { UserPlus, Copy, RefreshCw, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ClientInviteSectionProps {
    transactionId: string;
    accessCode: string;
    expiresAt: string;
    clientStatus: "none" | "pending" | "approved" | "rejected";
    pendingClientName?: string;
    onApprove?: () => void;
    onReject?: () => void;
}

export function ClientInviteSection({
    transactionId,
    accessCode,
    expiresAt,
    clientStatus,
    pendingClientName,
    onApprove,
    onReject,
}: ClientInviteSectionProps) {
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    useEffect(() => {
        const updateTimeLeft = () => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const diff = expiry - now;

            if (diff <= 0) {
                setTimeLeft("Expired");
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                setTimeLeft(`${days}d ${hours}h`);
            }
        };

        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 60000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const handleAction = async (action: "approve" | "reject") => {
        setIsProcessing(true);
        try {
            const response = await fetch(`/api/transactions/${transactionId}/client/approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": "demo-user", // TODO: Get from auth
                },
                body: JSON.stringify({ action }),
            });

            if (response.ok) {
                toast.success(`Client ${action}d successfully`);
                if (action === "approve") onApprove?.();
                else onReject?.();
            } else {
                toast.error("Failed to process request");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsProcessing(false);
        }
    };

    if (clientStatus === "approved") {
        return null; // Don't show invite section if client is approved
    }

    // Pending Approval State
    if (clientStatus === "pending") {
        return (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Pending Client Request</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium text-gray-900">{pendingClientName}</span> wants to join this transaction.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleAction("reject")}
                            disabled={isProcessing}
                        >
                            Reject
                        </Button>
                        <Button
                            className="bg-[#0247ae] hover:bg-[#0560d4] text-white"
                            onClick={() => handleAction("approve")}
                            disabled={isProcessing}
                        >
                            Approve Access
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Invite State
    const inviteLink = origin ? `${origin}/transaction/join?ref=${transactionId}` : "Loading...";

    return (
        <div className="bg-gradient-to-r from-[#0247ae]/5 to-[#0247ae]/10 border border-[#0247ae]/10 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#0247ae]">
                    <UserPlus size={24} />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        Invite Client
                        <Badge variant="outline" className="bg-white/50 text-[#0247ae] border-[#0247ae]/20 text-[10px] h-5">
                            Expires in {timeLeft}
                        </Badge>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Share these details with your client to join securely.
                    </p>
                </div>
            </div>

            <div className="space-y-5">
                {/* Invite Link Row */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Invite Link</label>
                    <div className="flex gap-3">
                        <Input
                            readOnly
                            value={inviteLink}
                            className="bg-white font-mono text-sm text-gray-600 h-11"
                        />
                        <Button
                            variant="outline"
                            className="bg-white border-gray-200 text-gray-700 hover:text-[#0247ae] hover:border-[#0247ae] shrink-0 h-11 px-4"
                            onClick={() => copyToClipboard(inviteLink, "Invite Link")}
                        >
                            <Copy size={16} />
                        </Button>
                    </div>
                </div>

                {/* Access Code Row */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Access Code</label>
                    <div className="flex gap-3">
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg h-11 px-4 flex items-center shadow-sm">
                            <span className="text-lg font-mono font-bold text-gray-900 tracking-[0.2em]">{accessCode}</span>
                        </div>
                        <Button
                            className="bg-[#0247ae] hover:bg-[#0560d4] text-white shrink-0 h-11 px-6"
                            onClick={() => copyToClipboard(accessCode, "Access Code")}
                        >
                            <Copy size={16} className="mr-2" />
                            Copy Code
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
