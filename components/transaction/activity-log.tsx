"use client";

import { useState, useEffect } from "react";
import { Clock, User, FileText, MessageSquare, CreditCard, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ActivityLog {
    id: string;
    actor_id: string;
    actor_role: string;
    action: string;
    details?: Record<string, unknown>;
    created_at: string;
}

interface ActivityLogProps {
    transactionId: string;
}

const ACTION_CONFIG: Record<string, { icon: typeof Clock; color: string; label: string }> = {
    transaction_created: { icon: CheckCircle, color: "text-green-600", label: "Transaction Created" },
    transaction_updated: { icon: FileText, color: "text-blue-600", label: "Transaction Updated" },
    transaction_cancelled: { icon: AlertCircle, color: "text-red-600", label: "Transaction Cancelled" },
    client_joined: { icon: User, color: "text-purple-600", label: "Client Joined" },
    message: { icon: MessageSquare, color: "text-gray-600", label: "Message Sent" },
    document_upload_initiated: { icon: FileText, color: "text-orange-600", label: "Document Uploaded" },
    document_updated: { icon: FileText, color: "text-blue-600", label: "Document Updated" },
    document_deleted: { icon: FileText, color: "text-red-600", label: "Document Deleted" },
    payment_received: { icon: CreditCard, color: "text-green-600", label: "Payment Received" },
};

export function ActivityLog({ transactionId }: ActivityLogProps) {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [transactionId]);

    const fetchLogs = async () => {
        try {
            const response = await fetch(`/api/transactions/${transactionId}/logs`, {
                headers: { "x-user-id": "demo-user" },
            });
            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs || []);
            }
        } catch (error) {
            console.error("Failed to fetch activity logs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getActionConfig = (action: string) => {
        return ACTION_CONFIG[action] || { icon: Clock, color: "text-gray-500", label: action };
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#0247ae]" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Activity Log</h3>

            {logs.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No activity yet</p>
            ) : (
                <div className="space-y-4">
                    {logs.map((log, index) => {
                        const config = getActionConfig(log.action);
                        const Icon = config.icon;

                        return (
                            <div key={log.id} className="flex gap-3">
                                {/* Timeline line */}
                                <div className="flex flex-col items-center">
                                    <div className={`h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ${config.color}`}>
                                        <Icon size={16} />
                                    </div>
                                    {index < logs.length - 1 && (
                                        <div className="w-0.5 h-full bg-gray-200 mt-1" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-4">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-gray-900 text-sm">{config.label}</p>
                                        <span className="text-xs text-gray-400">{formatTime(log.created_at)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 capitalize mt-0.5">
                                        by {log.actor_role}
                                    </p>
                                    {log.details && Object.keys(log.details).length > 0 && log.action !== "message" && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {JSON.stringify(log.details).slice(0, 50)}...
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
