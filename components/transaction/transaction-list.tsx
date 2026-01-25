"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ArrowUpRight, Building2, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "../ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";
import type { Transaction, TransactionStatus } from "@/lib/types/transaction";
import { CreateTransactionModal } from "./create-transaction-modal";

export default function TransactionList() {
    const { userId } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all" | "archived">("all");

    // ...

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

    // ...

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

        <CreateTransactionModal
            onTransactionCreated={fetchTransactions}
            trigger={
                <Button className="bg-[#0247ae] hover:bg-[#0560d4] text-white shrink-0">
                    <Plus size={18} className="mr-2" />
                    New Transaction
                </Button>
            }
        />
    </div>
                    </div >

        {/* Transactions List */ }
        < div className = "space-y-4" >
        {
            isLoading?(
                            <div className = "text-center py-12 text-gray-400" > Loading transactions...</div>
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
        <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions match your search.</p>
        </div>
    )
}
                    </div >
                </>
            )}
        </div >
    );
}
