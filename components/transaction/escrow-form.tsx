"use client";

import { useState } from "react";
import { DollarSign, CreditCard, Building, Calendar, CheckCircle2, Clock, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentMilestone {
    id: string;
    label: string;
    amount: number;
    dueDate: string;
    status: "paid" | "pending" | "overdue";
}

interface EscrowFormProps {
    transactionId: string;
}

export function EscrowForm({ transactionId }: EscrowFormProps) {
    const [milestones] = useState<PaymentMilestone[]>([
        { id: "1", label: "Reservation Fee", amount: 50000, dueDate: "2026-01-15", status: "paid" },
        { id: "2", label: "Down Payment (10%)", amount: 500000, dueDate: "2026-02-01", status: "pending" },
        { id: "3", label: "Equity Payment 1", amount: 250000, dueDate: "2026-03-01", status: "pending" },
        { id: "4", label: "Equity Payment 2", amount: 250000, dueDate: "2026-04-01", status: "pending" },
    ]);

    const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
    const paidAmount = milestones.filter(m => m.status === "paid").reduce((sum, m) => sum + m.amount, 0);
    const progressPercent = (paidAmount / totalAmount) * 100;

    const getStatusIcon = (status: PaymentMilestone["status"]) => {
        switch (status) {
            case "paid":
                return <CheckCircle2 size={18} className="text-green-500" />;
            case "overdue":
                return <AlertCircle size={18} className="text-red-500" />;
            default:
                return <Clock size={18} className="text-yellow-500" />;
        }
    };

    const getStatusBadge = (status: PaymentMilestone["status"]) => {
        switch (status) {
            case "paid":
                return <Badge className="bg-green-100 text-green-700 border-0">Paid</Badge>;
            case "overdue":
                return <Badge className="bg-red-100 text-red-700 border-0">Overdue</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-700 border-0">Pending</Badge>;
        }
    };

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Escrow & Payments</h2>
                <p className="text-sm text-gray-500">Track payment milestones and escrow status</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-gray-200">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <DollarSign size={24} className="text-[#0247ae]" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Contract</p>
                                    <p className="text-2xl font-bold text-gray-900">₱{totalAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                                    <CheckCircle2 size={24} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Amount Paid</p>
                                    <p className="text-2xl font-bold text-green-600">₱{paidAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <Clock size={24} className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Remaining</p>
                                    <p className="text-2xl font-bold text-orange-600">₱{(totalAmount - paidAmount).toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Bar */}
                <Card className="border-gray-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Payment Progress</CardTitle>
                            <span className="text-sm font-medium text-[#0247ae]">{progressPercent.toFixed(0)}%</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#0247ae] to-[#0560d4] transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Milestones */}
                <Card className="border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-base">Payment Schedule</CardTitle>
                        <CardDescription>Track your payment milestones</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {milestones.map((milestone, index) => (
                            <div
                                key={milestone.id}
                                className={`flex items-center gap-4 p-4 rounded-xl border ${milestone.status === "paid"
                                        ? "bg-green-50/50 border-green-200"
                                        : "bg-white border-gray-200"
                                    }`}
                            >
                                <div className="flex items-center justify-center">
                                    {getStatusIcon(milestone.status)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-gray-900">{milestone.label}</h4>
                                        {getStatusBadge(milestone.status)}
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">₱{milestone.amount.toLocaleString()}</p>
                                    {milestone.status === "pending" && (
                                        <Button size="sm" className="mt-2 bg-[#0247ae] hover:bg-[#0560d4] text-white">
                                            Pay Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Escrow Info */}
                <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-[#0247ae]/10 flex items-center justify-center shrink-0">
                                <Shield size={24} className="text-[#0247ae]" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Funds Protected by Escrow</h4>
                                <p className="text-sm text-gray-600">
                                    All payments are held in a secure escrow account until transaction milestones are verified.
                                    Your funds are protected until both parties confirm completion.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
