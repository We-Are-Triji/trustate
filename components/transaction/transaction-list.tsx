"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, ArrowUpRight, Building2, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";
import type { Transaction, TransactionStatus } from "@/lib/types/transaction";

export default function TransactionList() {
    const { userId } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");

    useEffect(() => {
        // TODO: Replace with actual API call
        const fetchTransactions = async () => {
            try {
                // Mock data for now
                const mockTransactions: Transaction[] = [
                    {
                        id: "1",
                        status: "documents_pending",
                        agent_id: userId || "",
                        property_address: "123 Serenity Lane, Makati City",
                        property_type: "condo",
                        transaction_value: 15000000,
                        access_code: "TRX-123456",
                        access_code_expires_at: new Date(Date.now() + 86400000).toISOString(),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                    {
                        id: "2",
                        status: "completed",
                        agent_id: userId || "",
                        property_address: "Block 5 Lot 2, Nuvali, Santa Rosa",
                        property_type: "house_lot",
                        transaction_value: 25000000,
                        access_code: "TRX-789012",
                        access_code_expires_at: new Date(Date.now() - 86400000).toISOString(),
                        created_at: new Date(Date.now() - 604800000).toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                ];
                setTransactions(mockTransactions);
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setIsLoading(false);
            }
        };

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
            t.access_code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track and manage your real estate deals</p>
                </div>
                <Button
                    className="bg-[#0247ae] hover:bg-[#0560d4] text-white"
                    onClick={() => router.push("/transaction")}
                >
                    <Plus size={18} className="mr-2" />
                    New Transaction
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search property or transaction ID..."
                        className="pl-10 bg-white dark:bg-gray-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 text-sm overflow-x-auto pb-2 sm:pb-0">
                    <Button
                        variant={statusFilter === "all" ? "default" : "outline"}
                        onClick={() => setStatusFilter("all")}
                        className={statusFilter === "all" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : ""}
                    >
                        All
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
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <Button
                            onClick={() => router.push("/transaction")}
                            className="bg-[#0247ae] hover:bg-[#0560d4] text-white"
                        >
                            Create Transaction
                        </Button>
                        <h3 className="text-gray-900 dark:text-white font-medium mt-3 mb-1">No transactions found</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Get started by creating your first transaction</p>
                    </div>
                )}
            </div>
        </div>
    );
}
