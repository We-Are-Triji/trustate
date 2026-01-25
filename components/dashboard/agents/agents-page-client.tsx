"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { Copy, RefreshCw, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateTOTPCode, getTOTPTimeRemaining } from "@/lib/totp";
import { getCurrentUser } from "@/lib/cognito";

export default function AgentsPageClient() {
    const { isLoading } = useAuth();
    const [userId, setUserId] = useState<string | null>(null);
    const [nexusCode, setNexusCode] = useState<string | null>(null);
    const [totpSecret, setTotpSecret] = useState<string | null>(null);
    const [currentCode, setCurrentCode] = useState("");
    const [timeRemaining, setTimeRemaining] = useState(30);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [requests, setRequests] = useState<any[]>([]);

    useEffect(() => {
        initUser();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchNexus();
            fetchRequests();
        }
    }, [userId]);

    useEffect(() => {
        if (totpSecret) {
            updateCode();
            const interval = setInterval(() => {
                const remaining = getTOTPTimeRemaining();
                setTimeRemaining(remaining);
                if (remaining === 30) {
                    updateCode();
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [totpSecret]);

    const initUser = async () => {
        try {
            const user = await getCurrentUser();
            setUserId(user.userId);
        } catch (error) {
            console.error("Failed to get user:", error);
        }
    };

    const fetchNexus = async () => {
        try {
            const res = await fetch(`/api/broker/nexus-info?brokerId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setNexusCode(data.nexus_code);
                setTotpSecret(data.totp_secret);
            }
            // 404 is expected when no nexus exists yet
        } catch (error) {
            console.error("Failed to fetch nexus:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await fetch(`/api/broker/requests?brokerId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests || []);
            }
        } catch (err) {
            console.error("Failed to fetch requests", err);
        }
    };

    const generateNexus = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/broker/nexus/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brokerId: userId }),
            });
            if (res.ok) {
                await fetchNexus();
            }
        } catch (error) {
            console.error("Failed to generate nexus:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateCode = () => {
        if (totpSecret) {
            setCurrentCode(generateTOTPCode(totpSecret));
        }
    };

    const copyNexusLink = () => {
        const link = `${window.location.origin}/nexus/${nexusCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleRespondRequest = async (requestId: string, action: "accept" | "reject") => {
        if (!userId) return;
        setProcessingId(requestId);

        try {
            const res = await fetch("/api/broker/requests/respond", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId,
                    action,
                    brokerId: userId,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to respond to request");
            }

            // Refresh requests list
            await fetchRequests();
        } catch (error) {
            console.error(`Failed to ${action} request:`, error);
            alert(`Failed to ${action} request. Please try again.`);
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
                <div className="animate-spin h-8 w-8 border-4 border-[#0247ae] border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!nexusCode) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
                <div className="text-center max-w-md">
                    <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-[#0247ae]/10 flex items-center justify-center">
                        <Shield className="h-10 w-10 text-[#0247ae]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Nexus Link</h2>
                    <p className="text-gray-600 mb-6">
                        Create your unique nexus link to allow agents to connect with you securely.
                    </p>
                    <Button onClick={generateNexus} className="bg-[#0247ae]">
                        Generate Nexus Link
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Agents</h1>

            <div className="bg-white rounded-xl border p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-[#0247ae]" />
                    <h2 className="text-lg font-semibold text-gray-900">Broker Nexus Link</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Your Nexus Link
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/nexus/${nexusCode}`}
                                className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 text-gray-700"
                            />
                            <Button onClick={copyNexusLink} variant="outline">
                                <Copy className="h-4 w-4 mr-2" />
                                {copied ? "Copied!" : "Copy"}
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Share this link with agents who want to connect with you
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Current Verification Code
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="text-4xl font-mono font-bold text-[#0247ae] tracking-wider">
                                {currentCode}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>{timeRemaining}s</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Provide this code to agents during verification (refreshes every 30 seconds)
                        </p>
                    </div>

                    <Button variant="outline" className="w-full">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset Nexus Link
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Pending Agent Requests</h3>

                {requests.length === 0 ? (
                    <p className="text-sm text-gray-500">No pending requests</p>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-[#0247ae]/10 flex items-center justify-center text-[#0247ae] font-semibold">
                                        {req.agent?.firstName?.[0] || "A"}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {req.agent?.firstName} {req.agent?.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500">{req.agent?.email || "Unknown Email"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                        onClick={() => handleRespondRequest(req.id, "accept")}
                                        disabled={processingId === req.id}
                                    >
                                        {processingId === req.id ? "..." : "Accept"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
