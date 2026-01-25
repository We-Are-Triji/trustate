"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { Copy, RefreshCw, Shield, Clock, UserCheck, UserPlus, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateTOTPCode, getTOTPTimeRemaining } from "@/lib/totp";
import { getCurrentUser } from "@/lib/cognito";
import { cn } from "@/lib/utils";

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
    const [activeTab, setActiveTab] = useState<"agents" | "settings">("agents");

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

    const activeAgents = useMemo(() => requests.filter(r => r.status === "accepted"), [requests]);
    const pendingRequests = useMemo(() => requests.filter(r => r.status === "pending"), [requests]);

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
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your connected agents and invitations</p>
                </div>
                {/* Tabs Navigation */}
                <div className="bg-gray-100/80 p-1 rounded-lg flex items-center gap-1 self-start md:self-auto">
                    <button
                        onClick={() => setActiveTab("agents")}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                            activeTab === "agents"
                                ? "bg-white text-[#0247ae] shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        )}
                    >
                        <Users className="h-4 w-4" />
                        My Agents
                        {(activeAgents.length > 0 || pendingRequests.length > 0) && (
                            <span className="bg-[#0247ae]/10 text-[#0247ae] text-xs px-2 py-0.5 rounded-full">
                                {activeAgents.length + pendingRequests.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                            activeTab === "settings"
                                ? "bg-white text-[#0247ae] shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        )}
                    >
                        <Settings className="h-4 w-4" />
                        Nexus Settings
                    </button>
                </div>
            </div>

            {activeTab === "agents" ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Pending Requests Section */}
                    {pendingRequests.length > 0 && (
                        <div className="bg-amber-50 rounded-xl border border-amber-100 p-6">
                            <h3 className="flex items-center gap-2 font-semibold text-amber-900 mb-4">
                                <UserPlus className="h-5 w-5" />
                                Pending Requests
                            </h3>
                            <div className="space-y-3">
                                {pendingRequests.map((req) => (
                                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-amber-200/50 shadow-sm gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                                                {req.agent?.firstName?.[0] || "?"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {req.agent?.firstName} {req.agent?.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500">{req.agent?.email || "No email"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={() => handleRespondRequest(req.id, "reject")}
                                                disabled={processingId === req.id}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 sm:flex-none bg-[#0247ae] hover:bg-[#0247ae]/90"
                                                onClick={() => handleRespondRequest(req.id, "accept")}
                                                disabled={processingId === req.id}
                                            >
                                                {processingId === req.id ? "..." : "Accept"}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Active Agents Section */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-[#0247ae]" />
                            Active Agents
                        </h3>
                        {activeAgents.length === 0 ? (
                            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-12 text-center">
                                <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                    <Users className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No agents yet</h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    You haven&apos;t connected with any agents yet. Share your Nexus link to start building your network.
                                </p>
                                <Button
                                    onClick={() => setActiveTab("settings")}
                                    className="bg-[#0247ae] hover:bg-[#0247ae]/90"
                                >
                                    Get Nexus Link
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeAgents.map((req) => (
                                    <div key={req.id} className="flex items-center p-4 bg-white rounded-xl border hover:border-[#0247ae]/30 transition-colors shadow-sm">
                                        <div className="h-12 w-12 rounded-full bg-[#0247ae]/5 text-[#0247ae] flex items-center justify-center font-bold text-lg mr-4">
                                            {req.agent?.firstName?.[0] || "?"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {req.agent?.firstName} {req.agent?.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">{req.agent?.email || "No email available"}</p>
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-medium text-emerald-700">Active</span>
                                                <span className="text-xs text-gray-400 ml-2">
                                                    Joined {new Date(req.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white rounded-xl border p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                            <div className="h-10 w-10 rounded-full bg-[#0247ae]/10 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-[#0247ae]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Nexus Security Settings</h2>
                                <p className="text-sm text-gray-500">Manage your secure connection credentials</p>
                            </div>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Your Permanent Nexus Link
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/nexus/${nexusCode}`}
                                        className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
                                    />
                                    <Button onClick={copyNexusLink} variant="outline" className="shrink-0">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Share this unique link with agents. They will need a verification code to complete the connection.
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Live Verification Code (TOTP)
                                </label>
                                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border">
                                    <div className="text-3xl font-mono font-bold text-[#0247ae] tracking-widest">
                                        {currentCode}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto border-l pl-4">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-medium">{timeRemaining}s</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    This code refreshes every 30 seconds. Provide this to agents only when you are ready to approve them.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t">
                            <Button variant="outline" className="text-gray-600 hover:text-red-600 hover:bg-red-50 border-gray-200">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Rotate Nexus Keys (Reset All Connections)
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
