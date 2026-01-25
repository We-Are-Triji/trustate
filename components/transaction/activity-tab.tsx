"use client";

import { useState, useEffect } from "react";
import { Clock, User, Eye, Upload, MessageSquare, CheckCircle2, Shield, FileText, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface ActivityLog {
    id: string;
    actor_id: string;
    actor_type: "agent" | "client" | "system";
    action_type: string;
    description: string;
    metadata: any;
    created_at: string;
}

interface ActivityTabProps {
    transactionId: string;
}

export function ActivityTab({ transactionId }: ActivityTabProps) {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    useEffect(() => {
        fetchLogs(1);
    }, [transactionId]);

    const fetchLogs = async (pageNum: number) => {
        try {
            if (pageNum === 1) setIsLoading(true);
            else setIsFetchingMore(true);

            const response = await fetch(`/api/transactions/${transactionId}/activity?page=${pageNum}&limit=20`);
            if (response.ok) {
                const data = await response.json();
                if (pageNum === 1) {
                    setLogs(data.logs || []);
                } else {
                    setLogs(prev => [...prev, ...(data.logs || [])]);
                }
                setHasMore(data.pagination.hasMore);
                setPage(pageNum);
            }
        } catch (error) {
            console.error("Failed to fetch activity logs:", error);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!isFetchingMore && hasMore) {
            fetchLogs(page + 1);
        }
    };

    const getIcon = (actionType: string) => {
        switch (actionType) {
            case "view": return <Eye size={16} className="text-gray-500" />;
            case "upload": return <Upload size={16} className="text-blue-500" />;
            case "message": return <MessageSquare size={16} className="text-purple-500" />;
            case "approve": return <CheckCircle2 size={16} className="text-green-500" />;
            case "join": return <User size={16} className="text-orange-500" />;
            case "create": return <Shield size={16} className="text-[#0247ae]" />;
            default: return <Clock size={16} className="text-gray-400" />;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-gray-100 z-0" />

                    {logs.length === 0 && !isLoading ? (
                        <div className="text-center py-10 text-gray-500">
                            No activity recorded yet.
                        </div>
                    ) : (
                        <>
                            {logs.map((log) => (
                                <div key={log.id} className="relative z-10 flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                                        {getIcon(log.action_type)}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {log.description}
                                            </p>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                {format(new Date(log.created_at), "MMM d, h:mm a")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${log.actor_type === "agent" ? "bg-blue-50 text-blue-600" :
                                                log.actor_type === "client" ? "bg-green-50 text-green-600" :
                                                    "bg-gray-100 text-gray-600"
                                                }`}>
                                                {log.actor_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {hasMore && (
                                <div className="text-center pt-4 relative z-10">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={isFetchingMore}
                                        className="text-xs text-[#0247ae] hover:underline disabled:opacity-50"
                                    >
                                        {isFetchingMore ? "Loading..." : "Load Older Activity"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
