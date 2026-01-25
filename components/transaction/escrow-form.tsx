"use client";

import { Shield, Wallet, ArrowRight, Building2, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EscrowFormProps {
    transactionId: string;
}

export function EscrowForm({ transactionId }: EscrowFormProps) {
    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Escrow & Payments</h2>
                    <p className="text-gray-500 mt-1">Secure payment handling for your transaction</p>
                </div>

                {/* How It Works */}
                <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-white">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Shield size={20} className="text-[#0247ae]" />
                            How Trustate Escrow Works
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-gray-100">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                    <Wallet size={24} className="text-[#0247ae]" />
                                </div>
                                <h4 className="font-semibold text-gray-900">1. You Pay</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Funds are deposited to Trustate&apos;s secure escrow account
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-gray-100">
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                    <Shield size={24} className="text-green-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900">2. We Hold</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Funds are protected until requirements are verified
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-gray-100">
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                                    <Building2 size={24} className="text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900">3. We Release</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Once confirmed, funds are released to the developer
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <Info size={20} className="text-amber-600 shrink-0" />
                            <p className="text-sm text-amber-800">
                                <strong>Your money is never sent directly to the developer.</strong> Trustate holds all funds in escrow
                                and only releases them when all transaction milestones are verified and approved.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Empty State - Payment Schedule */}
                <Card className="border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-base">Payment Schedule</CardTitle>
                        <CardDescription>Your payment milestones will appear here</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <Wallet size={32} className="text-gray-400" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">No Payments Yet</h4>
                            <p className="text-sm text-gray-500 max-w-md">
                                Your agent will configure the payment schedule for this transaction.
                                Once set up, you&apos;ll be able to make secure payments directly through this page.
                            </p>
                        </div>
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
