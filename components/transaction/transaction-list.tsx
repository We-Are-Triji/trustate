"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ArrowUpRight, Building2, Calendar, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "../ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";
import type { Transaction, TransactionStatus } from "@/lib/types/transaction";
import { CreateTransactionModal } from "./create-transaction-modal";
import { JoinTransactionModal } from "./join-transaction-modal";

export default function TransactionList() {
    const { userId, accountType, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all" | "archived">("all");

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            // Try API first
            const response = await fetch("/api/transactions", {
                headers: {
                    "x-user-id": userId || "demo-user",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTransactions(data.transactions || []);
            } else {
                // Fallback to localStorage
                const stored = localStorage.getItem("mock_transactions");
                if (stored) {
                    setTransactions(JSON.parse(stored));
                } else {
                    setTransactions([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch transactions from API:", error);
            // Fallback to localStorage
            const stored = localStorage.getItem("mock_transactions");
            if (stored) {
                setTransactions(JSON.parse(stored));
            } else {
                setTransactions([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchTransactions();
        }
    }, [userId]);

    const getStatusColor = (status: TransactionStatus) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "cancelled": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case "initiated": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            default: return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
        }
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.property_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.access_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.project_name?.toLowerCase().includes(searchQuery.toLowerCase()); // Added project name search

        let matchesStatus = false;
        if (statusFilter === "all") {
            // Show all except cancelled
            matchesStatus = t.status !== "cancelled";
        } else if (statusFilter === "archived") {
            matchesStatus = t.status === "cancelled";
        } else {
            matchesStatus = t.status === statusFilter;
        }

        return matchesSearch && matchesStatus;
    });

    const hasTransactions = transactions.length > 0;

    if (authLoading) {
        return (
            <div className="p-8 flex justify-center items-center h-[calc(100vh-100px)]">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div className={`p-8 ${!hasTransactions ? "flex flex-col h-[calc(100vh-100px)] justify-center" : ""}`}>
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 ${!hasTransactions ? "hidden" : ""}`}>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track and manage your real estate deals</p>
                </div>
            </div>

            {!hasTransactions ? (
                <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                        <Building2 size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No transactions yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Get started by creating your first real estate transaction.
                    </p>
                    {accountType === "client" ? (
                        <JoinTransactionModal onTransactionJoined={fetchTransactions} />
                    ) : (
                        <CreateTransactionModal
                            onTransactionCreated={fetchTransactions}
                            trigger={
                                <Button className="bg-[#0247ae] hover:bg-[#0560d4] text-white">
                                    <Plus size={18} className="mr-2" />
                                    Create Transaction
                                </Button>
                            }
                        />
                    )}
                </div>
            ) : (
                <>
                    {/* Filters & Actions */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                placeholder="Search property, ID, or project..."
                                className="pl-10 bg-white dark:bg-gray-800"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-1 w-full justify-between md:justify-end gap-3 items-center">
                            <div className="flex gap-2 text-sm overflow-x-auto pb-2 md:pb-0">
                                <Button
                                    variant={statusFilter === "all" ? "default" : "outline"}
                                    onClick={() => setStatusFilter("all")}
                                    className={statusFilter === "all" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : ""}
                                >
                                    Ongoing
                                </Button>
                                <Button
                                    variant={statusFilter === "documents_pending" ? "default" : "outline"}
                                    onClick={() => setStatusFilter("documents_pending")}
                                    className={statusFilter === "documents_pending" ? "bg-orange-500 text-white" : ""}
                                >
                                    Pending
                                </Button>
                                <Button
                                    variant={statusFilter === "completed" ? "default" : "outline"}
                                    onClick={() => setStatusFilter("completed")}
                                    className={statusFilter === "completed" ? "bg-green-600 text-white" : ""}
                                >
                                    Completed
                                </Button>
                                <Button
                                    variant={statusFilter === "archived" ? "default" : "outline"}
                                    onClick={() => setStatusFilter("archived")}
                                    className={statusFilter === "archived" ? "bg-gray-600 text-white" : ""}
                                >
                                    Archived
                                </Button>
                            </div>

                            {accountType === "client" ? (
                                <JoinTransactionModal onTransactionJoined={fetchTransactions} />
                            ) : (
                                <CreateTransactionModal
                                    onTransactionCreated={fetchTransactions}
                                    trigger={
                                        <Button className="bg-[#0247ae] hover:bg-[#0560d4] text-white shrink-0">
                                            <Plus size={18} className="mr-2" />
                                            New Transaction
                                        </Button>
                                    }
                                />
                            )}
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="text-center py-12 text-gray-400">Loading transactions...</div>
                        ) : filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    onClick={() => router.push(`/transaction/${transaction.id}`)}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <Badge className={`${getStatusColor(transaction.status)} border-0 capitalize`}>
                                                    {transaction.status.replace("_", " ")}
                                                </Badge>
                                                <span className="text-xs text-gray-400 font-mono hidden md:block">{transaction.access_code}</span>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[#0247ae] dark:group-hover:text-[#0560d4] transition-colors">
                                                {transaction.property_address}
                                            </h3>

                                            {transaction.project_name && (
                                                <p className="text-sm text-gray-500 mb-2 font-medium">{transaction.project_name}</p>
                                            )}

                                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mt-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 size={16} className="text-gray-400" />
                                                    <span className="capitalize">{transaction.property_type.replace("_", " ")}</span>
                                                </div>
                                                {transaction.transaction_value && (
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign size={16} className="text-gray-400" />
                                                        <span>₱{transaction.transaction_value.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-gray-400" />
                                                    <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-[#0247ae]/10 dark:group-hover:bg-[#0560d4]/20 transition-colors">
                                                <ArrowUpRight size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-[#0247ae] dark:group-hover:text-[#0560d4]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions match your search.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
